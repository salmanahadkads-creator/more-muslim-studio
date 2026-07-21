import { toast, Toaster } from "sonner";

import { ToolcraftApp } from "@/toolcraft/runtime/react";

import { appSchema } from "../app/app-schema";
import { AudiogramHighlightPicker } from "../app/audiogram-highlight-picker";
import {
  buildEpisodeSetSnapshots,
  captureSlideValues,
  makeSlideLayerId,
  readCarouselSlides,
  writeCarouselSlides,
} from "../app/carousel";
import { CarouselFilmstrip } from "../app/carousel-filmstrip";
import { CreditsEditor } from "../app/credits-editor";
import { InlineTextEditor } from "../app/inline-text-editor";
import { PostRenderer } from "../app/post-renderer";
import { SceneImageControls } from "../app/scene-image-controls";
import { StudioChrome } from "../app/studio-chrome";
import "../app/brand.css";

/* Every export failure used to die in the runtime's console.error — the
   client saw the progress bar vanish, no file, no explanation. Route every
   export promise through here so a failure becomes a visible toast. The
   rejection is swallowed on purpose: the toast IS the surfacing, and the
   runtime's own catch would only log it a second time. */
function surfaceExportErrors(work: Promise<void>, label: string): Promise<void> {
  return work.catch((error: unknown) => {
    const detail =
      error instanceof Error && error.message
        ? error.message
        : "Something went wrong — try again, or try the other format.";

    toast.error(`${label} failed`, { description: detail, duration: 10_000 });
    console.error(`${label} failed.`, error);
  });
}

export function AppHome(): React.JSX.Element {
  return (
    <>
      <Toaster closeButton position="top-center" richColors />
      <StudioChrome />
      <ToolcraftApp
      canvasContent={
          <>
            <PostRenderer />
            <CarouselFilmstrip />
            <SceneImageControls />
            <InlineTextEditor />
          </>
        }
      className="h-dvh min-h-dvh"
      controlRenderers={{
        audiogramHighlightPicker: AudiogramHighlightPicker,
        creditsEditor: CreditsEditor,
      }}
      onPanelAction={({ action, dispatch, reportProgress, state }) => {
        // Export pipelines are lazy-loaded so the heavy WebCodecs muxers and
        // Canvas painters stay out of the initial bundle until an export runs.
        if (action.value === "export-png") {
          return surfaceExportErrors(
            import("../app/export-post").then((m) => m.exportPostImage(state)),
            "PNG export",
          );
        }

        if (action.value === "export-zip") {
          return surfaceExportErrors(
            import("../app/export-post").then((m) =>
              m.exportCarouselZip(state, reportProgress),
            ),
            "Carousel export",
          );
        }

        if (action.value === "export-video") {
          // Pause the preview first: autoplay keeps the whole app re-rendering
          // every frame, which competes with the encode loop for the main
          // thread and roughly doubles export time for no benefit.
          if (state.timeline.isPlaying) {
            dispatch({ isPlaying: false, type: "timeline.setPlaying" });
          }

          return surfaceExportErrors(
            import("../app/export-audiogram").then((m) =>
              m.exportAudiogramVideo(state, reportProgress),
            ),
            "Video export",
          );
        }

        if (action.value === "carousel-add-slide") {
          const layerId = makeSlideLayerId();
          const slides = readCarouselSlides(state);

          slides[layerId] = captureSlideValues(state);
          writeCarouselSlides(dispatch, slides);
          dispatch({
            layer: { id: layerId, name: `Slide ${state.layers.length + 1}` },
            type: "layers.add",
          });
          dispatch({ layerId, type: "layers.select" });
          return;
        }

        if (action.value === "carousel-build-episode-set") {
          const episode =
            typeof state.values["carousel.episode"] === "string"
              ? (state.values["carousel.episode"] as string)
              : "ep1";
          const slides = readCarouselSlides(state);
          const set = buildEpisodeSetSnapshots(captureSlideValues(state), episode);
          let firstLayerId: string | null = null;

          for (const { name, snapshot } of set) {
            const layerId = makeSlideLayerId();

            firstLayerId ??= layerId;
            slides[layerId] = snapshot;
            dispatch({ layer: { id: layerId, name }, type: "layers.add" });
          }

          writeCarouselSlides(dispatch, slides);

          if (firstLayerId) {
            dispatch({ layerId: firstLayerId, type: "layers.select" });
          }
        }
      }}
      renderDefaultCanvasMedia={false}
        schema={appSchema}
      />
    </>
  );
}
