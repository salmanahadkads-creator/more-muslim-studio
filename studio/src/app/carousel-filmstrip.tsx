/* Carousel filmstrip — a bottom-centre overlay that replaces the layers panel
   as the slide navigator. Each slide is a runtime layer; the strip shows a
   mini render per slide, a trailing "+" to add one, click-to-select, and
   pointer drag to reorder. Rendered through a portal so it floats over the
   canvas as app chrome rather than product output. */

import * as React from "react";
import { createPortal } from "react-dom";

import type { ToolcraftLayer, ToolcraftState } from "@/toolcraft/runtime";
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

const THUMB_H = 104;

/* Per-slide hover actions (duplicate / delete) on each filmstrip tile. */
const miniButtonStyle: React.CSSProperties = {
  alignItems: "center",
  background: "rgba(0,0,0,0.55)",
  border: "none",
  borderRadius: 3,
  color: "#F6E1C6",
  cursor: "pointer",
  display: "flex",
  fontSize: 11,
  height: 16,
  justifyContent: "center",
  lineHeight: 1,
  padding: 0,
  width: 16,
};

/* Memoised so unselected slide thumbnails (whose snapshot object identity is
   stable across renders) do not re-render on every keystroke — only the
   selected slide, whose live snapshot is a fresh object each render, repaints. */
const SlideThumb = React.memo(function SlideThumb({
  mediaAssets,
  selected,
  values,
}: {
  mediaAssets: ToolcraftState["mediaAssets"];
  selected: boolean;
  values: SlideSnapshot;
}): React.JSX.Element {
  const view = slideViewFromValues(values, mediaAssets, true);
  const native = POST_SIZES.portrait;
  const scale = THUMB_H / native.h;

  return (
    <button
      aria-pressed={selected}
      style={{
        background: "#fff",
        border: "none",
        borderRadius: 4,
        cursor: "pointer",
        flex: "none",
        height: THUMB_H,
        outline: selected ? "2px solid var(--foreground)" : "2px solid transparent",
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
});

export function CarouselFilmstrip(): React.JSX.Element | null {
  const { dispatch, state } = useToolcraft();
  const layers = state.layers;
  const slides = readCarouselSlides(state);
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);
  const [overIndex, setOverIndex] = React.useState<number | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

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

  const duplicateSlide = (index: number) => {
    const layer = layers[index];

    if (!layer) {
      return;
    }

    const next = readCarouselSlides(state);
    const snapshot =
      layer.id === state.selectedLayerId
        ? captureSlideValues(state)
        : (next[layer.id] ?? captureSlideValues(state));
    const layerId = makeSlideLayerId();

    next[layerId] = { ...snapshot };
    writeCarouselSlides(dispatch, next);
    dispatch({ layer: { id: layerId, name: `Slide ${layers.length + 1}` }, type: "layers.add" });
    dispatch({ layerId, type: "layers.select" });
  };

  const deleteSlide = (index: number) => {
    const layer = layers[index];

    // Keep at least one slide — the last one is just the single post.
    if (!layer || layers.length <= 1) {
      return;
    }

    const next = readCarouselSlides(state);

    delete next[layer.id];
    writeCarouselSlides(dispatch, next);
    dispatch({ layerId: layer.id, type: "layers.delete" });
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

  // Real pointer clicks on a portaled subtree do not reliably reach React's
  // root-delegated onClick, so click handling is delegated with a native
  // listener on the container. Handlers are read from a ref so the listener
  // (attached once) always sees the latest closures.
  const handlersRef = React.useRef({ addSlide, deleteSlide, duplicateSlide, layers, selectSlide });

  handlersRef.current = { addSlide, deleteSlide, duplicateSlide, layers, selectSlide };

  React.useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    // The runtime's global pointer handling (canvas pan / panel drag) calls
    // preventDefault + setPointerCapture on pointerdown, which otherwise
    // swallows clicks that land on this floating overlay. Stopping the
    // pointerdown at the strip in the capture phase isolates the filmstrip so
    // the full mouse/click sequence completes normally.
    const stopPointer = (event: PointerEvent) => event.stopPropagation();

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;

      if (target?.closest("[data-filmstrip-add]")) {
        handlersRef.current.addSlide();
        return;
      }

      const slideEl = target?.closest<HTMLElement>("[data-slide-index]");

      if (!slideEl) {
        return;
      }

      const index = Number(slideEl.dataset.slideIndex);

      // Per-slide actions take priority over selecting the tile.
      if (target?.closest("[data-filmstrip-delete]")) {
        handlersRef.current.deleteSlide(index);
        return;
      }

      if (target?.closest("[data-filmstrip-duplicate]")) {
        handlersRef.current.duplicateSlide(index);
        return;
      }

      const layer = handlersRef.current.layers[index];

      if (layer) {
        handlersRef.current.selectSlide(layer);
      }
    };

    container.addEventListener("pointerdown", stopPointer, { capture: true });
    container.addEventListener("click", onClick);

    return () => {
      container.removeEventListener("pointerdown", stopPointer, { capture: true });
      container.removeEventListener("click", onClick);
    };
  }, []);

  const strip = (
    <div
      data-testid="carousel-filmstrip"
      ref={containerRef}
      style={{
        alignItems: "flex-end",
        backdropFilter: "blur(24px) saturate(1.5)",
        background: "color-mix(in oklab, var(--popover) 82%, transparent)",
        border: "1px solid color-mix(in oklab, var(--border) 60%, transparent)",
        borderRadius: 10,
        bottom: 66,
        boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
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
                ? "2px dashed var(--foreground)"
                : "none",
            outlineOffset: 2,
            position: "relative",
          }}
        >
          <SlideThumb
            mediaAssets={state.mediaAssets}
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
          <div style={{ display: "flex", gap: 2, position: "absolute", right: 2, top: 2 }}>
            <button
              aria-label={`Duplicate slide ${index + 1}`}
              data-filmstrip-duplicate=""
              style={miniButtonStyle}
              title="Duplicate slide"
              type="button"
            >
              ⧉
            </button>
            {layers.length > 1 ? (
              <button
                aria-label={`Delete slide ${index + 1}`}
                data-filmstrip-delete=""
                style={miniButtonStyle}
                title="Delete slide"
                type="button"
              >
                ×
              </button>
            ) : null}
          </div>
        </div>
      ))}
      <button
        aria-label="Add slide"
        data-filmstrip-add=""
        style={{
          alignItems: "center",
          background: "color-mix(in oklab, var(--foreground) 4%, transparent)",
          border: "1px dashed color-mix(in oklab, var(--foreground) 30%, transparent)",
          borderRadius: 4,
          color: "var(--foreground)",
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

  // Portal into the React root (not document.body) so real pointer clicks
  // reach React's root-level event delegation; body-level portals miss it.
  return createPortal(strip, document.getElementById("root") ?? document.body);
}
