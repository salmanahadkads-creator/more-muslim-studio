/* More Muslim — Social post templates.
   Loaded in the browser via <script type="text/babel" src="screens.jsx">.
   Uses design-system primitives off window.MoreMuslimDesignSystem_019df4 and
   assigns its own components to window.MMSocial. No ES imports (browser-babel). */
(function () {
  const DS = window.MoreMuslimDesignSystem_019df4 || {};
  const { PatternPanel, PullQuote, EyebrowLabel, Symbol } = DS;

  const WAYS = {
    night:   { bg: "#192136", tile: "5C",  text: "#F6E1C6", sub: "rgba(246,225,198,0.62)", accent: "#F6E1C6", logo: "beige", grain: 0.10, tileOpacity: 0.15 },
    oak:     { bg: "#511C14", tile: "6B",  text: "#F6E1C6", sub: "rgba(246,225,198,0.66)", accent: "#F6E1C6", logo: "beige", grain: 0.10, tileOpacity: 0.15 },
    beige:   { bg: "#FBF2E9", tile: "6A",  text: "#511C14", sub: "rgba(81,28,20,0.62)",    accent: "#511C14", logo: "oak",   grain: 0.06, tileOpacity: 0.10 },
    harvest: { bg: "#E2B16D", tile: "3A",  text: "#511C14", sub: "rgba(81,28,20,0.62)",    accent: "#511C14", logo: "oak",   grain: 0.08, tileOpacity: 0.10 },
    mist:    { bg: "#9FBCCC", tile: "2B",  text: "#192136", sub: "rgba(25,33,54,0.7)",     accent: "#192136", logo: "night", grain: 0.07, tileOpacity: 0.10 },
    black:   { bg: "#000000", tile: null,  text: "#FBF2E9", sub: "rgba(251,242,233,0.62)", accent: "#FBF2E9", logo: "beige", grain: 0.14, tileOpacity: 0    },
  };
  const LOGO = (v) => `../../assets/logos/logo-horizontal-${v}.svg`;
  const SYM  = (v) => `../../assets/logos/symbol-${v}.svg`;

  const SIZES = { portrait: { w: 1080, h: 1350 }, story: { w: 1080, h: 1920 } };
  const TEXT_WIDTH = { portrait: 910, story: 780 };

  function PostFrame({ format = "square", way = "night", pattern = true, children, scale = 1, image, cropX = 50, cropY = 50, cropZoom = 1 }) {
    const c = WAYS[way];
    const { w, h } = SIZES[format];
    const inner = (
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: 85, boxSizing: "border-box", color: c.text, lineHeight: 1 }}>
        {children}
      </div>
    );
    return (
      <div style={{ width: w * scale, height: h * scale, flex: "none" }}>
        <div style={{ width: w, height: h, transform: `scale(${scale})`, transformOrigin: "top left", position: "relative", overflow: "hidden", background: c.bg, fontFamily: "var(--font-serif)" }}>
          {image ? (
            <img src={image} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: `${cropX}% ${cropY}%`, transform: `scale(${cropZoom})`, transformOrigin: `${cropX}% ${cropY}%` }} />
          ) : pattern && PatternPanel ? (
            <PatternPanel tile={c.tile} color={c.bg} grain grainOpacity={c.grain} tileOpacity={c.tileOpacity} radius="0" style={{ position: "absolute", inset: 0 }} />
          ) : null}
          {inner}
        </div>
      </div>
    );
  }

  const eyebrow = (c, txt, field) => (
    <div data-field={field} style={{ fontSize: 32, textTransform: "uppercase", letterSpacing: "var(--tracking-caps)", color: c.accent, whiteSpace: "nowrap", textAlign: "center", width: "100%", overflow: "hidden", textOverflow: "ellipsis" }}>{txt}</div>
  );

  const footerMark = (c, way, label = "MOREMUSLIM.ORG", showSymbol = false) => (
    <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
      {showSymbol && <img src={SYM(WAYS[way].logo)} style={{ width: 216, height: 216 }} alt="" />}
      {label && <div data-field="url" style={{ fontSize: 32, textTransform: "uppercase", letterSpacing: "var(--tracking-caps)", color: c.accent, whiteSpace: "nowrap" }}>{label}</div>}
    </div>
  );

  // 1 — COVER
  function CoverPost({ format = "portrait", way = "night", presents = "More Muslim presents", title = "Side Entrances", episode = "S1 E7", image, cropX = 50, cropY = 50, cropZoom = 1, scale = 1 }) {
    const c = WAYS[way];
    const tw = TEXT_WIDTH[format];
    return (
      <PostFrame format={format} way={way} image={image} cropX={cropX} cropY={cropY} cropZoom={cropZoom} scale={scale}>
        <div style={{ textAlign: "center" }}>{eyebrow(c, presents, "presents")}</div>
        <h1 data-field="title" style={{ margin: "36px auto 0", textAlign: "center", fontWeight: 400, textTransform: "uppercase", letterSpacing: "var(--tracking-caps)", fontSize: 77, maxWidth: tw }}>{title}</h1>
        <div style={{ marginTop: "auto", width: "100%", display: "flex", alignItems: "flex-end" }}>
          <img src={SYM(WAYS[way].logo)} style={{ width: 216, height: 216, flex: "none" }} alt="" />
          <div data-field="episode" style={{ flex: 1, textAlign: "center", fontSize: 32, textTransform: "uppercase", letterSpacing: "var(--tracking-caps)", color: c.accent, whiteSpace: "nowrap" }}>{episode}</div>
          <div style={{ width: 216, flex: "none" }} />
        </div>
      </PostFrame>
    );
  }

  // 2 — QUOTE
  function QuotePost({ format = "story", way = "oak", episode = "Episode 7: In Therapy, with SheikhAGPT", exchanges = [], image, cropX = 50, cropY = 50, cropZoom = 1, scale = 1 }) {
    const c = WAYS[way];
    return (
      <PostFrame format={format} way={way} image={image} cropX={cropX} cropY={cropY} cropZoom={cropZoom} scale={scale}>
        <div style={{ marginBottom: 56 }}>{eyebrow(c, episode, "episode")}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 56, justifyContent: "center", alignItems: "center", flex: 1, textAlign: "center" }}>
          {exchanges.map((ex, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center", width: "100%" }}>
              <div data-field={`s${i+1}`} style={{ fontSize: 32, textTransform: "uppercase", letterSpacing: "var(--tracking-caps)", whiteSpace: "nowrap" }}>{ex.speaker}</div>
              <div data-field={`t${i+1}`} style={{ fontSize: 42, maxWidth: TEXT_WIDTH[format], textAlign: "center" }} dangerouslySetInnerHTML={{ __html: ex.text }} />
            </div>
          ))}
        </div>
        {footerMark(c, way)}
      </PostFrame>
    );
  }

  // 3 — SYNOPSIS
  function SynopsisPost({ format = "portrait", way = "black", episode = "In Therapy, with SheikhAGPT", paragraphs = [], image, cropX = 50, cropY = 50, cropZoom = 1, scale = 1 }) {
    const c = WAYS[way];
    // Auto-detect body copy size based on total text length
    const totalLength = paragraphs.join("").replace(/<[^>]*>/g, '').length;
    const bodyCopySize = totalLength > 200 ? "M" : "L";
    const bodySizes = { L: 77, M: 56 };
    const bodySize = bodySizes[bodyCopySize];
    return (
      <PostFrame format={format} way={way} image={image} cropX={cropX} cropY={cropY} cropZoom={cropZoom} scale={scale}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>{eyebrow(c, episode, "episode")}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 40, justifyContent: "center", flex: 1 }}>
          {paragraphs.map((p, i) => (
            <p data-field={`p${i+1}`} key={i} style={{ margin: 0, fontSize: bodySize, maxWidth: TEXT_WIDTH[format], textWrap: "pretty" }} dangerouslySetInnerHTML={{ __html: p }} />
          ))}
        </div>
        <div data-field="url" style={{ marginTop: 56, textAlign: "center", fontSize: 32, textTransform: "uppercase", letterSpacing: "var(--tracking-caps)", whiteSpace: "nowrap" }}>MOREMUSLIM.ORG</div>
      </PostFrame>
    );
  }

  // 4 — NOW STREAMING
  function NowStreamingPost({ format = "story", way = "night", episode = "Episode 7", lines = [], image, cropX = 50, cropY = 50, cropZoom = 1, scale = 1 }) {
    const c = WAYS[way];
    return (
      <PostFrame format={format} way={way} image={image} cropX={cropX} cropY={cropY} cropZoom={cropZoom} scale={scale}>
        <div style={{ display: "flex", flexDirection: "column", gap: 48, justifyContent: "center", flex: 1, textAlign: "center" }}>
          <h2 style={{ margin: "0 auto", fontWeight: 400, textAlign: "center", textTransform: "uppercase", letterSpacing: "var(--tracking-caps)", fontSize: 56, color: c.accent, maxWidth: TEXT_WIDTH[format] }}>
            <span data-field="episode">{episode}</span><br />Now Streaming
          </h2>
          {lines.map((l, i) => (
            <p data-field={`l${i+1}`} key={i} style={{ margin: "0 auto", textAlign: "center", fontSize: 42, maxWidth: TEXT_WIDTH[format] }} dangerouslySetInnerHTML={{ __html: l }} />
          ))}
        </div>
        {footerMark(c, way, "MOREMUSLIM.ORG", true)}
      </PostFrame>
    );
  }

  // 5 — CREDITS
  function CreditsPost({ format = "portrait", way = "night", body = "", episode = "S1 E7", image, cropX = 50, cropY = 50, cropZoom = 1, scale = 1 }) {
    const c = WAYS[way];
    const processedBody = body
      .replace(/<b([^>]*)>/gi, '<span$1 style="text-transform:uppercase;letter-spacing:var(--tracking-caps)">')
      .replace(/<\/b>/gi, '</span>')
      .replace(/<strong([^>]*)>/gi, '<span$1 style="text-transform:uppercase;letter-spacing:var(--tracking-caps)">')
      .replace(/<\/strong>/gi, '</span>');
    return (
      <PostFrame format={format} way={way} image={image} cropX={cropX} cropY={cropY} cropZoom={cropZoom} scale={scale}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>{eyebrow(c, "Episode Credits", null)}</div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div data-field="body" style={{ fontSize: 32, textAlign: "center", lineHeight: 1.7, color: c.text }} dangerouslySetInnerHTML={{ __html: processedBody }} />
        </div>
        <div data-field="episode" style={{ marginTop: 40, textAlign: "center", fontSize: 32, letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", whiteSpace: "nowrap" }}>{episode}</div>
      </PostFrame>
    );
  }

  window.MMSocial = { PostFrame, CoverPost, QuotePost, SynopsisPost, NowStreamingPost, CreditsPost, WAYS, SIZES };
})();
