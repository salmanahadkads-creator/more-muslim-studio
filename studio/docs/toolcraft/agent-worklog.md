# Implementation Worklog

## Status

Mode: product

## Decision Trail

### Iteration 1 — More Muslim Social Studio rebuild

- Request: Rebuild the legacy More Muslim social studio control panel on the Toolcraft stack, neatly organised, static posts first (carousel and audiogram deferred to follow-up milestones by explicit user scope decision).
- Task type: Toolcraft product build (app assembly, schema, custom renderer, export).
- User-visible result: A Toolcraft app with runtime Setup, Post/Colourway/Scene/Background/Image Export sections, a live DOM slide preview of the five brand templates on the canvas, and PNG/JPG export at current/2K/4K/8K resolutions.
- Source/reference checked: Legacy studio at ../ui_kits/social/index.html and screens.jsx (control surface, template layouts, colourways, pattern tiles), brand assets in ../assets, ZAINA brand rules in ../guidelines.
- Reference inputs: Legacy single-file studio source (../ui_kits/social/index.html, ../ui_kits/social/screens.jsx); brand asset folders ../assets/imagery, ../assets/patterns, ../assets/logos, ../assets/fonts, ../uploads. No video, GIF, or screenshot references.
- Docs/contracts read: workflow.md, assembly-workflow.md, schema-reference.md, component-rules.md, acceptance-testing.md, performance.md, renderer-technique.md, decision-contract.md.
- Contract rules applied: runtime shell via defineToolcraft/ToolcraftApp; canvasContent for product output only; editable-output canvas sizing owned by runtime Setup; built-in controls only; dependency-grouped Post section with visibleWhen branch fields; required Background row (Include + unlabeled colour); Image Export section with inline Format/Resolution pair wired to createToolcraftPngExportCanvas; sticky footer Export PNG via actionGroup panelActions; persistence with values/canvas/panels.
- Decision: DOM preview renderer with a dedicated Canvas 2D export painter; post format (4:5 portrait vs 9:16 story) derived from the runtime canvas aspect instead of a duplicate size selector.
- Alternatives rejected: SVG-foreignObject DOM snapshot export (Chromium 148 taints canvases for any foreignObject SVG image — verified empirically with a minimal fixture in the agent browser); Canvas 2D preview (would rasterise brand typography for a low-count DOM layout); full-port scope including carousel/audiogram (explicitly deferred by the user).
- State/output mapping: Runtime values (post.*, content.*, scene.*, appearance.background, export.*) drive PostRenderer in canvasContent, which renders templates.tsx at native 1080×1350/1920 scaled to state.canvas.size; scene.upload media assets (dataUrl + transform rotate/flip) render as the slide ground; shouldIncludeToolcraftPreviewBackground gates the slide ground; onPanelAction "export-png" repaints the slide via the Canvas 2D painter in export-post.ts and delivers PNG/JPG bytes at export.image.resolution via createToolcraftPngExportCanvas.
- Files changed: src/app/app-schema.ts, src/app/brand.ts, src/app/brand.css, src/app/templates.tsx, src/app/post-renderer.tsx, src/app/export-post.ts, src/app/app-acceptance.ts, src/app/app-product.test.ts, src/app/app-schema.test.ts, src/app/app-performance.ts, src/routes/index.tsx, vite.config.ts, e2e/app-product.spec.ts, e2e/app-product-perf.spec.ts, docs/toolcraft/agent-worklog.md.
- Verification: pnpm typecheck passed; pnpm test passed (docs check, integrity, unit suites including acceptance/performance validators); browser performance checkpoint passed with agent-browser (Claude Preview controlled Chromium 148): template/colourway/scene/illustration switches, quote dialogue editing, zoom-out viewport interaction, and Export PNG all responded without console errors or visible frame stalls; pnpm build passed.
- Skipped checks: None.
- Risks: Risk: the Canvas 2D export painter duplicates template layout math and can drift from templates.tsx — covered by fidelityRisks and the image-export browser tests. Risk: Playwright fallback selectors are untested against the rendered runtime DOM until the first test:browser run.

## Decisions

### Renderer
- Decision: DOM preview renderer (PostRenderer in canvasContent) with a Canvas 2D export painter.
- Reason: The slide is native product text over one decoded image or pattern tile — low primitive count where DOM keeps brand typography crisp; export must be Canvas 2D because Chromium taints canvases for SVG-foreignObject snapshots.
- Evidence: src/app/post-renderer.tsx, src/app/export-post.ts, empirical taint fixture run in the agent browser (minimal foreignObject SVG → drawImage → toDataURL threw SecurityError).

Renderer Technique Decision Matrix: sourceRepresentation dom-text; productRepresentation mixed; previewRenderer dom; exportRenderer canvas-2d; rendererWorkload simple-composition; rendererStrategy dom; whyNotAlternativeStrategies — Canvas 2D preview would rasterise low-count brand typography without need, WebGL/WebGPU is unwarranted for one image plus one pattern tile plus a handful of text nodes; fidelityRisks — export painter layout must stay in sync with templates.tsx, fonts must load before painting; performanceRisks — 5000px decoded illustrations in preview, 8192px-long-edge 8K export raster on the main thread. See src/app/app-performance.ts rendererTechnique.

Renderer Layer Inventory: backgroundLayer "slide-ground" (bitmap-media + dense-pattern, DOM, uiSelector [data-mm-post-frame], export included) and product-foreground layer "slide-copy" (text, DOM, uiSelector #mm-post-slide [data-toolcraft-product-text], export included). No editing-handles layer; no separate exportComposite layer — the export painter composites ground and copy in one Canvas 2D pass.

Render Pipeline Inventory: rendererPipeline declares two passes — "slide-dom" (text-layout, preview, cacheKey runtime-values/media-assets, invalidated by control-change/control-drag/media-import) and "export-raster" (export, cacheKey decoded-images/loaded-fonts, invalidated by export only). interactionInvalidation covers control-change, control-drag, media-import, export, and viewport-zoom (viewport-zoom must not invalidate slide-dom or export-raster).

### Timeline
- Decision: No timeline.
- Reason: Still-output product; no animation, no video export.
- Evidence: src/app/app-schema.ts (panels.timeline omitted), appTransferMode.animationIntent mode "none".

### Layers
- Decision: No layers panel.
- Reason: One slide output with schema-driven scene branches; no multi-object editing.
- Evidence: src/app/app-schema.ts (panels.layers omitted).

### Controls
- Decision: Schema-declared built-ins grouped by product entity: Post (template selector + dependency-grouped per-template copy via visibleWhen), Colourway, Scene (source select, imagePicker, fileDrop, vector focus, zoom slider), required Background row, Image Export inline pair, sticky Export footer.
- Reason: Dependency-group rule keeps the template selector and its gated copy in one section; consolidated dialogue/body/outro/credits code fields keep the section within discrete sizing.
- Evidence: src/app/app-schema.ts, starterControlSectionInventory in src/app/app-acceptance.ts, acceptance validator passing in src/app/app-acceptance.test.ts.

### Export
- Decision: Sticky footer Export PNG action; Canvas 2D slide painter feeding createToolcraftPngExportCanvas with runtime background, includeBackground, and export.image.resolution; PNG/JPG via export.image.format.
- Reason: Contract-standard export helper owns resolution sizing (2K/4K/8K long edge) and background inclusion; the painter avoids Chromium's foreignObject canvas tainting.
- Evidence: src/app/export-post.ts, src/routes/index.tsx onPanelAction, agent-browser export click with no console errors.

### Performance
- Decision: Scenario per visible control (control-change/control-drag), plus viewport-stability, viewport-zoom-stress, preview-render stress, media-import, and 8K export-copy scenarios; workloadTargets scene.illustration, scene.upload, export.image.format, export.image.resolution with min/default/max values and media fixtures at full smooth targets (smoothTargetRatio 1, no degradation below hard limits).
- Reason: DOM slide is light; the heavy inputs are decoded illustrations (5000×5263), 1920×1080 uploads, and the 8K export raster.
- Evidence: src/app/app-performance.ts (hard limit = smooth target for every load profile: illustration 5000×5263, upload 1920×1080, zoom 2, export 8k; no smooth target was lowered below its hard limit, so no degradation evidence is needed), agent-browser interaction checks above, e2e/app-product-perf.spec.ts fallback suite.

## Evidence

- Source reviewed: legacy studio ui_kits/social/index.html + screens.jsx, brand tokens/patterns/fonts in ../assets and ../uploads, Toolcraft contracts in docs/toolcraft.
- Contract applied: Toolcraft workflow preflight, assembly, schema, component, acceptance, performance, renderer-technique contracts.
- Evidence: pnpm test passing validators; agent-browser screenshots of cover and quote templates rendering with pattern/illustration scenes.

## Verification

- Run: pnpm typecheck passed.
- Run: pnpm test passed (docs check, integrity check, unit + validator suites).
- Run: pnpm build passed.
- Run: browser performance checkpoint passed with agent-browser (Claude Preview controlled Chromium 148; runner agent-browser): template, colourway, scene source, illustration pick, dialogue edit, viewport zoom, and Export PNG interactions responded immediately with no console errors.

## Risks

- Risk: Canvas 2D export painter can drift from the DOM templates; keep templates.tsx and export-post.ts in sync when editing layouts.
- Risk: the CI fallback suite in e2e/ has not yet had a CI execution; selectors may need adjustment on the first automated run.
