/* More Muslim — keynote slide templates (1280×720).
   Browser-babel; composes window.MoreMuslimDesignSystem_019df4; assigns window.MMSlides.
   Based on the real deck "Imagining New Muslim Narratives in Media" (Dr. Sohaira
   Siddiqui, Georgetown University in Qatar) + the partner-overview content. */
(function () {
  const DS = window.MoreMuslimDesignSystem_019df4 || {};
  const { PatternPanel, Symbol, EyebrowLabel, PullQuote } = DS;
  const LOGO = "../../assets/logos/";
  const W = 1280,H = 720;

  const GROUND = {
    black: { bg: "#000000", tile: null, text: "#F6E1C7", sub: "rgba(246,225,199,0.6)", accent: "#F6E1C7", logo: "beige" },
    night: { bg: "#192136", tile: "5C", text: "#F6E1C7", sub: "rgba(246,225,199,0.62)", accent: "#F6E1C7", logo: "beige" },
    oak: { bg: "#511C13", tile: "6B", text: "#F6E1C7", sub: "rgba(246,225,199,0.66)", accent: "#F6E1C7", logo: "beige" },
    beige: { bg: "#FBF1E4", tile: "6A", text: "#511C13", sub: "rgba(81,28,19,0.6)", accent: "#511C13", logo: "oak" }
  };

  function Frame({ g = "night", pattern = true, pad = 96, children, style }) {
    const c = GROUND[g];
    const body =
    <div style={{ position: "absolute", inset: 0, padding: pad, display: "flex", flexDirection: "column", color: c.text, boxSizing: "border-box", ...style, opacity: "0.1" }}>
        {children}
      </div>;

    return (
      <div style={{ width: W, height: H, position: "relative", overflow: "hidden", background: c.bg, fontFamily: "var(--font-serif)" }}>
        {pattern && PatternPanel ?
        <PatternPanel tile={c.tile} color={c.bg} grainOpacity={0.07} radius="0" style={{ position: "absolute", inset: 0 }}>{body}</PatternPanel> :
        body}
      </div>);

  }

  const eyebrow = (c, t) => <div style={{ fontSize: 20, textTransform: "uppercase", letterSpacing: "var(--tracking-caps)", color: c.accent }}>{t}</div>;

  // 1 — TITLE (the real keynote cover)
  function TitleSlide({ g = "black" } = {}) {
    const c = GROUND[g];
    return (
      <Frame g={g} pattern={g !== "black"}>
        <img src={LOGO + `logo-horizontal-${c.logo}.svg`} alt="More Muslim" style={{ height: 30 }} />
        <div style={{ marginTop: "auto" }}>
          <h1 style={{ margin: 0, fontWeight: 400, fontSize: 78, lineHeight: 1.04, textWrap: "balance", maxWidth: "16ch" }}>Imagining New Muslim Narratives in Media</h1>
          <div style={{ marginTop: 40, fontSize: 24, color: c.sub }}>
            <div style={{ color: c.text, letterSpacing: "0.04em" }}>Dr. Sohaira Siddiqui</div>
            <div style={{ fontStyle: "italic", marginTop: 4 }}>Georgetown University in Qatar</div>
          </div>
        </div>
      </Frame>);

  }

  // 2 — SECTION divider
  function SectionSlide({ g = "oak", n = "01", title = "Overview" } = {}) {
    const c = GROUND[g];
    return (
      <Frame g={g}>
        <div style={{ marginTop: "auto" }}>
          <div style={{ fontSize: 28, letterSpacing: "0.2em", color: c.accent }}>{n}</div>
          <h2 style={{ margin: "20px 0 0", fontWeight: 400, fontSize: 92, lineHeight: 1.0, textTransform: "uppercase", letterSpacing: "var(--tracking-caps)" }}>{title}</h2>
        </div>
        <Symbol size={56} style={{ color: c.accent, marginTop: "auto" }} />
      </Frame>);

  }

  // 3 — STATEMENT / overview text
  function StatementSlide({ g = "night", eyebrow: eb = "Qatar's first narrative podcast", lead = "", body = "" } = {}) {
    const c = GROUND[g];
    return (
      <Frame g={g}>
        {eyebrow(c, eb)}
        <h2 style={{ margin: "28px 0 0", fontWeight: 400, fontSize: 52, lineHeight: 1.12, maxWidth: "20ch", textWrap: "balance" }}>{lead}</h2>
        {body && <p style={{ margin: "28px 0 0", fontSize: 26, lineHeight: 1.5, color: c.sub, maxWidth: "46ch", textWrap: "pretty" }}>{body}</p>}
      </Frame>);

  }

  // 4 — STATS
  function StatsSlide({ g = "night", eyebrow: eb = "Audience", stats = [] } = {}) {
    const c = GROUND[g];
    return (
      <Frame g={g}>
        {eyebrow(c, eb)}
        <div style={{ marginTop: "auto", marginBottom: "auto", display: "grid", gridTemplateColumns: `repeat(${stats.length}, 1fr)`, gap: 48 }}>
          {stats.map((s, i) =>
          <div key={i}>
              <div style={{ fontSize: 88, lineHeight: 1, color: c.accent }}>{s.n}</div>
              <div style={{ marginTop: 18, fontSize: 22, lineHeight: 1.4, color: c.sub, textTransform: "uppercase", letterSpacing: "var(--tracking-caps)" }}>{s.l}</div>
            </div>
          )}
        </div>
      </Frame>);

  }

  // 5 — QUOTE
  function QuoteSlide({ g = "oak", text = "", cite = "" } = {}) {
    const c = GROUND[g];
    return (
      <Frame g={g}>
        <div style={{ margin: "auto 0", display: "flex", flexDirection: "column", gap: 36 }}>
          <div style={{ fontStyle: "italic", fontSize: 54, lineHeight: 1.22, maxWidth: "22ch" }}>{`\u201C${text}\u201D`}</div>
          {cite && <div style={{ fontSize: 22, textTransform: "uppercase", letterSpacing: "var(--tracking-caps)", color: c.accent }}>— {cite}</div>}
        </div>
      </Frame>);

  }

  // 6 — EPISODE LIST
  function ListSlide({ g = "beige", eyebrow: eb = "Season One", items = [] } = {}) {
    const c = GROUND[g];
    return (
      <Frame g={g} pad={88}>
        {eyebrow(c, eb)}
        <div style={{ marginTop: 36, display: "flex", flexDirection: "column" }}>
          {items.map((it, i) =>
          <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 28, padding: "16px 0", borderTop: `1px solid ${GROUND[g].line.replace(/[\d.]+\)$/, "0.25)")}` }}>
              <span style={{ fontSize: 20, letterSpacing: "0.14em", color: c.accent, width: 64, flex: "none" }}>{it.n}</span>
              <span style={{ fontSize: 30, flex: 1 }}>{it.title}</span>
              <span style={{ fontSize: 18, color: c.sub, textTransform: "uppercase", letterSpacing: "var(--tracking-caps)" }}>{it.dur}</span>
            </div>
          )}
        </div>
      </Frame>);

  }

  // 7 — CLOSING
  function ClosingSlide({ g = "night" } = {}) {
    const c = GROUND[g];
    return (
      <Frame g={g}>
        <div style={{ margin: "auto", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
          <Symbol size={72} style={{ color: c.accent }} />
          <div style={{ fontSize: 56, textTransform: "uppercase", letterSpacing: "var(--tracking-caps)" }}>Thank you</div>
          <div style={{ fontSize: 22, letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: c.sub }}>moremuslim.org</div>
        </div>
      </Frame>);

  }

  // Ordered sample deck
  const DECK = [
  () => <TitleSlide g="black" />,
  () => <SectionSlide g="oak" n="01" title="Overview" />,
  () => <StatementSlide g="night" eyebrow="Qatar's first narrative podcast"
  lead="A narrative audio documentary series that explores the Muslim experience, with all its messiness."
  body="The first narrative podcast produced in Qatar — a production of the Al-Mujadilah Center and Mosque for Women. Nine documentaries told through the lived experiences of Muslim women." />,
  () => <StatsSlide g="night" eyebrow="Audience · first three months"
  stats={[{ n: "40k+", l: "downloads" }, { n: "143", l: "countries" }, { n: "7×", l: "launch-to-peak growth" }]} />,
  () => <QuoteSlide g="oak" text="It calls her habibti. Gives her Islamic relationship advice." cite="In Therapy, With SheikhaGPT" />,
  () => <ListSlide g="beige" eyebrow="Season One · selected episodes"
  items={[
  { n: "E1", title: "Side Entrances", dur: "44 min" },
  { n: "E3", title: "The Secret Translators", dur: "44 min" },
  { n: "E6", title: "Cape Malay", dur: "42 min" },
  { n: "E7", title: "In Therapy, With SheikhaGPT", dur: "42 min" },
  { n: "E9", title: "A More Muslim Japan", dur: "26 min" }]
  } />,
  () => <ClosingSlide g="night" />];


  window.MMSlides = { TitleSlide, SectionSlide, StatementSlide, StatsSlide, QuoteSlide, ListSlide, ClosingSlide, DECK, W, H };
})();