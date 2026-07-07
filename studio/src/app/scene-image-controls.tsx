/* On-canvas crop + zoom for image scenes. When the scene ground is an episode
   illustration or an uploaded image, a transparent surface over the preview
   lets the user drag directly on the image to reposition the cover-crop, and a
   zoom slider sits just beneath the image. Both write the same runtime values
   the Scene section used to own (scene.imagePosition, scene.imageZoom), so the
   renderers and export are unchanged. Rendered through a portal as app chrome —
   never inside canvasContent. */

import * as React from "react";
import { createPortal } from "react-dom";

import { useToolcraft } from "@/toolcraft/runtime/react";

import { readFocusPercent } from "./post-renderer";

const IMAGE_POSITION_TARGET = "scene.imagePosition";
const IMAGE_ZOOM_TARGET = "scene.imageZoom";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

type DragState =
  | { kind: "pan"; rect: DOMRect; startFx: number; startFy: number; startX: number; startY: number }
  | { kind: "zoom"; rect: DOMRect }
  | null;

export function SceneImageControls(): React.JSX.Element | null {
  const { dispatch, state } = useToolcraft();
  const source =
    typeof state.values["scene.source"] === "string"
      ? (state.values["scene.source"] as string)
      : "pattern";
  const hasImage =
    source === "illustration" ||
    (source === "upload" &&
      state.mediaAssets.some((asset) => asset.sourceTarget === "scene.upload"));
  const zoom =
    typeof state.values[IMAGE_ZOOM_TARGET] === "number"
      ? (state.values[IMAGE_ZOOM_TARGET] as number)
      : 1;

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const surfaceRef = React.useRef<HTMLDivElement | null>(null);
  const sliderRef = React.useRef<HTMLDivElement | null>(null);
  const dragRef = React.useRef<DragState>(null);
  const latest = React.useRef({ dispatch, values: state.values });

  latest.current = { dispatch, values: state.values };

  // Anchor the surface over the preview frame and the slider just beneath it,
  // tracking any canvas pan/zoom/resize. A short interval (not rAF, which
  // pauses in background tabs) keeps it synced; the drag itself re-reads the
  // rect on pointerdown, so it stays exact even if the surface lags a frame.
  React.useEffect(() => {
    if (!hasImage) {
      return;
    }

    const position = () => {
      const frame = document.querySelector<HTMLElement>(
        "#mm-post-slide [data-mm-post-frame]",
      );

      if (!frame || !surfaceRef.current || !sliderRef.current) {
        return;
      }

      const r = frame.getBoundingClientRect();
      const surface = surfaceRef.current.style;

      surface.top = `${r.top}px`;
      surface.left = `${r.left}px`;
      surface.width = `${r.width}px`;
      surface.height = `${r.height}px`;

      const slider = sliderRef.current.style;

      // Sit just beneath the image, but clamp into view (and clear of the
      // bottom filmstrip) when a tall frame runs past the viewport.
      slider.top = `${Math.min(r.bottom + 12, window.innerHeight - 200)}px`;
      slider.left = `${r.left + r.width / 2}px`;
    };

    position();

    const interval = window.setInterval(position, 80);

    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", position, true);
    };
  }, [hasImage]);

  React.useEffect(() => {
    const container = containerRef.current;

    if (!container || !hasImage) {
      return;
    }

    const applyZoom = (clientX: number, rect: DOMRect) => {
      const fraction = clamp((clientX - rect.left) / rect.width, 0, 1);

      latest.current.dispatch({
        target: IMAGE_ZOOM_TARGET,
        type: "controls.setValue",
        value: 1 + fraction,
      });
    };

    const onMove = (event: PointerEvent) => {
      const drag = dragRef.current;

      if (!drag) {
        return;
      }

      if (drag.kind === "zoom") {
        applyZoom(event.clientX, drag.rect);
        return;
      }

      // Dragging the image right reveals more of its left edge, so the crop
      // focus moves the opposite way.
      const dFx = -((event.clientX - drag.startX) / drag.rect.width) * 100;
      const dFy = -((event.clientY - drag.startY) / drag.rect.height) * 100;
      const fx = clamp(drag.startFx + dFx, 0, 100);
      const fy = clamp(drag.startFy + dFy, 0, 100);

      latest.current.dispatch({
        target: IMAGE_POSITION_TARGET,
        type: "controls.setValue",
        value: { x: fx / 50 - 1, y: fy / 50 - 1 },
      });
    };

    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);

      if (surfaceRef.current) {
        surfaceRef.current.style.cursor = "grab";
      }
    };

    // One capture-phase listener isolates the overlay from the runtime's canvas
    // pan (which grabs pointerdown) and starts our own drag in the same pass.
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      const onSlider = target?.closest("[data-scene-zoom]");
      const onSurface = target?.closest("[data-scene-drag]");

      if (!onSlider && !onSurface) {
        return;
      }

      event.stopPropagation();
      event.preventDefault();

      const frame = document.querySelector<HTMLElement>(
        "#mm-post-slide [data-mm-post-frame]",
      );
      const rect = frame?.getBoundingClientRect();

      if (!rect) {
        return;
      }

      if (onSlider) {
        dragRef.current = { kind: "zoom", rect };
        applyZoom(event.clientX, rect);
      } else {
        const focus = readFocusPercent(latest.current.values[IMAGE_POSITION_TARGET]);

        dragRef.current = {
          kind: "pan",
          rect,
          startFx: focus.x,
          startFy: focus.y,
          startX: event.clientX,
          startY: event.clientY,
        };

        if (surfaceRef.current) {
          surfaceRef.current.style.cursor = "grabbing";
        }
      }

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    };

    container.addEventListener("pointerdown", onPointerDown, { capture: true });

    return () => {
      container.removeEventListener("pointerdown", onPointerDown, { capture: true });
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [hasImage]);

  if (!hasImage) {
    return null;
  }

  const zoomFraction = clamp(zoom - 1, 0, 1);

  const overlay = (
    <div data-testid="scene-image-controls" ref={containerRef}>
      <div
        aria-label="Drag to reposition the image"
        data-scene-drag=""
        ref={surfaceRef}
        role="slider"
        style={{
          cursor: "grab",
          position: "fixed",
          touchAction: "none",
          // Below the floating panels (z 30) so panel controls stay clickable,
          // above the canvas product output so the image can be dragged.
          zIndex: 20,
        }}
        title="Drag the image to reposition the crop"
      />
      <div
        ref={sliderRef}
        style={{
          alignItems: "center",
          backdropFilter: "blur(24px) saturate(1.5)",
          background: "color-mix(in oklab, var(--popover) 82%, transparent)",
          border: "1px solid color-mix(in oklab, var(--border) 60%, transparent)",
          borderRadius: 999,
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          display: "flex",
          gap: 10,
          padding: "8px 14px",
          position: "fixed",
          transform: "translateX(-50%)",
          WebkitBackdropFilter: "blur(24px) saturate(1.5)",
          zIndex: 21,
        }}
      >
        <span
          style={{
            color: "var(--muted-foreground)",
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          Zoom
        </span>
        <div
          aria-label="Zoom"
          aria-valuemax={2}
          aria-valuemin={1}
          aria-valuenow={Number(zoom.toFixed(2))}
          data-scene-zoom=""
          role="slider"
          style={{
            background: "color-mix(in oklab, var(--foreground) 18%, transparent)",
            borderRadius: 999,
            cursor: "pointer",
            height: 4,
            position: "relative",
            touchAction: "none",
            width: 160,
          }}
          tabIndex={0}
        >
          <div
            style={{
              background: "var(--foreground)",
              borderRadius: "50%",
              height: 14,
              left: `${zoomFraction * 100}%`,
              pointerEvents: "none",
              position: "absolute",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: 14,
            }}
          />
        </div>
      </div>
    </div>
  );

  return createPortal(overlay, document.getElementById("root") ?? document.body);
}
