/* Carousel filmstrip — a bottom-centre overlay that replaces the layers panel
   as the slide navigator. Each slide is a runtime layer; the strip shows a
   mini render per slide, a trailing "+" to add one, click-to-select, and
   pointer drag to reorder. Rendered through a portal so it floats over the
   canvas as app chrome rather than product output. */

import * as React from "react";
import { createPortal } from "react-dom";

import type { ToolcraftLayer } from "@/toolcraft/runtime";
import { useToolcraft } from "@/toolcraft/runtime/react";

import { POST_SIZES } from "./brand";
import {
  captureSlideValues,
  makeSlideLayerId,
  readCarouselSlides,
  writeCarouselSlides,
  type SlideSnapshot,
} from "./carousel";
import { PostSlide, slideViewFromValues } from "./post-renderer";

const OAK = "#511C14";
const THUMB_H = 104;

function SlideThumb({
  onClick,
  selected,
  values,
}: {
  onClick: () => void;
  selected: boolean;
  values: SlideSnapshot;
}): React.JSX.Element {
  const { mediaAssets } = useToolcraft().state;
  const view = slideViewFromValues(values, mediaAssets, true);
  const native = POST_SIZES.portrait;
  const scale = THUMB_H / native.h;

  return (
    <button
      aria-pressed={selected}
      onClick={onClick}
      style={{
        background: "#fff",
        border: "none",
        borderRadius: 4,
        cursor: "pointer",
        flex: "none",
        height: THUMB_H,
        outline: selected ? `2px solid ${OAK}` : "2px solid transparent",
        outlineOffset: 1,
        overflow: "hidden",
        padding: 0,
        position: "relative",
        width: Math.round(native.w * scale),
      }}
      type="button"
    >
      <div
        style={{
          height: native.h,
          pointerEvents: "none",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: native.w,
        }}
      >
        <PostSlide
          format="portrait"
          scene={view.scene}
          template={view.template}
          values={values}
          way={view.way}
        />
      </div>
    </button>
  );
}

export function CarouselFilmstrip(): React.JSX.Element | null {
  const { dispatch, state } = useToolcraft();
  const layers = state.layers;
  const slides = readCarouselSlides(state);
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);
  const [overIndex, setOverIndex] = React.useState<number | null>(null);

  // The selected slide reflects live values; the rest use their snapshot.
  const valuesFor = (layer: ToolcraftLayer): SlideSnapshot =>
    layer.id === state.selectedLayerId
      ? captureSlideValues(state)
      : (slides[layer.id] ?? captureSlideValues(state));

  const addSlide = () => {
    const next = readCarouselSlides(state);

    // Starting a carousel from a single post: snapshot the current post as the
    // first slide before adding a second.
    if (layers.length === 0) {
      const firstId = makeSlideLayerId();

      next[firstId] = captureSlideValues(state);
      dispatch({ layer: { id: firstId, name: "Slide 1" }, type: "layers.add" });
    }

    const layerId = makeSlideLayerId();

    next[layerId] = captureSlideValues(state);
    writeCarouselSlides(dispatch, next);
    dispatch({
      layer: { id: layerId, name: `Slide ${layers.length + (layers.length === 0 ? 2 : 1)}` },
      type: "layers.add",
    });
    dispatch({ layerId, type: "layers.select" });
  };

  const selectSlide = (layer: ToolcraftLayer) => {
    if (layer.id !== state.selectedLayerId) {
      dispatch({ layerId: layer.id, type: "layers.select" });
    }
  };

  const commitReorder = (from: number, to: number) => {
    if (from === to) {
      return;
    }

    const next = [...layers];
    const [moved] = next.splice(from, 1);

    next.splice(to, 0, moved);
    dispatch({ layers: next, type: "layers.reorder" });
  };

  const strip = (
    <div
      data-testid="carousel-filmstrip"
      style={{
        alignItems: "flex-end",
        backdropFilter: "blur(24px) saturate(1.5)",
        background: "rgba(251,242,233,0.86)",
        border: "1px solid rgba(81,28,20,0.16)",
        borderRadius: 10,
        bottom: 66,
        boxShadow: "0 12px 32px rgba(81,28,20,0.16)",
        display: "flex",
        gap: 8,
        left: "50%",
        maxWidth: "min(760px, 60vw)",
        overflowX: "auto",
        padding: 8,
        position: "fixed",
        transform: "translateX(-50%)",
        WebkitBackdropFilter: "blur(24px) saturate(1.5)",
        zIndex: 42,
      }}
    >
      {layers.map((layer, index) => (
        <div
          data-slide-index={index}
          draggable
          key={layer.id}
          onDragEnd={() => {
            setDragIndex(null);
            setOverIndex(null);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setOverIndex(index);
          }}
          onDragStart={() => setDragIndex(index)}
          onDrop={(event) => {
            event.preventDefault();

            if (dragIndex !== null) {
              commitReorder(dragIndex, index);
            }

            setDragIndex(null);
            setOverIndex(null);
          }}
          style={{
            opacity: dragIndex === index ? 0.4 : 1,
            outline:
              overIndex === index && dragIndex !== null && dragIndex !== index
                ? `2px dashed ${OAK}`
                : "none",
            outlineOffset: 2,
            position: "relative",
          }}
        >
          <SlideThumb
            onClick={() => selectSlide(layer)}
            selected={layer.id === state.selectedLayerId}
            values={valuesFor(layer)}
          />
          <span
            style={{
              bottom: 2,
              color: "#F6E1C6",
              fontFamily: '"ABC Diatype", sans-serif',
              fontSize: 9,
              left: 3,
              letterSpacing: "0.08em",
              pointerEvents: "none",
              position: "absolute",
              textShadow: "0 1px 2px rgba(0,0,0,0.6)",
            }}
          >
            {index + 1}
          </span>
        </div>
      ))}
      <button
        aria-label="Add slide"
        onClick={addSlide}
        style={{
          alignItems: "center",
          background: "rgba(81,28,20,0.04)",
          border: "1px dashed rgba(81,28,20,0.3)",
          borderRadius: 4,
          color: OAK,
          cursor: "pointer",
          display: "flex",
          flex: "none",
          fontSize: 24,
          height: THUMB_H,
          justifyContent: "center",
          width: Math.round(POST_SIZES.portrait.w * (THUMB_H / POST_SIZES.portrait.h)),
        }}
        title="Add a slide to the carousel"
        type="button"
      >
        +
      </button>
    </div>
  );

  return createPortal(strip, document.body);
}
