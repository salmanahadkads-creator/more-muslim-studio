/* Carousel model: each runtime layer is one slide of the Instagram carousel.
   The LayersPanel is the slide navigator (select, reorder, rename, hide,
   delete); per-slide control values are snapshotted into the
   "carousel.slides" runtime value keyed by layer id and swapped when the
   selected layer changes. */

import type { ToolcraftCommand, ToolcraftState } from "@/toolcraft/runtime";

import { getEpisodeIllustration } from "./brand";

export const SLIDE_VALUE_TARGETS = [
  "post.template",
  "post.colourway",
  "content.episode",
  "content.cover.presents",
  "content.cover.title",
  "content.quote.dialogue",
  "content.synopsis.body",
  "content.streaming.lines",
  "content.credits.list",
  "scene.source",
  "scene.illustration",
  "scene.imagePosition",
  "scene.imageZoom",
] as const;

export type SlideSnapshot = Record<string, unknown>;
export type CarouselSlides = Record<string, SlideSnapshot>;

export function captureSlideValues(state: ToolcraftState): SlideSnapshot {
  const snapshot: SlideSnapshot = {};

  for (const target of SLIDE_VALUE_TARGETS) {
    snapshot[target] = state.values[target];
  }

  return snapshot;
}

export function readCarouselSlides(state: ToolcraftState): CarouselSlides {
  const value = state.values["carousel.slides"];

  return value && typeof value === "object" ? { ...(value as CarouselSlides) } : {};
}

export function applySlideValues(
  dispatch: (command: ToolcraftCommand) => void,
  snapshot: SlideSnapshot,
): void {
  for (const target of SLIDE_VALUE_TARGETS) {
    if (target in snapshot) {
      dispatch({
        historyGroup: "carousel-slide-switch",
        target,
        type: "controls.setValue",
        value: snapshot[target],
      });
    }
  }
}

export function writeCarouselSlides(
  dispatch: (command: ToolcraftCommand) => void,
  slides: CarouselSlides,
): void {
  dispatch({
    historyGroup: "carousel-slide-switch",
    target: "carousel.slides",
    type: "controls.setValue",
    value: slides,
  });
}

let slideSequence = 0;

export function makeSlideLayerId(): string {
  slideSequence += 1;

  return `slide-${Date.now().toString(36)}-${slideSequence}`;
}

/* The standard five-post launch set from the legacy studio's
   buildEpisodePostSet: Cover, Synopsis x2, Credits, Now Streaming. */
export function buildEpisodeSetSnapshots(
  base: SlideSnapshot,
  episodeValue: string,
): { name: string; snapshot: SlideSnapshot }[] {
  const episode = getEpisodeIllustration(episodeValue);
  const title = episode?.label.replace(/^E\d+\s+/, "") ?? "Episode";
  const episodeNumber = episode?.value.replace(/^ep/, "") ?? "1";
  const marker = `S1 E${episodeNumber}`;
  const illustrationScene = {
    "scene.illustration": episodeValue,
    "scene.imagePosition": { x: 0, y: 0 },
    "scene.imageZoom": 1,
    "scene.source": "illustration",
  };
  const patternScene = {
    "scene.source": "pattern",
  };
  const common = { ...base, "content.episode": marker };

  return [
    {
      name: "Cover",
      snapshot: {
        ...common,
        ...illustrationScene,
        "content.cover.presents": "More Muslim presents",
        "content.cover.title": title,
        "post.colourway": "night",
        "post.template": "cover",
      },
    },
    {
      name: "Synopsis 1",
      snapshot: {
        ...common,
        ...patternScene,
        "content.episode": title,
        "post.colourway": "beige",
        "post.template": "synopsis",
      },
    },
    {
      name: "Synopsis 2",
      snapshot: {
        ...common,
        ...patternScene,
        "content.episode": title,
        "content.synopsis.body":
          "What does it mean when an AI becomes your spiritual guide?",
        "post.colourway": "beige",
        "post.template": "synopsis",
      },
    },
    {
      name: "Credits",
      snapshot: {
        ...common,
        ...illustrationScene,
        "post.colourway": "night",
        "post.template": "credits",
      },
    },
    {
      name: "Now Streaming",
      snapshot: {
        ...common,
        ...illustrationScene,
        "content.episode": `Episode ${episodeNumber}`,
        "post.colourway": "night",
        "post.template": "streaming",
      },
    },
  ];
}
