/* Product renderer: draws the selected More Muslim post template at its native
   output size and scales it to the runtime canvas. Format (4:5 portrait vs
   9:16 story) is derived from the runtime canvas aspect so the runtime Setup
   sizing controls stay the single owner of output dimensions. */

import * as React from "react";

import {
  evaluateToolcraftTimelineValues,
  shouldIncludeToolcraftPreviewBackground,
  toolcraftTimelinePanelExtendedTarget,
  type ToolcraftState,
} from "@/toolcraft/runtime";
import { useToolcraft } from "@/toolcraft/runtime/react";

import {
  COLOURWAYS,
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
  type CarouselSlides,
} from "./carousel";
import {
  applyBlockTextOverrides,
  buildSpeechBlocks,
  computeAudioEnvelope,
  speakersOf,
  type AudiogramMotionConfig,
  type BlockTextOverride,
} from "./audiogram-motion";
import { readCredits } from "./credits";
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

/* Percent sliders (0–200%) arrive as numbers; renderers use them as factors.
   Keyframe interpolation can hand back fractional values — pass them through
   untouched so automation curves stay smooth. */
export function readPercentFactor(value: unknown, fallbackFactor: number): number {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, value / 100)
    : fallbackFactor;
}

/* Highlight-picker line selection: the user can pin one or many caption lines
   as large pull-quotes. Stored as an array of 1-based line numbers (a legacy
   single number is still accepted). Returns sorted, de-duplicated 0-based
   block indices. */
export function readHighlightLines(value: unknown): number[] {
  const raw = Array.isArray(value)
    ? value
    : typeof value === "number"
      ? [value]
      : [];
  const indices = raw
    .filter((entry): entry is number => typeof entry === "number" && Number.isFinite(entry))
    .map((line) => Math.round(line) - 1)
    .filter((index) => index >= 0);

  return [...new Set(indices)].sort((first, second) => first - second);
}

/* Highlight-picker typo-fix overrides: a plain object keyed by 0-based block
   index, each entry recording the original line (`from`) alongside the
   correction (`to`) so a fix never applies to a different caption file's
   line. Written by the custom control (see audiogram-highlight-picker.tsx).
   Read defensively — an empty/missing/legacy-shaped value means no
   corrections yet. */
export function readBlockOverrides(value: unknown): Record<number, BlockTextOverride> {
  if (typeof value !== "object" || value === null) {
    return {};
  }

  const out: Record<number, BlockTextOverride> = {};

  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    const index = Number(key);

    if (!Number.isInteger(index) || typeof entry !== "object" || entry === null) {
      continue;
    }

    const record = entry as Record<string, unknown>;

    if (typeof record.from === "string" && typeof record.to === "string") {
      out[index] = { from: record.from, to: record.to };
    }
  }

  return out;
}

/* fileDrop stores files as data URLs; captions need the decoded text. */
export function decodeCaptionAsset(dataUrl: string): string {
  const commaIndex = dataUrl.indexOf(",");

  if (commaIndex === -1) {
    return "";
  }

  const payload = dataUrl.slice(commaIndex + 1);

  try {
    if (/;base64/i.test(dataUrl.slice(0, commaIndex))) {
      const binary = atob(payload);
      const bytes = new Uint8Array(binary.length);

      for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
      }

      // TextDecoder, not the decodeURIComponent(percent-escape) idiom this
      // used to use. That idiom threw URIError on any non-UTF-8 byte, and the
      // catch below turned the throw into "" — so a Windows-1252 .srt (a very
      // common subtitle-tool output) rendered an audiogram with NO captions at
      // all and no error. TextDecoder substitutes U+FFFD instead of throwing,
      // so a stray byte costs one glyph rather than the whole transcript.
      // It also avoids allocating one string per byte of the file, which this
      // runs on every render via the highlight picker.
      return new TextDecoder().decode(bytes);
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
    // Preview uses the lightweight copy; the Canvas export loads the full-res
    // source independently.
    image = getEpisodeIllustration(values["scene.illustration"])?.previewSrc ?? null;
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
    imageOpacity: Math.min(1, readPercentFactor(values["scene.imageOpacity"], 1)),
    imageZoom: zoom,
    includeBackground,
    pattern: source !== "solid",
  };

  return { scene, template, way };
}

export function usePostSlideValues() {
  const { state } = useToolcraft();
  // The live preview reads keyframe-evaluated values at the playhead so
  // automated targets (image opacity, backdrop colour) render their
  // in-between values; filmstrip thumbnails keep their raw snapshots.
  const values = React.useMemo(
    () => evaluateToolcraftTimelineValues(state, state.timeline.currentTimeSeconds),
    [state],
  );
  const view = slideViewFromValues(
    values,
    state.mediaAssets,
    shouldIncludeToolcraftPreviewBackground({ state }),
  );

  return { ...view, state, values };
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
            credits: readCredits(values["content.credits.list"]),
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

  const wasPlayingRef = React.useRef(false);
  const timelineTimeRef = React.useRef(state.timeline.currentTimeSeconds);

  timelineTimeRef.current = state.timeline.currentTimeSeconds;

  React.useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (state.timeline.isPlaying) {
      // Starting playback aligns the audio exactly to the playhead — the old
      // 0.35s tolerance here let the voice start a third of a second away
      // from the captions and stay there.
      if (!wasPlayingRef.current) {
        audio.currentTime = state.timeline.currentTimeSeconds;
      }

      void audio.play().catch(() => undefined);
    } else {
      audio.pause();

      if (Math.abs(audio.currentTime - state.timeline.currentTimeSeconds) > 0.1) {
        audio.currentTime = state.timeline.currentTimeSeconds;
      }
    }

    wasPlayingRef.current = state.timeline.isPlaying;
  }, [state.timeline.isPlaying, state.timeline.currentTimeSeconds]);

  // While playing, the audio element's own clock is the master: it is what
  // the listener actually hears, including output latency and any element
  // drift the wall-clock timeline cannot see. Each frame the timeline is
  // snapped to audio.currentTime, so captions and words stay locked to the
  // voice instead of tolerating a growing offset. A LARGE gap means the
  // playhead was moved on purpose (scrub or loop wrap) — then the audio
  // follows the timeline instead.
  React.useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !state.timeline.isPlaying) {
      return;
    }

    let frame = 0;

    const tick = () => {
      if (!audio.paused && !audio.seeking) {
        const delta = audio.currentTime - timelineTimeRef.current;

        // Element-clock drift accumulates gradually, so anything beyond 0.2s
        // is an intentional playhead move (scrub step, drag, loop wrap): the
        // audio follows the timeline. Small offsets are clock skew between
        // what is heard and what is drawn: the timeline follows the audio.
        if (Math.abs(delta) >= 0.2) {
          audio.currentTime = timelineTimeRef.current;
        } else if (Math.abs(delta) > 0.04) {
          dispatch({
            currentTimeSeconds: audio.currentTime,
            type: "timeline.setCurrentTime",
          });
        }
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.timeline.isPlaying, audioUrl]);

  return null;
}

/* Shows the runtime timeline (and its transport) only for the audiogram, which
   is the one timeline-driven template; static post templates hide it. Entering
   audiogram mode also opens the extended transport (play, scrubber, duration,
   loop) so the timeline is immediately usable — the compact play-only default
   plus the buried Setup switch made it too easy to miss. The extended flag is
   only synced on the template TRANSITION, so a user who collapses the strip
   while staying in audiogram mode is not fought. Renders nothing — it only
   mirrors runtime panel state. */
function TimelinePanelSync(): null {
  const { dispatch, state } = useToolcraft();
  const isAudiogram = state.values["post.template"] === "audiogram";
  const hidden = state.panels.timeline.hidden === true;
  // Starts false (not the current template) so a session that mounts directly
  // into audiogram mode still gets the one-shot extend.
  const wasAudiogramRef = React.useRef(false);

  React.useEffect(() => {
    const shouldHide = !isAudiogram;

    if (shouldHide !== hidden) {
      dispatch({ hidden: shouldHide, panelId: "timeline", type: "panels.setHidden" });
    }
  }, [isAudiogram, hidden, dispatch]);

  React.useEffect(() => {
    if (wasAudiogramRef.current === isAudiogram) {
      return;
    }

    wasAudiogramRef.current = isAudiogram;
    dispatch({
      historyGroup: "timeline-panel-sync",
      target: toolcraftTimelinePanelExtendedTarget,
      type: "controls.setValue",
      value: isAudiogram,
    });
  }, [isAudiogram, dispatch]);

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

    // Completing the wizard starts a NEW post: drop slide layers left over
    // from earlier work (e.g. an old episode set that led with a cover) so the
    // filmstrip starts from the post being set up, not a stale carousel.
    for (const layer of state.layers) {
      dispatch({ layerId: layer.id, type: "layers.delete" });
    }

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
      writeCarouselSlides(dispatch, {});
    } else if (mode === "carousel") {
      // Fresh set, not appended to leftovers — the layers were cleared above.
      const slides: CarouselSlides = {};
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
      writeCarouselSlides(dispatch, {});

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
        // `close()` must run even when decode rejects — the catch below
        // swallows the error, so a leaked context here would be invisible and
        // would accumulate on every failed upload until Chrome's concurrent
        // AudioContext cap made the whole app unable to read audio.
        const audioContext = new AudioContext();
        let buffer: AudioBuffer;

        try {
          buffer = await audioContext.decodeAudioData(bytes);
        } finally {
          await audioContext.close();
        }

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
  const blockOverridesValue = values["audiogram.blockOverrides"];
  const speechBlocks = React.useMemo(
    () => applyBlockTextOverrides(buildSpeechBlocks(captions), readBlockOverrides(blockOverridesValue)),
    [captions, blockOverridesValue],
  );
  const guest = React.useMemo(() => speakersOf(speechBlocks).guest, [speechBlocks]);
  const audioUrl = isAudiogram
    ? (state.mediaAssets.find((asset) => asset.sourceTarget === "audiogram.audio")?.dataUrl ??
      null)
    : null;
  const envelope = useAudioEnvelope(audioUrl);
  // Keyframed automation (motion intensity, caption size) evaluates at the
  // playhead so preview frames match the export's per-frame evaluation.
  const evaluated = React.useMemo(
    () => evaluateToolcraftTimelineValues(state, timelineTime),
    [state, timelineTime],
  );
  const highlightMode = readString(values["audiogram.highlight"], "auto");
  const guestWay = (readString(values["audiogram.guestColourway"], "oak") || "oak") as ColourwayKey;
  const hostWay = (readString(values["audiogram.hostColourway"], "beige") || "beige") as ColourwayKey;
  const audiogramConfig: AudiogramMotionConfig = {
    bgDrift: values["audiogram.breathing"] !== false,
    breathe: values["audiogram.breathing"] !== false,
    captionScale: readPercentFactor(evaluated["audiogram.captionSize"], 1),
    guestWay: COLOURWAYS[guestWay] ? guestWay : "oak",
    hasImage: !!scene.image,
    highlight:
      highlightMode === "off"
        ? "off"
        : highlightMode === "choose"
          ? readHighlightLines(values["audiogram.highlightLine"])
          : "auto",
    hostWay: COLOURWAYS[hostWay] ? hostWay : "beige",
    motionScale: readPercentFactor(evaluated["audiogram.motionIntensity"], 1),
    solid: !scene.image && scene.pattern === false,
    speakerSwap: values["audiogram.crossfade"] !== false,
    wordAccent: values["audiogram.wordAccent"] !== false,
  };
  const audiogramEyebrow =
    readString(values["audiogram.eyebrow"]).trim() || readString(values["content.episode"]);
  const audiogramOutro = readString(
    values["audiogram.outro"],
    "Listen to the full episode at moremuslim.org.\nOr search for “More Muslim” wherever you get your podcasts.",
  )
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean);

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
      <TimelinePanelSync />
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
              eyebrow: audiogramEyebrow,
              guest,
              outroLines: audiogramOutro,
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
