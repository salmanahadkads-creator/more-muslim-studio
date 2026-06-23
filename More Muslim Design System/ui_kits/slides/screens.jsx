/* More Muslim — keynote slide templates (1280×720).
   Browser-babel; composes window.MoreMuslimDesignSystem_019df4; assigns window.MMSlides.
   Type scale sourced from moremuslim.org main CSS:
     — All-caps labels: font-size 0.75rem, letter-spacing 1.5px, line-height 1.2
     — Titles: letter-spacing 2.7–3.14px, line-height 1.059–1.0, text-transform uppercase
     — Body: line-height 1.125–1.176, letter-spacing 0.2–0.21px
   Scaled proportionally for 1280×720 format. */
(function () {
  const DS = window.MoreMuslimDesignSystem_019df4 || {};
  const { PatternPanel, Symbol } = DS;
  const LOGO = "../../assets/logos/";
  const IMG  = "../../assets/imagery/";
  const W = 1280, H = 720;

  const GROUND = {
    black: { bg: "#000000", tile: null,  text: "#F6E1C6", accent: "#F6E1C6", logo: "beige" },
    night: { bg: "#192136", tile: "5C",  text: "#F6E1C6", accent: "#F6E1C6", logo: "beige" },
    oak:   { bg: "#511C14", tile: "6B",  text: "#F6E1C6", accent: "#F6E1C6", logo: "beige" },
    beige: { bg: "#FBF2E9", tile: "6A",  text: "#511C14", accent: "#511C14", logo: "oak"   },
  };

  /* Shared text styles — scaled for 1280×720 from moremuslim.org CSS */
  const T = {
    label:  { fontSize: 20,  letterSpacing: "0.165em", textTransform: "uppercase", lineHeight: 1.2  },
    title:  { fontSize: 56,  letterSpacing: "0.165em", textTransform: "uppercase", lineHeight: 1.0,  fontWeight: 400, margin: 0 },
    lead:   { fontSize: 52,  lineHeight: 1.125, letterSpacing: "0.02em", fontWeight: 400, margin: 0 },
    body:   { fontSize: 26,  lineHeight: 1.176, letterSpacing: "0.2px"  },
    stat:   { fontSize: 88,  lineHeight: 1,     letterSpacing: "-0.01em" },
    statLbl:{ fontSize: 22,  letterSpacing: "0.165em", textTransform: "uppercase", lineHeight: 1.2  },
    quote:  { fontSize: 52,  lineHeight: 1.14,  letterSpacing: "0.01em", fontStyle: "italic" },
    cite:   { fontSize: 22,  letterSpacing: "0.165em", textTransform: "uppercase", lineHeight: 1.2  },
    list:   { fontSize: 30,  lineHeight: 1.125, letterSpacing: "0.01em" },
    listN:  { fontSize: 20,  letterSpacing: "0.14em", lineHeight: 1.2  },
    listDur:{ fontSize: 18,  letterSpacing: "0.165em", textTransform: "uppercase", lineHeight: 1.2  },
  };

  function Frame({ g = "night", pattern = true, pad = 96, patternOpacity = 0.2, children, style }) {
    const c = GROUND[g];
    const body = (
      <div style={{ position: "absolute", inset: 0, padding: pad, display: "flex", flexDirection: "column", color: c.text, boxSizing: "border-box", fontFamily: "var(--font-serif)", ...style }}>
        {children}
      </div>
    );
    return (
      <div style={{ width: W, height: H, position: "relative", overflow: "hidden", background: c.bg }}>
        {pattern && PatternPanel
          ? <PatternPanel tile={c.tile} color={c.bg} grainOpacity={0.07} tileOpacity={patternOpacity} radius="0" style={{ position: "absolute", inset: 0 }}>{body}</PatternPanel>
          : body}
      </div>
    );
  }

  // 1 — TITLE
  function TitleSlide({ g = "black", patternOpacity = 0.2 } = {}) {
    const c = GROUND[g];
    return (
      <Frame g={g} pattern={g !== "black"} patternOpacity={patternOpacity}>
        <div style={{ marginLeft: "auto" }}>
          <img src={LOGO + `logo-horizontal-${c.logo}.svg`} alt="More Muslim" style={{ height: 56 }} />
        </div>
        <div style={{ marginTop: "auto" }}>
          <h1 style={{ ...T.lead, fontSize: 78, lineHeight: 1.04, textWrap: "balance", maxWidth: "22ch" }}>
            Imagining New Muslim Narratives in Media
          </h1>
          <div style={{ marginTop: 40, ...T.body, fontSize: 24 }}>
            <div style={{ letterSpacing: "0.04em" }}>Dr. Sohaira Siddiqui</div>
            <div style={{ fontStyle: "italic", marginTop: 4 }}>Georgetown University in Qatar</div>
          </div>
        </div>
      </Frame>
    );
  }

  // 2 — SECTION
  function SectionSlide({ g = "oak", n = "01", title = "Overview", patternOpacity = 0.2 } = {}) {
    const c = GROUND[g];
    return (
      <Frame g={g} patternOpacity={patternOpacity}>
        <div style={{ flex: 1 }} />
        <div style={{ marginBottom: 44 }}>
          <div style={{ ...T.label, fontSize: 28, letterSpacing: "0.2em" }}>{n}</div>
          <h2 style={{ ...T.title, fontSize: 92, marginTop: 20 }}>{title}</h2>
        </div>
        <Symbol size={56} style={{ color: c.accent }} />
      </Frame>
    );
  }

  // 3 — STATEMENT
  function StatementSlide({ g = "night", eyebrow: eb = "More Muslim", lead = "", body = "", patternOpacity = 0.2 } = {}) {
    const c = GROUND[g];
    return (
      <Frame g={g} patternOpacity={patternOpacity}>
        <div style={{ ...T.label, color: c.accent }}>{eb}</div>
        <h2 style={{ ...T.lead, lineHeight: 1.04, marginTop: 28, maxWidth: "22ch", textWrap: "balance" }}>{lead}</h2>
        {body && <p style={{ ...T.body, lineHeight: 1.125, margin: "28px 0 0", maxWidth: "52ch", textWrap: "pretty" }}>{body}</p>}
      </Frame>
    );
  }

  // 4 — STATS
  function StatsSlide({ g = "night", eyebrow: eb = "Audience", stats = [], patternOpacity = 0.2 } = {}) {
    const c = GROUND[g];
    return (
      <Frame g={g} patternOpacity={patternOpacity}>
        <div style={{ ...T.label, color: c.accent }}>{eb}</div>
        <div style={{ marginTop: "auto", marginBottom: "auto", display: "grid", gridTemplateColumns: `repeat(${stats.length}, 1fr)`, gap: 48 }}>
          {stats.map((s, i) => (
            <div key={i}>
              <div style={{ ...T.stat, color: c.accent }}>{s.n}</div>
              <div style={{ ...T.statLbl, marginTop: 18 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </Frame>
    );
  }

  // 5 — QUOTE
  function QuoteSlide({ g = "oak", text = "", cite = "", patternOpacity = 0.2 } = {}) {
    const c = GROUND[g];
    return (
      <Frame g={g} patternOpacity={patternOpacity}>
        <div style={{ margin: "auto 0", display: "flex", flexDirection: "column", gap: 36 }}>
          <div style={{ ...T.quote, maxWidth: "22ch" }}>{`\u201C${text}\u201D`}</div>
          {cite && <div style={{ ...T.cite, color: c.accent }}>{cite}</div>}
        </div>
      </Frame>
    );
  }

  // 6 — EPISODE LIST
  function ListSlide({ g = "beige", eyebrow: eb = "Season One", items = [], patternOpacity = 0.2 } = {}) {
    const c = GROUND[g];
    const borderColor = g === "beige" ? "rgba(81,28,19,0.18)" : "rgba(246,225,199,0.18)";
    return (
      <Frame g={g} pad={88} patternOpacity={patternOpacity}>
        <div style={{ ...T.label, color: c.accent }}>{eb}</div>
        <div style={{ marginTop: 36, display: "flex", flexDirection: "column" }}>
          {items.map((it, i) => (
            <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 28, padding: "16px 0", borderTop: `1px solid ${borderColor}` }}>
              <span style={{ ...T.listN, color: c.accent, width: 64, flex: "none" }}>{it.n}</span>
              <span style={{ ...T.list, flex: 1 }}>{it.title}</span>
              <span style={{ ...T.listDur }}>{it.dur}</span>
            </div>
          ))}
        </div>
      </Frame>
    );
  }

  // 7 — CLOSING
  function ClosingSlide({ g = "night", patternOpacity = 0.2 } = {}) {
    const c = GROUND[g];
    return (
      <Frame g={g} patternOpacity={patternOpacity}>
        <div style={{ margin: "auto", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          <div style={{ ...T.title, fontSize: 56 }}>Thank you</div>
          <div style={{ ...T.label }}>moremuslim.org</div>
        </div>
        <Symbol size={56} style={{ color: c.accent }} />
      </Frame>
    );
  }

  const DECK = [
    () => <TitleSlide g="black" />,
    () => <SectionSlide g="oak" n="01" title="Overview" />,
    () => <StatementSlide g="night" eyebrow="More Muslim"
            lead="A narrative audio documentary series that explores the Muslim experience, with all its messiness."
            body="A sound-rich, cinematic narrative podcast telling deeply reported stories about Muslims across the world. Each episode is a mix of interviews, field reporting, history, and research, all scored to original music." />,
    () => <StatsSlide g="night" eyebrow="Audience · first three months"
            stats={[{ n: "40k+", l: "downloads" }, { n: "143", l: "countries" }, { n: "7\u00d7", l: "launch-to-peak growth" }]} />,
    () => <QuoteSlide g="oak" text="It calls her habibti. Gives her Islamic relationship advice." cite="In Therapy, With SheikhaGPT" />,
    () => <ListSlide g="beige" eyebrow="Season One \u00b7 selected episodes"
            items={[
              { n: "E1", title: "Side Entrances", dur: "44 min" },
              { n: "E3", title: "The Secret Translators", dur: "44 min" },
              { n: "E6", title: "Cape Malay", dur: "42 min" },
              { n: "E7", title: "In Therapy, With SheikhaGPT", dur: "42 min" },
              { n: "E9", title: "A More Muslim Japan", dur: "26 min" },
            ]} />,
    () => <ClosingSlide g="night" />,
  ];

  window.MMSlides = { TitleSlide, SectionSlide, StatementSlide, StatsSlide, QuoteSlide, ListSlide, ClosingSlide, DECK, W, H, IMG };
})();
