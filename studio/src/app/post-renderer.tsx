/* Product renderer: draws the selected More Muslim post template at its native
   output size and scales it to the runtime canvas. Format (4:5 portrait vs
   9:16 story) is derived from the runtime canvas aspect so the runtime Setup
   sizing controls stay the single owner of output dimensions. */

import * as React from "react";

import { shouldIncludeToolcraftPreviewBackground } from "@/toolcraft/runtime";
import { useToolcraft } from "@/toolcraft/runtime/react";

import {
  getEpisodeIllustration,
  getPostFormat,
  POST_SIZES,
  type ColourwayKey,
} from "./brand";
import {
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

export function usePostSlideValues() {
  const { state } = useToolcraft();
  const values = state.values;
  const template = (readString(values["post.template"], "cover") ||
    "cover") as PostTemplateKey;
  const way = (readString(values["post.colourway"], "night") ||
    "night") as ColourwayKey;
  const source = readString(values["scene.source"], "pattern") || "pattern";
  const position =
    values["scene.imagePosition"] &&
    typeof values["scene.imagePosition"] === "object"
      ? (values["scene.imagePosition"] as { x?: number; y?: number })
      : { x: 50, y: 50 };
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
    const uploaded = state.mediaAssets.find(
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
    imageOffsetX: typeof position.x === "number" ? position.x : 50,
    imageOffsetY: typeof position.y === "number" ? position.y : 50,
    imageZoom: zoom,
    includeBackground: shouldIncludeToolcraftPreviewBackground({ state }),
    pattern: source !== "solid",
  };

  return { scene, state, template, values, way };
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

export function PostRenderer(): React.JSX.Element {
  const { scene, state, template, values, way } = usePostSlideValues();
  const canvasWidth = state.canvas.size.width;
  const canvasHeight = state.canvas.size.height;
  const format = getPostFormat(canvasWidth, canvasHeight);
  const native = POST_SIZES[format];
  const scale = Math.min(canvasWidth / native.w, canvasHeight / native.h);

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
      <div
        style={{
          flex: "none",
          height: native.h,
          transform: `scale(${scale})`,
          transformOrigin: "center",
          width: native.w,
        }}
      >
        <PostSlide
          format={format}
          scene={scene}
          template={template}
          values={values}
          way={way}
        />
      </div>
    </div>
  );
}
