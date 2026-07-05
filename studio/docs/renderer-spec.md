# More Muslim Social Studio — Renderer Spec

## Renderer Technique Decision Matrix

- sourceRepresentation: dom-text — runtime values and media assets feed React templates.
- productRepresentation: mixed — brand typography over one decoded image or an official pattern tile.
- previewRenderer: dom — native product text keeps ABC Marist crisp for a low-count layout.
- exportRenderer: canvas-2d — a dedicated painter repaints the slide for PNG/JPG bytes.
- rendererWorkload: simple-composition — one image, one tile, a handful of text nodes.
- rendererStrategy: dom.
- whyNotAlternativeStrategies: Canvas 2D preview would rasterise low-count semantic text without need and lose native text fidelity; WebGL/WebGPU is unwarranted because there is no dense pixel, shader, or particle work in preview; SVG-foreignObject snapshot export was rejected because Chromium taints canvases for any foreignObject SVG image (verified empirically), so export must be a real Canvas 2D pass with product-quality text and image output.
- fidelityRisks: the export painter re-implements template layout (wrapping, tracking, block centring) and must stay in sync with templates.tsx; ABC Marist must be loaded via document.fonts before painting.
- performanceRisks: decoded 5000×5263 illustrations are the heaviest preview input; 8K export rasterises an 8192px-long-edge canvas on the main thread.

## Renderer Layer Inventory

- backgroundLayer "slide-ground": bitmap-media + dense-pattern on DOM, uiSelector `[data-mm-post-frame]`, export included. The pattern is official ZAINA artwork PNG, never generated.
- productForegroundLayer "slide-copy": text on DOM, uiSelector `#mm-post-slide [data-toolcraft-product-text]`, export included.
- editingHandlesLayer: none — no canvas editing handles in v1.
- exportComposite: the Canvas 2D painter composites ground and copy in a single export pass; no separate composite layer.

## Render Pipeline Inventory

Passes:

- "slide-dom" (text-layout, preview quality full, runs on main): cacheKey runtime-values + media-assets; invalidated by control-change, control-drag, media-import. React re-renders only the slide subtree on value commits.
- "export-raster" (export, quality export, runs on main): cacheKey decoded-images + loaded-fonts; invalidated by export only — control drags and viewport interaction never trigger the export pass.

Interaction invalidation:

- control-change → invalidates slide-dom, must not invalidate export-raster.
- control-drag (scene.imagePosition, scene.imageZoom) → invalidates slide-dom live during the drag.
- media-import (scene.upload) → invalidates slide-dom.
- export (export.image.format/resolution) → invalidates export-raster only.
- viewport-zoom / viewport pan → invalidates nothing; the runtime canvas transform moves the already-rendered DOM.
