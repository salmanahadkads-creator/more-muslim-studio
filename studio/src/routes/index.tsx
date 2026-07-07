import { ToolcraftApp } from "@/toolcraft/runtime/react";

import { appSchema } from "../app/app-schema";
import {
  buildEpisodeSetSnapshots,
  captureSlideValues,
  makeSlideLayerId,
  readCarouselSlides,
  writeCarouselSlides,
} from "../app/carousel";
import { exportAudiogramVideo } from "../app/export-audiogram";
import { exportCarouselZip, exportPostImage } from "../app/export-post";
import { CarouselFilmstrip } from "../app/carousel-filmstrip";
import { PostRenderer } from "../app/post-renderer";
import { SceneImageControls } from "../app/scene-image-controls";
import { StudioChrome } from "../app/studio-chrome";
import "../app/brand.css";

export function AppHome(): React.JSX.Element {
  return (
    <>
      <StudioChrome />
      <ToolcraftApp
      canvasContent={
          <>
            <PostRenderer />
            <CarouselFilmstrip />
            <SceneImageControls />
          </>
        }
      className="h-dvh min-h-dvh"
      onPanelAction={({ action, dispatch, reportProgress, state }) => {
        if (action.value === "export-png") {
          return exportPostImage(state);
        }

        if (action.value === "export-zip") {
          return exportCarouselZip(state, reportProgress);
        }

        if (action.value === "export-video") {
          return exportAudiogramVideo(state, reportProgress);
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
