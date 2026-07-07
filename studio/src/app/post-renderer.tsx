/* Product renderer: draws the selected More Muslim post template at its native
   output size and scales it to the runtime canvas. Format (4:5 portrait vs
   9:16 story) is derived from the runtime canvas aspect so the runtime Setup
   sizing controls stay the single owner of output dimensions. */

import * as React from "react";

import {
  shouldIncludeToolcraftPreviewBackground,
  type ToolcraftState,
} from "@/toolcraft/runtime";
import { useToolcraft } from "@/toolcraft/runtime/react";

import {
  getEpisodeIllustration,
  getPostFormat,
  POST_SIZES,
  type ColourwayKey,
} from "./brand";
import {
  applySlideValues,
  buildEpisodeSetSnapshots,
  captureSlideValues,
  makeSlideLayerId,
  readCarouselSlides,
  writeCarouselSlides,
} from "./carousel";
import {
  buildSpeechBlocks,
  computeAudioEnvelope,
  speakersOf,
  type AudiogramMotionConfig,
} from "./audiogram-motion";
import { parseSrt } from "./srt";
import {
  AudiogramPost,
  CoverPost,
  CreditsPost,
  NowStreamingPost,
  QuotePost,
  SynopsisPost,
  type PostTemplateKey,
  type SceneProps,
} from "./templates";

function readString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

/* fileDrop stores files as data URLs; captions need the decoded text. */
function decodeCaptionAsset(dataUrl: string): string {
  const commaIndex = dataUrl.indexOf(",");

  if (commaIndex === -1) {
    return "";
  }

  const payload = dataUrl.slice(commaIndex + 1);

  try {
    if (/;base64/i.test(dataUrl.slice(0, commaIndex))) {
      const bytes = atob(payload);

      return decodeURIComponent(
        Array.from(bytes, (char) =>
          `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`,
        ).join(""),
      );
    }

    return decodeURIComponent(payload);
  } catch {
    return "";
  }
}

/* The vector pad writes -1..1 per axis (as strings while dragging); the crop
   focus is a 0..100 object-position percentage. */
export function readFocusPercent(value: unknown): { x: number; y: number } {
  const raw =
    value && typeof value === "object"
      ? (value as { x?: unknown; y?: unknown })
      : {};
  const toPercent = (axis: unknown): number => {
    const parsed = typeof axis === "string" ? Number.parseFloat(axis) : axis;

    if (typeof parsed !== "number" || Number.isNaN(parsed)) {
      return 50;
    }

    return Math.min(100, Math.max(0, (parsed + 1) * 50));
  };

  return { x: toPercent(raw.x), y: toPercent(raw.y) };
}

/* "Speaker: quote" per line -> exchange list; lines without a speaker
   continue the previous exchange. */
function parseDialogue(dialogue: string): { speaker: string; text: string }[] {
  const exchanges: { speaker: string; text: string }[] = [];

  for (const rawLine of dialogue.split(/\n/)) {
    const line = rawLine.trim();

    if (!line) {
      continue;
    }

    const match = line.match(/^([^:]{1,40}):\s*(.+)$/);

    if (match) {
      exchanges.push({ speaker: match[1].trim(), text: match[2].trim() });
    } else if (exchanges.length > 0) {
      exchanges[exchanges.length - 1].text += ` ${line}`;
    } else {
      exchanges.push({ speaker: "", text: line });
    }
  }

  return exchanges;
}

/* Pure derivation of a slide's render inputs from a values snapshot — used by
   both the live preview and the filmstrip thumbnails. */
export function slideViewFromValues(
  values: Record<string, unknown>,
  mediaAssets: ToolcraftState["mediaAssets"],
  includeBackground: boolean,
): { scene: SceneProps; template: PostTemplateKey; way: ColourwayKey } {
  const template = (readString(values["post.template"], "cover") ||
    "cover") as PostTemplateKey;
  const way = (readString(values["post.colourway"], "night") ||
    "night") as ColourwayKey;
  const source = readString(values["scene.source"], "pattern") || "pattern";
  const position = readFocusPercent(values["scene.imagePosition"]);
  const zoom =
    typeof values["scene.imageZoom"] === "number"
      ? (values["scene.imageZoom"] as number)
      : 1;

  let image: string | null = null;
  let imageRotation = 0;
  let imageFlipHorizontal = false;
  let imageFlipVertical = false;

  if (source === "illustration") {
    image = getEpisodeIllustration(values["scene.illustration"])?.src ?? null;
  } else if (source === "upload") {
    const uploaded = mediaAssets.find(
      (asset) => asset.sourceTarget === "scene.upload",
    );

    image = uploaded?.dataUrl ?? null;
    imageRotation = uploaded?.transform?.rotationDeg ?? 0;
    imageFlipHorizontal = uploaded?.transform?.flipHorizontal ?? false;
    imageFlipVertical = uploaded?.transform?.flipVertical ?? false;
  }

  const scene: SceneProps = {
    image,
    imageFlipHorizontal,
    imageFlipVertical,
    imageRotation,
    imageOffsetX: position.x,
    imageOffsetY: position.y,
    imageZoom: zoom,
    includeBackground,
    pattern: source !== "solid",
  };

  return { scene, template, way };
}

export function usePostSlideValues() {
  const { state } = useToolcraft();
  const view = slideViewFromValues(
    state.values,
    state.mediaAssets,
    shouldIncludeToolcraftPreviewBackground({ state }),
  );

  return { ...view, state, values: state.values };
}

export function PostSlide({
  format,
  scene,
  template,
  values,
  way,
}: {
  format: "portrait" | "story";
  scene: SceneProps;
  template: PostTemplateKey;
  values: Record<string, unknown>;
  way: ColourwayKey;
}): React.JSX.Element {
  switch (template) {
    case "quote":
      return (
        <QuotePost
          format={format}
          scene={scene}
          values={{
            episode: readString(values["content.episode"]),
            exchanges: parseDialogue(readString(values["content.quote.dialogue"])),
          }}
          way={way}
        />
      );
    case "synopsis":
      return (
        <SynopsisPost
          format={format}
          scene={scene}
          values={{
            episode: readString(values["content.episode"]),
            paragraphs: readString(values["content.synopsis.body"])
              .split(/\n\s*\n/)
              .map((paragraph) => paragraph.trim())
              .filter(Boolean),
          }}
          way={way}
        />
      );
    case "streaming":
      return (
        <NowStreamingPost
          format={format}
          scene={scene}
          values={{
            episode: readString(values["content.episode"]),
            lines: readString(values["content.streaming.lines"])
              .split(/\n/)
              .map((line) => line.trim())
              .filter(Boolean),
          }}
          way={way}
        />
      );
    case "credits":
      return (
        <CreditsPost
          format={format}
          scene={scene}
          values={{
            credits: readString(values["content.credits.list"]),
            episode: readString(values["content.episode"]),
          }}
          way={way}
        />
      );
    default:
      return (
        <CoverPost
          format={format}
          scene={scene}
          values={{
            episode: readString(values["content.episode"]),
            presents: readString(values["content.cover.presents"]),
            title: readString(values["content.cover.title"]),
          }}
          way={way}
        />
      );
  }
}

/* Plays the uploaded audio in lockstep with the runtime timeline while the
   audiogram template is active, and adopts the audio duration as the timeline
   duration once metadata loads. Renders nothing. */
function AudiogramAudioSync(): null {
  const { dispatch, state } = useToolcraft();
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const isAudiogram = state.values["post.template"] === "audiogram";
  const audioAsset = state.mediaAssets.find(
    (asset) => asset.sourceTarget === "audiogram.audio",
  );
  const audioUrl = isAudiogram ? (audioAsset?.dataUrl ?? null) : null;

  // Adopts the uploaded audio's duration once, when its metadata loads —
  // initialization only; the renderer never resyncs from
  // state.timeline.durationSeconds.
  const adoptAudioDuration = React.useCallback(
    (audio: HTMLAudioElement) => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        dispatch({ durationSeconds: audio.duration, type: "timeline.setDuration" });
      }
    },
    [dispatch],
  );

  React.useEffect(() => {
    if (!audioUrl) {
      audioRef.current?.pause();
      audioRef.current = null;
      return;
    }

    const audio = new Audio(audioUrl);

    audioRef.current = audio;
    audio.preload = "auto";

    const handleMetadata = () => adoptAudioDuration(audio);

    audio.addEventListener("loadedmetadata", handleMetadata);

    return () => {
      audio.removeEventListener("loadedmetadata", handleMetadata);
      audio.pause();
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioUrl]);

  React.useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (state.timeline.isPlaying) {
      if (Math.abs(audio.currentTime - state.timeline.currentTimeSeconds) > 0.35) {
        audio.currentTime = state.timeline.currentTimeSeconds;
      }

      void audio.play().catch(() => undefined);
    } else {
      audio.pause();

      if (Math.abs(audio.currentTime - state.timeline.currentTimeSeconds) > 0.1) {
        audio.currentTime = state.timeline.currentTimeSeconds;
      }
    }
  }, [state.timeline.isPlaying, state.timeline.currentTimeSeconds]);

  return null;
}

/* Applies the onboarding wizard's prefill search params once, then clears
   them from the URL. Renders nothing — app chrome stays out of the canvas. */
function SetupPrefill(): null {
  const { dispatch, state } = useToolcraft();
  const appliedRef = React.useRef(false);

  React.useEffect(() => {
    if (appliedRef.current) {
      return;
    }

    appliedRef.current = true;

    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");

    if (!mode) {
      // First run: nothing persisted or edited yet — open the guided setup,
      // matching the legacy onboarding entry point.
      const isFreshState =
        state.layers.length === 0 &&
        state.mediaAssets.length === 0 &&
        state.values["post.template"] === "cover" &&
        state.values["content.cover.title"] === "Side Entrances" &&
        state.values["post.colourway"] === "night";

      if (isFreshState && window.location.pathname === "/") {
        window.location.replace("/setup");
      }

      return;
    }

    if (mode === "skip") {
      window.history.replaceState(null, "", window.location.pathname);
      return;
    }

    const episode = params.get("episode") ?? "general";
    const scene = params.get("scene") ?? "pattern";
    const way = params.get("way") ?? "night";
    const setValue = (target: string, value: unknown) =>
      dispatch({ historyGroup: "setup-prefill", target, type: "controls.setValue", value });

    setValue("post.colourway", way);

    const episodeEntry =
      episode !== "general"
        ? { marker: `S1 E${episode.replace(/^ep/, "")}`, value: episode }
        : null;

    if (episodeEntry && scene === "illustration") {
      setValue("scene.source", "illustration");
      setValue("scene.illustration", episodeEntry.value);
    } else {
      setValue("scene.source", scene === "solid" ? "solid" : "pattern");
    }

    if (episodeEntry) {
      setValue("content.episode", episodeEntry.marker);
    }

    if (mode === "audiogram") {
      setValue("post.template", "audiogram");
    } else if (mode === "carousel") {
      const slides = readCarouselSlides(state);
      const set = buildEpisodeSetSnapshots(
        captureSlideValues(state),
        episodeEntry?.value ?? "ep1",
      );
      let firstLayerId: string | null = null;

      setValue("carousel.episode", episodeEntry?.value ?? "ep1");

      for (const { name, snapshot } of set) {
        const layerId = makeSlideLayerId();

        firstLayerId ??= layerId;
        slides[layerId] = { ...snapshot, "post.colourway": snapshot["post.colourway"] };
        dispatch({ layer: { id: layerId, name }, type: "layers.add" });
      }

      writeCarouselSlides(dispatch, slides);

      if (firstLayerId) {
        dispatch({ layerId: firstLayerId, type: "layers.select" });
        applySlideValues(dispatch, set[0].snapshot);
      }
    } else {
      setValue("post.template", "cover");

      if (episodeEntry) {
        const label = params.get("title");

        if (label) {
          setValue("content.cover.title", label);
        }
      }
    }

    window.history.replaceState(null, "", window.location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

/* Swaps per-slide control values when the selected slide layer changes.
   Renders nothing — it only mirrors runtime state, so it is not app UI. */
function CarouselSlideSync(): null {
  const { dispatch, state } = useToolcraft();
  const previousLayerRef = React.useRef<string | null>(state.selectedLayerId);

  React.useEffect(() => {
    const previousLayerId = previousLayerRef.current;
    const nextLayerId = state.selectedLayerId;

    if (previousLayerId === nextLayerId) {
      return;
    }

    previousLayerRef.current = nextLayerId;

    const slides = readCarouselSlides(state);

    if (previousLayerId && state.layers.some((layer) => layer.id === previousLayerId)) {
      slides[previousLayerId] = captureSlideValues(state);
    }

    writeCarouselSlides(dispatch, slides);

    if (nextLayerId && slides[nextLayerId]) {
      applySlideValues(dispatch, slides[nextLayerId]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedLayerId]);

  return null;
}

/* Decodes the uploaded audio once into a per-frame loudness envelope (feature 3
   breathing). Cached by data URL so scrubbing/replays never re-decode, and
   shared conceptually with the export path, which recomputes the same envelope
   from its own decoded buffer. */
const audioEnvelopeCache = new Map<string, Float32Array | null>();

function useAudioEnvelope(audioUrl: string | null): Float32Array | null {
  const [envelope, setEnvelope] = React.useState<Float32Array | null>(() =>
    audioUrl ? (audioEnvelopeCache.get(audioUrl) ?? null) : null,
  );

  React.useEffect(() => {
    if (!audioUrl) {
      setEnvelope(null);
      return;
    }

    if (audioEnvelopeCache.has(audioUrl)) {
      setEnvelope(audioEnvelopeCache.get(audioUrl) ?? null);
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const bytes = await (await fetch(audioUrl)).arrayBuffer();
        const audioContext = new AudioContext();
        const buffer = await audioContext.decodeAudioData(bytes);

        await audioContext.close();

        const computed = computeAudioEnvelope(buffer);

        audioEnvelopeCache.set(audioUrl, computed);

        if (!cancelled) {
          setEnvelope(computed);
        }
      } catch {
        audioEnvelopeCache.set(audioUrl, null);

        if (!cancelled) {
          setEnvelope(null);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [audioUrl]);

  return envelope;
}

export function PostRenderer(): React.JSX.Element {
  const { scene, state, template, values, way } = usePostSlideValues();
  const canvasWidth = state.canvas.size.width;
  const canvasHeight = state.canvas.size.height;
  // Read the timeline once (destructured, not dotted) — the audiogram frame is
  // a pure function of this time; it never writes the duration back.
  const { currentTimeSeconds: timelineTime, durationSeconds: timelineDuration } =
    state.timeline;
  const isAudiogram = template === "audiogram";
  const format = isAudiogram ? "story" : getPostFormat(canvasWidth, canvasHeight);
  const native = POST_SIZES[format];
  const scale = Math.min(canvasWidth / native.w, canvasHeight / native.h);
  const captions = React.useMemo(
    () =>
      isAudiogram
        ? parseSrt(
            String(
              state.mediaAssets.find(
                (asset) => asset.sourceTarget === "audiogram.captions",
              )?.dataUrl
                ? decodeCaptionAsset(
                    state.mediaAssets.find(
                      (asset) => asset.sourceTarget === "audiogram.captions",
                    )?.dataUrl ?? "",
                  )
                : "",
            ),
          )
        : [],
    [isAudiogram, state.mediaAssets],
  );
  const speechBlocks = React.useMemo(() => buildSpeechBlocks(captions), [captions]);
  const guest = React.useMemo(() => speakersOf(speechBlocks).guest, [speechBlocks]);
  const audioUrl = isAudiogram
    ? (state.mediaAssets.find((asset) => asset.sourceTarget === "audiogram.audio")?.dataUrl ??
      null)
    : null;
  const envelope = useAudioEnvelope(audioUrl);
  const audiogramConfig: AudiogramMotionConfig = {
    bgDrift: true,
    breathe: true,
    guestWay: (readString(values["audiogram.guestColourway"], way) || way) as ColourwayKey,
    hasImage: !!scene.image,
    highlight: "auto",
    hostWay: way,
    solid: !scene.image && scene.pattern === false,
    speakerSwap: true,
    wordAccent: true,
  };

  return (
    <div
      data-toolcraft-product-output=""
      id="mm-post-slide"
      style={{
        alignItems: "center",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
        width: "100%",
      }}
    >
      <SetupPrefill />
      <CarouselSlideSync />
      <AudiogramAudioSync />
      <div
        style={{
          flex: "none",
          height: native.h,
          transform: `scale(${scale})`,
          transformOrigin: "center",
          width: native.w,
        }}
      >
        {isAudiogram ? (
          <AudiogramPost
            motion={{
              blocks: speechBlocks,
              config: audiogramConfig,
              durationSeconds: timelineDuration,
              envelope,
              episode: readString(values["content.episode"]),
              guest,
              timeSeconds: timelineTime,
            }}
            scene={scene}
            way={way}
          />
        ) : (
          <PostSlide
            format={format}
            scene={scene}
            template={template}
            values={values}
            way={way}
          />
        )}
      </div>
    </div>
  );
}
