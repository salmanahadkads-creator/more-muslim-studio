/* @ds-bundle: {"format":3,"namespace":"MoreMuslimDesignSystem_019df4","components":[{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"EyebrowLabel","sourcePath":"components/core/EyebrowLabel.jsx"},{"name":"Symbol","sourcePath":"components/core/Symbol.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"AudioBar","sourcePath":"components/media/AudioBar.jsx"},{"name":"EpisodeCard","sourcePath":"components/media/EpisodeCard.jsx"},{"name":"PATTERN_TILES","sourcePath":"components/media/PatternPanel.jsx"},{"name":"PatternPanel","sourcePath":"components/media/PatternPanel.jsx"},{"name":"PlayButton","sourcePath":"components/media/PlayButton.jsx"},{"name":"PullQuote","sourcePath":"components/media/PullQuote.jsx"}],"sourceHashes":{"components/core/Avatar.jsx":"ee8b980abceb","components/core/Button.jsx":"7e946e880204","components/core/EyebrowLabel.jsx":"09d049690295","components/core/Symbol.jsx":"bd898cf929f1","components/core/Tag.jsx":"d761deee1c9a","components/media/AudioBar.jsx":"0a6ff700528f","components/media/EpisodeCard.jsx":"67faa476b4b2","components/media/PatternPanel.jsx":"b56332cd1fd6","components/media/PlayButton.jsx":"87b048a3f4a7","components/media/PullQuote.jsx":"567696a515dc","deck-stage.js":"208980974db4","screens.jsx":"589beb7f04a0","tweaks-panel.jsx":"6591467622ed","ui_kits/slides/screens.jsx":"9f4f72256194","ui_kits/slides/tweaks-panel.jsx":"6591467622ed","ui_kits/social/screens.jsx":"b429f8c1c334","ui_kits/website/screens.jsx":"b4bbb111aaa6","uploads/main.js":"acdfe6b9784e"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.MoreMuslimDesignSystem_019df4 = window.MoreMuslimDesignSystem_019df4 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Circular avatar for hosts / guests. Falls back to initials on a warm tint. */
function Avatar({
  src,
  name = "",
  size = 48,
  ring = false,
  style,
  ...rest
}) {
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase();
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      flex: "none",
      borderRadius: "var(--radius-pill)",
      overflow: "hidden",
      background: "var(--more-oak-brown)",
      color: "var(--more-ivory-beige)",
      fontFamily: "var(--font-serif)",
      fontSize: Math.max(11, size * 0.36),
      letterSpacing: "0.04em",
      boxShadow: ring ? "0 0 0 2px var(--surface-base), 0 0 0 3px var(--border-strong)" : undefined,
      ...style
    }
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }) : initials || "MM");
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Primary action control. One typeface, no bold — emphasis comes from fill,
 * uppercase tracking and size. Calm hover (colour deepen) and press (slight
 * darken), no scale bounce.
 */
function Button({
  children,
  variant = "primary",
  size = "md",
  as = "button",
  fullWidth = false,
  style,
  ...rest
}) {
  const sizes = {
    sm: {
      padding: "8px 16px",
      fontSize: "var(--text-xs)",
      letterSpacing: "var(--tracking-caps)"
    },
    md: {
      padding: "12px 24px",
      fontSize: "var(--text-sm)",
      letterSpacing: "var(--tracking-caps)"
    },
    lg: {
      padding: "16px 34px",
      fontSize: "var(--text-base)",
      letterSpacing: "var(--tracking-caps)"
    }
  };
  const variants = {
    primary: {
      background: "var(--more-harvest-yellow)",
      color: "var(--more-oak-brown)",
      border: "1px solid transparent"
    },
    solid: {
      background: "var(--more-ivory-beige)",
      color: "var(--more-oak-brown)",
      border: "1px solid transparent"
    },
    outline: {
      background: "transparent",
      color: "var(--text-primary)",
      border: "1px solid var(--border-strong)"
    },
    ghost: {
      background: "transparent",
      color: "var(--text-primary)",
      border: "1px solid transparent"
    }
  };
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: `mm-btn mm-btn--${variant}`,
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.6em",
      width: fullWidth ? "100%" : undefined,
      fontFamily: "var(--font-serif)",
      textTransform: "uppercase",
      textDecoration: "none",
      lineHeight: 1,
      borderRadius: "0",
      cursor: "pointer",
      transition: "background var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard), opacity var(--duration-fast) var(--ease-standard)",
      ...sizes[size],
      ...variants[variant],
      ...style
    }
  }, rest), children, /*#__PURE__*/React.createElement("style", null, `
        .mm-btn:hover { opacity: 0.92; }
        .mm-btn--primary:hover { background: var(--more-oak-brown); color: var(--more-ivory-beige); opacity: 1; }
        .mm-btn--outline:hover, .mm-btn--ghost:hover { background: var(--border-subtle); opacity: 1; }
        .mm-btn:active { transform: translateY(1px); }
        .mm-btn:focus-visible { outline: 2px solid var(--focus-ring); outline-offset: 2px; }
        .mm-btn:disabled { opacity: 0.45; cursor: not-allowed; }
      `));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/EyebrowLabel.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * The signature uppercase, wide-tracked label used for episode eyebrows,
 * section kickers and sign-offs (e.g. "EPISODE 7: IN THERAPY").
 */
function EyebrowLabel({
  children,
  tone = "accent",
  as = "div",
  style,
  ...rest
}) {
  const tones = {
    accent: "var(--accent)",
    primary: "var(--text-primary)"
  };
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    style: {
      fontFamily: "var(--font-serif)",
      fontSize: "var(--text-xs)",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-caps)",
      lineHeight: 1.3,
      color: tones[tone] || tones.accent,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { EyebrowLabel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/EyebrowLabel.jsx", error: String((e && e.message) || e) }); }

// components/core/Symbol.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * The More Muslim brand symbol — an 8-point star built from four interlocking
 * chevron polygons. Renders as inline SVG using `currentColor`, so colour it
 * with the `color` CSS property (or the `color` prop). Decorative by default.
 */
function Symbol({
  size = 32,
  color,
  title,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 1800 1800",
    width: size,
    height: size,
    role: title ? "img" : "presentation",
    "aria-hidden": title ? undefined : true,
    "aria-label": title,
    style: {
      display: "inline-block",
      color,
      flex: "none",
      ...style
    }
  }, rest), title ? /*#__PURE__*/React.createElement("title", null, title) : null, /*#__PURE__*/React.createElement("g", {
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("polygon", {
    points: "789.134 1168.935 631.6 1168.935 631.6 1011.401 520.199 900 304.947 1115.252 392.494 1202.799 507.001 1088.279 507.007 1293.527 712.243 1293.533 597.736 1408.041 685.282 1495.587 900.534 1280.335 789.134 1168.935"
  }), /*#__PURE__*/React.createElement("polygon", {
    points: "1011.935 631.065 1169.469 631.065 1169.469 788.6 1280.87 900 1496.122 684.748 1408.575 597.201 1294.068 711.721 1294.062 506.473 1088.826 506.467 1203.333 391.959 1115.787 304.413 900.534 519.665 1011.935 631.065"
  }), /*#__PURE__*/React.createElement("polygon", {
    points: "631.6 788.6 631.6 631.065 789.134 631.065 900.534 519.665 685.282 304.413 597.736 391.959 712.255 506.467 507.007 506.473 507.001 711.708 392.494 597.201 304.947 684.748 520.199 900 631.6 788.6"
  }), /*#__PURE__*/React.createElement("polygon", {
    points: "1169.469 1011.401 1169.469 1168.935 1011.935 1168.935 900.534 1280.335 1115.787 1495.587 1203.333 1408.041 1088.814 1293.533 1294.062 1293.527 1294.068 1088.292 1408.575 1202.799 1496.122 1115.252 1280.87 900 1169.469 1011.401"
  })));
}
Object.assign(__ds_scope, { Symbol });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Symbol.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Small uppercase metadata tag — episode number, category, "New".
 * Hairline by default; `filled` for emphasis.
 */
function Tag({
  children,
  variant = "outline",
  style,
  ...rest
}) {
  const variants = {
    outline: {
      background: "transparent",
      color: "var(--text-primary)",
      border: "1px solid var(--border-strong)"
    },
    filled: {
      background: "var(--more-harvest-yellow)",
      color: "var(--more-oak-brown)",
      border: "1px solid transparent"
    },
    ivory: {
      background: "var(--more-ivory-beige)",
      color: "var(--more-oak-brown)",
      border: "1px solid transparent"
    },
    mist: {
      background: "var(--more-mist-blue)",
      color: "var(--more-night-blue)",
      border: "1px solid transparent"
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.4em",
      fontFamily: "var(--font-serif)",
      fontSize: "var(--text-2xs)",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-caps)",
      lineHeight: 1,
      padding: "5px 10px",
      borderRadius: "var(--radius-xs)",
      ...variants[variant],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/media/EpisodeCard.jsx
try { (() => {
var INACTIVE = "color-mix(in srgb, var(--more-oak-brown) 40%, transparent)";

/**
 * Editorial episode card.
 * desktop (default): white content panel left, full-bleed image right.
 * mobile: image stacked on top, content panel below.
 */
function EpisodeCard(props) {
  var date = props.date;
  var number = props.number;
  var season = props.season !== undefined ? props.season : "S1";
  var duration = props.duration;
  var title = props.title;
  var description = props.description;
  var image = props.image;
  var onPlay = props.onPlay;
  var onTranscript = props.onTranscript;
  var mobile = props.mobile !== undefined ? props.mobile : false;
  var style = props.style;
  var metaStyle = {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.75rem",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    lineHeight: 1.2
  };
  var titleStyle = {
    margin: 0,
    fontFamily: "var(--font-serif)",
    fontSize: "1.0625rem",
    letterSpacing: "2.7px",
    textTransform: "uppercase",
    lineHeight: 1.059,
    color: "var(--more-oak-brown)",
    fontWeight: 400,
    textAlign: "center"
  };
  var playBtnStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.7em",
    padding: "6.5px 14px 5.5px",
    fontFamily: "var(--font-serif)",
    fontSize: "0.75rem",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    lineHeight: 1.6,
    color: "var(--more-oak-brown)",
    background: "transparent",
    border: "1px solid rgba(81,28,20,0.05)",
    borderRadius: "5px",
    cursor: "pointer",
    alignSelf: "center"
  };
  var bodyStyle = {
    margin: 0,
    fontSize: "1rem",
    lineHeight: 1.125,
    letterSpacing: "0.2px",
    color: "var(--more-oak-brown)"
  };
  var ctaStyle = {
    fontSize: "0.75rem",
    letterSpacing: "1.5px",
    fontVariantCaps: "all-small-caps",
    lineHeight: 1.083,
    color: "var(--more-oak-brown)",
    cursor: "pointer",
    textDecoration: "none",
    marginTop: "auto",
    opacity: 0.3,
    display: "flex",
    alignItems: "center",
    gap: "10px",
    justifyContent: "center"
  };
  var contentStyle = {
    background: "var(--more-white)",
    padding: "var(--space-7)",
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-5)",
    flex: 1
  };
  var meta = React.createElement("div", {
    style: metaStyle
  }, React.createElement("span", null, date), React.createElement("span", null, season + " E" + number), React.createElement("span", null, duration));
  var playBtn = React.createElement("button", {
    onClick: onPlay,
    style: playBtnStyle
  }, "\u25B6 Play Episode");
  var body = description ? React.createElement("p", {
    style: bodyStyle
  }, description) : null;
  var cta = React.createElement("a", {
    onClick: onTranscript,
    style: ctaStyle
  }, "Transcript & Credits \u2192");
  var content = React.createElement("div", {
    style: contentStyle
  }, meta, React.createElement("h2", {
    style: titleStyle
  }, title), playBtn, body, cta);
  var imgPanel = image ? React.createElement("div", {
    style: {
      flex: "0 0 58%",
      overflow: "hidden",
      background: "var(--more-night-blue)"
    }
  }, React.createElement("img", {
    src: image,
    alt: "",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block"
    }
  })) : null;
  if (mobile) {
    var mobileImgPanel = image ? React.createElement("div", {
      style: {
        width: "100%",
        aspectRatio: "4/3",
        overflow: "hidden",
        background: "var(--more-night-blue)"
      }
    }, React.createElement("img", {
      src: image,
      alt: "",
      style: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block"
      }
    })) : null;
    return React.createElement("article", {
      style: Object.assign({
        background: "var(--more-white)",
        borderRadius: "var(--radius-card)",
        overflow: "hidden"
      }, style)
    }, mobileImgPanel, content);
  }
  return React.createElement("article", {
    style: Object.assign({
      display: "flex",
      background: "var(--more-ivory-beige)",
      borderRadius: "var(--radius-card)",
      overflow: "hidden"
    }, style)
  }, React.createElement("div", {
    style: {
      flex: "0 0 42%",
      display: "flex"
    }
  }, content), imgPanel);
}
Object.assign(__ds_scope, { EpisodeCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/media/EpisodeCard.jsx", error: String((e && e.message) || e) }); }

// components/media/PatternPanel.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * OFFICIAL PATTERN TILES — the only patterns the brand permits.
 *
 * These are the real ZAINA artwork files shipped in `assets/patterns/`
 * (`Al-Mujadilah_More-Muslim_Patterns_*`). Each tile bakes in its own
 * ground colour + tone-on-tone 8-point-star lattice. NEVER hand-draw,
 * generate, or recolour a star pattern — pick a tile from this catalogue.
 *
 * id      → file `assets/patterns/pattern-<id>.png` (lower-cased)
 * ground  → the baked background colour family
 * ink     → the star/line colour family
 * weight  → "solid" (filled stars) · "line" (bold outline) · "fine" (subtle
 *            hairline, best for discreet backgrounds) · "duo" (two-colour)
 */
const PATTERN_TILES = [{
  id: "1A",
  ground: "beige",
  ink: "harvest",
  weight: "solid"
}, {
  id: "1B",
  ground: "stone",
  ink: "coastal",
  weight: "solid"
}, {
  id: "1C",
  ground: "coastal",
  ink: "night",
  weight: "solid"
}, {
  id: "2A",
  ground: "harvest",
  ink: "beige",
  weight: "solid"
}, {
  id: "2B",
  ground: "mist",
  ink: "coastal",
  weight: "solid"
}, {
  id: "2C",
  ground: "night",
  ink: "stone",
  weight: "solid"
}, {
  id: "3A",
  ground: "harvest",
  ink: "terracotta",
  weight: "line"
}, {
  id: "3B",
  ground: "oak",
  ink: "terracotta",
  weight: "line"
}, {
  id: "3C",
  ground: "coastal",
  ink: "mist",
  weight: "line"
}, {
  id: "4A",
  ground: "terracotta",
  ink: "oak",
  weight: "line"
}, {
  id: "4B",
  ground: "beige",
  ink: "terracotta",
  weight: "line"
}, {
  id: "4C",
  ground: "night",
  ink: "coastal",
  weight: "line"
}, {
  id: "5A",
  ground: "beige",
  ink: "terracotta",
  weight: "fine"
}, {
  id: "5B",
  ground: "terracotta",
  ink: "harvest",
  weight: "fine"
}, {
  id: "5C",
  ground: "night",
  ink: "coastal",
  weight: "fine"
}, {
  id: "6A",
  ground: "beige",
  ink: "oak",
  weight: "fine"
}, {
  id: "6B",
  ground: "oak",
  ink: "terracotta",
  weight: "fine"
}, {
  id: "6C",
  ground: "coastal",
  ink: "stone",
  weight: "fine"
}, {
  id: "7A",
  ground: "harvest",
  ink: "terracotta",
  weight: "duo"
}, {
  id: "7B",
  ground: "coastal",
  ink: "stone",
  weight: "duo"
}];

/** Default tile per ground family — used when a colourway is given but no tile. */
const GROUND_TILE = {
  beige: "6A",
  ivory: "6A",
  harvest: "3A",
  yellow: "3A",
  terracotta: "5B",
  terra: "5B",
  oak: "6B",
  mist: "2B",
  coastal: "6C",
  stone: "1B",
  night: "5C"
};

/** Map of literal ground colours (hex + brand CSS vars) → default tile. */
const COLOR_TILE = {
  "#511c13": "6B",
  "var(--more-oak-brown)": "6B",
  "#192136": "5C",
  "var(--more-night-blue)": "5C",
  "#fbf1e4": "6A",
  "#f6e1c7": "6A",
  "var(--more-ivory-beige)": "6A",
  "#c15a3a": "5B",
  "var(--more-terracotta)": "5B",
  "#e2b16d": "3A",
  "var(--more-harvest-yellow)": "3A",
  "#9fbccc": "2B",
  "var(--more-mist-blue)": "2B",
  "#6185a3": "6C",
  "var(--more-coastal-blue)": "6C",
  "#3c5065": "1B",
  "var(--more-stone-blue)": "1B"
};
const VALID = new Set(PATTERN_TILES.map(t => t.id));

/** Resolve the asset base from the loaded `_ds_bundle.js` script URL. */
function dsAssetBase() {
  try {
    const scripts = document.querySelectorAll("script[src]");
    for (const s of scripts) {
      if (/_ds_bundle\.js(\?|#|$)/.test(s.src || "")) {
        return s.src.replace(/_ds_bundle\.js.*$/, "");
      }
    }
  } catch (e) {/* SSR / no DOM */}
  return "";
}
function resolveTile({
  tile,
  way,
  color
}) {
  if (tile) {
    const up = String(tile).toUpperCase();
    if (VALID.has(up)) return up;
  }
  if (way && GROUND_TILE[String(way).toLowerCase()]) return GROUND_TILE[String(way).toLowerCase()];
  if (color) {
    const key = String(color).trim().toLowerCase();
    if (COLOR_TILE[key]) return COLOR_TILE[key];
  }
  return "5C"; // discreet night default
}

/**
 * Brand background panel. Renders one of the OFFICIAL star-lattice tiles
 * (real artwork PNGs) full-bleed, with an optional film-grain noise overlay.
 *
 * Pick a tile explicitly with `tile="6B"`, or pass a `way`/`color` and the
 * matching ground tile is chosen for you. The panel NEVER draws its own
 * pattern — it only places official artwork.
 *
 *   <PatternPanel tile="6B" style={{ minHeight: 420, padding: 48 }}>…</PatternPanel>
 *   <PatternPanel way="night">…</PatternPanel>
 */
function PatternPanel({
  children,
  tile,
  way,
  color,
  // fallback ground shown behind the artwork while it loads
  src,
  // escape hatch: explicit image URL (still must be official)
  basePath,
  // override the resolved assets root
  size = "cover",
  // background-size: "cover" | "contain" | a CSS length (tiled)
  position = "center",
  grain = true,
  grainOpacity = 0.10,
  tileOpacity = 1,
  radius = "var(--radius-card)",
  style,
  ...rest
}) {
  const id = resolveTile({
    tile,
    way,
    color
  });
  const base = basePath != null ? basePath : dsAssetBase();
  const url = src || `${base}assets/patterns/pattern-${id.toLowerCase()}.png`;
  const uid = React.useId().replace(/:/g, "");
  const tiled = size !== "cover" && size !== "contain";
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: "relative",
      overflow: "hidden",
      background: color || "var(--more-night-blue)",
      borderRadius: radius,
      isolation: "isolate",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: "absolute",
      inset: 0,
      backgroundImage: `url("${url}")`,
      backgroundSize: tiled ? size : size,
      backgroundRepeat: tiled ? "repeat" : "no-repeat",
      backgroundPosition: position,
      opacity: tileOpacity,
      pointerEvents: "none"
    }
  }), grain && /*#__PURE__*/React.createElement("svg", {
    "aria-hidden": "true",
    width: "100%",
    height: "100%",
    style: {
      position: "absolute",
      inset: 0,
      opacity: grainOpacity,
      mixBlendMode: "overlay",
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("filter", {
    id: `mm-grain-${uid}`
  }, /*#__PURE__*/React.createElement("feTurbulence", {
    type: "fractalNoise",
    baseFrequency: "0.9",
    numOctaves: "2",
    stitchTiles: "stitch"
  }), /*#__PURE__*/React.createElement("feColorMatrix", {
    type: "saturate",
    values: "0"
  })), /*#__PURE__*/React.createElement("rect", {
    width: "100%",
    height: "100%",
    filter: `url(#mm-grain-${uid})`
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 1,
      height: "100%"
    }
  }, children));
}
Object.assign(__ds_scope, { PATTERN_TILES, PatternPanel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/media/PatternPanel.jsx", error: String((e && e.message) || e) }); }

// components/media/PlayButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Circular play / pause control. Calm hover (warm deepen), gentle press. */
function PlayButton({
  playing = false,
  size = 56,
  label,
  style,
  onClick,
  ...rest
}) {
  const r = size;
  return /*#__PURE__*/React.createElement("button", _extends({
    onClick: onClick,
    "aria-label": label || (playing ? "Pause" : "Play"),
    className: "mm-play",
    style: {
      width: r,
      height: r,
      flex: "none",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "var(--radius-pill)",
      border: "none",
      cursor: "pointer",
      background: "var(--more-harvest-yellow)",
      color: "var(--more-oak-brown)",
      transition: "background var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-standard)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("svg", {
    width: size * 0.4,
    height: size * 0.4,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": "true"
  }, playing ? /*#__PURE__*/React.createElement("path", {
    d: "M7 5h4v14H7zM13 5h4v14h-4z"
  }) : /*#__PURE__*/React.createElement("path", {
    d: "M8 5.2v13.6a.8.8 0 0 0 1.22.68l10.6-6.8a.8.8 0 0 0 0-1.36L9.22 4.52A.8.8 0 0 0 8 5.2z"
  })), /*#__PURE__*/React.createElement("style", null, `
        .mm-play:hover { background: var(--more-oak-brown); color: var(--more-ivory-beige); }
        .mm-play:active { transform: scale(0.96); }
        .mm-play:focus-visible { outline: 2px solid var(--focus-ring); outline-offset: 3px; }
      `));
}
Object.assign(__ds_scope, { PlayButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/media/PlayButton.jsx", error: String((e && e.message) || e) }); }

// components/media/AudioBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function fmt(s) {
  if (s == null || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
}

/** Sticky-style audio player bar. Controlled progress (0–1) for mockups. */
function AudioBar({
  title,
  episode,
  progress = 0.33,
  duration = 2460,
  playing = false,
  onToggle,
  onSeek,
  style,
  ...rest
}) {
  const cur = Math.round(progress * duration);
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-5)",
      padding: "var(--space-4) var(--space-5)",
      background: "var(--surface-raised)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-card)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.PlayButton, {
    playing: playing,
    onClick: onToggle,
    size: 48
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      gap: "var(--space-4)",
      marginBottom: "var(--space-2)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-serif)",
      fontSize: "var(--text-sm)",
      color: "var(--text-primary)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, episode && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-primary)",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-caps)",
      fontSize: "var(--text-2xs)",
      marginRight: "0.8em"
    }
  }, episode), title)), /*#__PURE__*/React.createElement("div", {
    onClick: e => {
      if (!onSeek) return;
      const rect = e.currentTarget.getBoundingClientRect();
      onSeek((e.clientX - rect.left) / rect.width);
    },
    style: {
      position: "relative",
      height: 4,
      borderRadius: 999,
      background: "var(--border-subtle)",
      cursor: onSeek ? "pointer" : "default"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      width: `${progress * 100}%`,
      background: "var(--accent)",
      borderRadius: 999
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "50%",
      left: `${progress * 100}%`,
      width: 10,
      height: 10,
      marginLeft: -5,
      marginTop: -5,
      borderRadius: "50%",
      background: "var(--accent)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "var(--space-2)",
      fontSize: "var(--text-2xs)",
      letterSpacing: "0.06em",
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("span", null, fmt(cur)), /*#__PURE__*/React.createElement("span", null, fmt(duration)))));
}
Object.assign(__ds_scope, { AudioBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/media/AudioBar.jsx", error: String((e && e.message) || e) }); }

// components/media/PullQuote.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Large italic serif pull-quote — the brand's signature editorial device. */
function PullQuote({
  children,
  cite,
  marks = true,
  align = "left",
  size = "lg",
  style,
  ...rest
}) {
  const sizes = {
    md: {
      fontSize: "var(--text-xl)",
      lineHeight: "var(--leading-display-xs)"
    },
    lg: {
      fontSize: "var(--text-2xl)",
      lineHeight: "var(--leading-display-xs)"
    },
    xl: {
      fontSize: "var(--text-3xl)",
      lineHeight: "var(--leading-display-sm)"
    }
  };
  const text = marks && typeof children === "string" ? `\u201C${children}\u201D` : children;
  return /*#__PURE__*/React.createElement("figure", _extends({
    style: {
      margin: 0,
      textAlign: align,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("blockquote", {
    style: {
      margin: 0,
      fontFamily: "var(--font-serif)",
      fontStyle: "italic",
      fontSize: sizes[size].fontSize,
      lineHeight: sizes[size].lineHeight,
      color: "var(--text-primary)",
      textWrap: "pretty"
    }
  }, text), cite && /*#__PURE__*/React.createElement("figcaption", {
    style: {
      marginTop: "var(--space-4)",
      fontStyle: "normal",
      fontSize: "var(--text-xs)",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-caps)",
      color: "var(--text-primary)"
    }
  }, cite));
}
Object.assign(__ds_scope, { PullQuote });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/media/PullQuote.jsx", error: String((e && e.message) || e) }); }

// deck-stage.js
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
/* ═══ THIS PROJECT USES DESIGN COMPONENTS (.dc.html) ═══
 * Reference this stage from your <x-dc> template as an import — NEVER as a
 * raw <deck-stage> tag plus a <script src> (that hides the whole deck until
 * the stream finishes):
 *
 *   <x-import component-from-global-scope="deck-stage" from="./deck-stage.js"
 *             width="1920" height="1080" hint-size="100%,100%">
 *     <section data-label="Title" style="...">…</section>
 *     <section data-label="Agenda" style="...">…</section>
 *   </x-import>
 *
 * Slides are inline-styled <section> siblings; do not add a stylesheet or a
 * deck-stage:not(:defined) rule. The plain-HTML "Usage" block in the comment
 * below does NOT apply to .dc.html templates.
 */
/* BEGIN USAGE */
/**
 * <deck-stage> — reusable web component for HTML decks.
 *
 * Handles:
 *  (a) speaker notes — reads <script type="application/json" id="speaker-notes">
 *      and posts {slideIndexChanged: N} to the parent window on nav.
 *  (b) keyboard navigation — ←/→, PgUp/PgDn, Space, Home/End, number keys.
 *      On touch devices, tapping the left/right half of the stage goes
 *      prev/next — taps on links, buttons and other interactive slide
 *      content are left alone.
 *  (c) press R to reset to slide 0 (with a tasteful keyboard hint).
 *  (d) bottom-center overlay showing slide count + hints, fades out on idle.
 *  (e) auto-scaling — inner canvas is a fixed design size (default 1920×1080)
 *      scaled with `transform: scale()` to fit the viewport, letterboxed.
 *      Set the `noscale` attribute to render at authored size (1:1) — the
 *      PPTX exporter sets this so its DOM capture sees unscaled geometry.
 *  (f) print — `@media print` lays every slide out as its own page at the
 *      design size, so the browser's Print → Save as PDF produces a clean
 *      one-page-per-slide PDF with no extra setup.
 *  (g) thumbnail rail — resizable left-hand column of per-slide thumbnails
 *      (static clones). Click to navigate; ↑/↓ with a thumbnail focused to
 *      step between slides; drag to reorder; right-click for
 *      Skip / Move up / Move down / Duplicate / Delete (Delete opens a
 *      Cancel/Delete confirm dialog). Drag the rail's right edge to resize;
 *      width persists to
 *      localStorage. Skipped slides carry `data-deck-skip`, are dimmed in
 *      the rail, omitted from prev/next navigation, and hidden at print.
 *      The rail is suppressed in presenting mode, in the host's Preview
 *      mode (ViewerMode='none'), on `noscale`, on narrow viewports
 *      (≤640px), and via the `no-rail` attribute. Rail mutations dispatch
 *      a `dc-op` CustomEvent on the element (see docs/dc-ops.md) and do
 *      NOT touch the DOM: the host applies the op and re-renders;
 *      structural rail input is locked until the host posts
 *      {__dc_op_ack: true, applied}.
 *
 * Slides are HIDDEN, not unmounted. Non-active slides stay in the DOM with
 * `visibility: hidden` + `opacity: 0`, so their state (videos, iframes,
 * form inputs, React trees) is preserved across navigation.
 *
 * Lifecycle event — the component dispatches a `slidechange` CustomEvent on
 * itself whenever the active slide changes (including the initial mount).
 * The event bubbles and composes out of shadow DOM, so you can listen on
 * the <deck-stage> element or on document:
 *
 *   document.querySelector('deck-stage').addEventListener('slidechange', (e) => {
 *     e.detail.index         // new 0-based index
 *     e.detail.previousIndex // previous index, or -1 on init
 *     e.detail.total         // total slide count
 *     e.detail.slide         // the new active slide element
 *     e.detail.previousSlide // the prior slide element, or null on init
 *     e.detail.reason        // 'init' | 'keyboard' | 'click' | 'tap' | 'api'
 *   });
 *
 * Persistence: none at the deck level. The host app keeps the current slide
 * in its own URL (?slide=) and re-delivers it via location.hash on load, so a
 * bare load with no hash always starts at slide 1.
 *
 * Usage:
 *   <style>deck-stage:not(:defined){visibility:hidden}</style>
 *   <deck-stage width="1920" height="1080">
 *     <section data-label="Title">...</section>
 *     <section data-label="Agenda">...</section>
 *   </deck-stage>
 *   <script src="deck-stage.js"></script>
 *
 * The :not(:defined) rule prevents a flash of the first slide at its
 * authored styles before this script runs and attaches the shadow root.
 *
 * Slides are the direct element children of <deck-stage>. Each slide is
 * automatically tagged with:
 *   - data-screen-label="NN Label"   (1-indexed, for comment flow)
 *   - data-om-validate="no_overflowing_text,no_overlapping_text,slide_sized_text"
 *
 * Speaker notes stay in sync because the component posts {slideIndexChanged: N}
 * to the parent — just include the #speaker-notes script tag if asked for notes.
 *
 * Authoring guidance:
 *   - Write slide bodies as static HTML inside <deck-stage>, with sizing via
 *     CSS custom properties in a <style> block rather than JS constants.
 *     Static slide markup is what lets the user click a heading in edit mode
 *     and retype it directly; a slide rendered through <script type="text/babel">,
 *     React, or a loop over a JS array has to round-trip every tweak through a
 *     chat message instead. Reach for script-generated slides only when the
 *     content genuinely needs interactive behaviour static HTML can't express.
 *   - Do NOT set position/inset/width/height on the slide <section> elements —
 *     the component absolutely positions every slotted child for you.
 *   - Entrance animations: make the visible end-state the base style and
 *     animate *from* hidden, so print and reduced-motion show content.
 *     Gate the animation on [data-deck-active] and the motion query, e.g.
 *     `@media (prefers-reduced-motion:no-preference){ [data-deck-active] .x{animation:fade-in .5s both} }`.
 *     Avoid infinite decorative loops on slide content.
 */
/* END USAGE */

(() => {
  const DESIGN_W_DEFAULT = 1920;
  const DESIGN_H_DEFAULT = 1080;
  const OVERLAY_HIDE_MS = 1800;
  const VALIDATE_ATTR = 'no_overflowing_text,no_overlapping_text,slide_sized_text';
  const FINE_POINTER_MQ = matchMedia('(hover: hover) and (pointer: fine)');
  const NARROW_MQ = matchMedia('(max-width: 640px)');
  // Slide-authored controls that should keep a tap instead of it navigating.
  const INTERACTIVE_SEL = 'a[href], button, input, select, textarea, summary, label, video[controls], audio[controls], [role="button"], [onclick], [tabindex]:not([tabindex^="-"]), [contenteditable]:not([contenteditable="false" i])';
  const pad2 = n => String(n).padStart(2, '0');

  // Label precedence: data-label → data-screen-label (number stripped) → first heading → "Slide".
  const getSlideLabel = el => {
    const explicit = el.getAttribute('data-label');
    if (explicit) return explicit;
    const existing = el.getAttribute('data-screen-label');
    if (existing) return existing.replace(/^\s*\d+\s*/, '').trim() || existing;
    const h = el.querySelector('h1, h2, h3, [data-title]');
    const t = h && (h.textContent || '').trim().slice(0, 40);
    if (t) return t;
    return 'Slide';
  };
  const stylesheet = `
    :host {
      position: fixed;
      inset: 0;
      display: block;
      background: #000;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
      overflow: hidden;
      -webkit-tap-highlight-color: transparent;
    }
    /* connectedCallback holds this until document.fonts.ready (capped 2s) so
     * the first visible paint has the deck's real typography + final rail
     * layout. opacity (not visibility) so the active slide can't un-hide
     * itself via the ::slotted([data-deck-active]) visibility:visible rule.
     * Only the stage/rail hide — the black :host background stays, so the
     * iframe doesn't flash the page's default white. */
    :host([data-fonts-pending]) .stage,
    :host([data-fonts-pending]) .rail { opacity: 0; pointer-events: none; }

    .stage {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .canvas {
      position: relative;
      transform-origin: center center;
      flex-shrink: 0;
      background: #fff;
      will-change: transform;
    }

    /* Slides live in light DOM (via <slot>) so authored CSS still applies.
       We absolutely position each slotted child to stack them. */
    ::slotted(*) {
      position: absolute !important;
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
      box-sizing: border-box !important;
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
      visibility: hidden;
    }
    ::slotted([data-deck-active]) {
      opacity: 1;
      pointer-events: auto;
      visibility: visible;
    }

    .overlay {
      position: fixed;
      left: 50%;
      bottom: 22px;
      transform: translate(-50%, 6px) scale(0.92);
      filter: blur(6px);
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px;
      background: #000;
      color: #fff;
      border-radius: 999px;
      font-size: 12px;
      font-feature-settings: "tnum" 1;
      letter-spacing: 0.01em;
      opacity: 0;
      pointer-events: none;
      transition: opacity 260ms ease, transform 260ms cubic-bezier(.2,.8,.2,1), filter 260ms ease;
      transform-origin: center bottom;
      z-index: 2147483000;
      user-select: none;
    }
    .overlay[data-visible] {
      opacity: 1;
      pointer-events: auto;
      transform: translate(-50%, 0) scale(1);
      filter: blur(0);
    }

    .btn {
      appearance: none;
      -webkit-appearance: none;
      background: transparent;
      border: 0;
      margin: 0;
      padding: 0;
      color: inherit;
      font: inherit;
      cursor: default;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 28px;
      min-width: 28px;
      border-radius: 999px;
      color: rgba(255,255,255,0.72);
      transition: background 140ms ease, color 140ms ease;
      -webkit-tap-highlight-color: transparent;
    }
    .btn:hover { background: rgba(255,255,255,0.12); color: #fff; }
    .btn:active { background: rgba(255,255,255,0.18); }
    .btn:focus { outline: none; }
    .btn:focus-visible { outline: none; }
    .btn::-moz-focus-inner { border: 0; }
    .btn svg { width: 14px; height: 14px; display: block; }
    .btn.reset {
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.02em;
      padding: 0 10px 0 12px;
      gap: 6px;
      color: rgba(255,255,255,0.72);
    }
    .btn.reset .kbd {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 16px;
      height: 16px;
      padding: 0 4px;
      font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
      font-size: 10px;
      line-height: 1;
      color: rgba(255,255,255,0.88);
      background: rgba(255,255,255,0.12);
      border-radius: 4px;
    }

    .count {
      font-variant-numeric: tabular-nums;
      color: #fff;
      font-weight: 500;
      padding: 0 8px;
      min-width: 42px;
      text-align: center;
      font-size: 12px;
    }
    .count .sep { color: rgba(255,255,255,0.45); margin: 0 3px; font-weight: 400; }
    .count .total { color: rgba(255,255,255,0.55); }

    .divider {
      width: 1px;
      height: 14px;
      background: rgba(255,255,255,0.18);
      margin: 0 2px;
    }

    /* ── Thumbnail rail ──────────────────────────────────────────────────
       Fixed column on the left; each thumbnail is a static deep-clone of
       the light-DOM slide scaled into a 16:9 (or design-aspect) frame. The
       stage re-fits around it (see _fit); hidden during present / noscale
       / print so capture geometry and fullscreen output are unchanged. */
    .rail {
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      width: var(--deck-rail-w, 188px);
      background: #141414;
      border-right: 1px solid rgba(255,255,255,0.08);
      overflow-y: auto;
      overflow-x: hidden;
      padding: 12px 10px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 12px;
      z-index: 2147482500;
      scrollbar-width: thin;
      scrollbar-color: rgba(255,255,255,0.18) transparent;
    }
    .rail::-webkit-scrollbar { width: 8px; }
    .rail::-webkit-scrollbar-track { background: transparent; margin: 2px; }
    .rail::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.18);
      border-radius: 4px;
      border: 2px solid transparent;
      background-clip: content-box;
    }
    .rail::-webkit-scrollbar-thumb:hover {
      background: rgba(255,255,255,0.28);
      border: 2px solid transparent;
      background-clip: content-box;
    }
    :host([no-rail]) .rail,
    :host([noscale]) .rail { display: none; }
    .rail[data-presenting] { display: none; }
    @media (max-width: 640px) {
      .rail, .rail-resize { display: none; }
    }
    /* User-driven show/hide (the TweaksPanel toggle) slides instead of
       popping. Transitions are gated on :host([data-rail-anim]) — set only
       for the 200ms around the toggle — so window-resize and rail-width
       drag (which also call _fit) don't lag behind the cursor. */
    .rail[data-user-hidden] { transform: translateX(-100%); }
    :host([data-rail-anim]) .rail { transition: transform 200ms cubic-bezier(.3,.7,.4,1); }
    :host([data-rail-anim]) .stage { transition: left 200ms cubic-bezier(.3,.7,.4,1); }
    :host([data-rail-anim]) .canvas { transition: transform 200ms cubic-bezier(.3,.7,.4,1); }
    /* transition shorthand replaces rather than merges — repeat the base
       .overlay opacity/transform/filter transitions so visibility changes
       during the 200ms toggle window still fade instead of popping. */
    :host([data-rail-anim]) .overlay {
      transition: margin-left 200ms cubic-bezier(.3,.7,.4,1),
                  opacity 260ms ease,
                  transform 260ms cubic-bezier(.2,.8,.2,1),
                  filter 260ms ease;
    }

    .thumb {
      position: relative;
      display: flex;
      align-items: flex-start;
      gap: 8px;
      cursor: pointer;
      user-select: none;
    }
    .thumb .num {
      width: 16px;
      flex-shrink: 0;
      font-size: 11px;
      font-weight: 500;
      text-align: right;
      color: rgba(255,255,255,0.55);
      padding-top: 2px;
      font-variant-numeric: tabular-nums;
    }
    .thumb .frame {
      position: relative;
      flex: 1;
      min-width: 0;
      aspect-ratio: var(--deck-aspect);
      background: #fff;
      border-radius: 4px;
      outline: 2px solid transparent;
      outline-offset: 0;
      overflow: hidden;
      transition: outline-color 120ms ease;
    }
    .thumb:hover .frame { outline-color: rgba(255,255,255,0.25); }
    .thumb { outline: none; }
    .thumb:focus-visible .frame { outline-color: rgba(255,255,255,0.5); }
    .thumb[data-current] .num { color: #fff; }
    .thumb[data-current] .frame { outline-color: #D97757; }
    .thumb[data-dragging] { opacity: 0.35; }
    .thumb::before {
      content: '';
      position: absolute;
      left: 24px;
      right: 0;
      height: 3px;
      border-radius: 2px;
      background: #D97757;
      opacity: 0;
      pointer-events: none;
    }
    .thumb[data-drop="before"]::before { top: -8px; opacity: 1; }
    .thumb[data-drop="after"]::before { bottom: -8px; opacity: 1; }
    .thumb[data-skip] .frame { opacity: 0.35; }
    .thumb[data-skip] .frame::after {
      content: 'Skipped';
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.45);
      color: #fff;
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 0.04em;
    }

    .ctxmenu {
      position: fixed;
      min-width: 150px;
      padding: 4px;
      background: #242424;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 7px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.45);
      z-index: 2147483100;
      display: none;
      font-size: 12px;
    }
    .ctxmenu[data-open] { display: block; }
    .ctxmenu button {
      display: block;
      width: 100%;
      appearance: none;
      border: 0;
      background: transparent;
      color: #e8e8e8;
      font: inherit;
      text-align: left;
      padding: 6px 10px;
      border-radius: 4px;
      cursor: pointer;
    }
    .ctxmenu button:hover:not(:disabled) { background: rgba(255,255,255,0.08); }
    .ctxmenu button:disabled { opacity: 0.35; cursor: default; }
    .ctxmenu hr {
      border: 0;
      border-top: 1px solid rgba(255,255,255,0.1);
      margin: 4px 2px;
    }

    .rail-resize {
      position: fixed;
      left: calc(var(--deck-rail-w, 188px) - 3px);
      top: 0;
      bottom: 0;
      width: 6px;
      cursor: col-resize;
      z-index: 2147482600;
      touch-action: none;
    }
    .rail-resize:hover,
    .rail-resize[data-dragging] { background: rgba(255,255,255,0.12); }
    :host([no-rail]) .rail-resize,
    :host([noscale]) .rail-resize,
    .rail[data-presenting] + .rail-resize,
    .rail[data-user-hidden] + .rail-resize { display: none; }

    /* Delete-confirm popup — matches the SPA's ConfirmDialog layout
       (title + message body, depressed footer with Cancel / Delete). */
    .confirm-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.45);
      z-index: 2147483200;
      display: none;
      align-items: center;
      justify-content: center;
    }
    .confirm-backdrop[data-open] { display: flex; }
    .confirm {
      width: 320px;
      max-width: calc(100vw - 32px);
      background: #2a2a2a;
      color: #e8e8e8;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 12px;
      box-shadow: 0 12px 32px rgba(0,0,0,0.5);
      overflow: hidden;
      font-family: inherit;
      animation: deck-confirm-in 0.18s ease;
    }
    @keyframes deck-confirm-in {
      from { opacity: 0; transform: scale(0.96); }
      to { opacity: 1; transform: scale(1); }
    }
    .confirm .body { padding: 20px 20px 16px; }
    .confirm .title { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
    .confirm .msg { font-size: 13px; line-height: 1.5; color: rgba(255,255,255,0.65); }
    .confirm .footer {
      padding: 14px 20px;
      background: #1f1f1f;
      border-top: 1px solid rgba(255,255,255,0.08);
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    .confirm button {
      appearance: none;
      font: inherit;
      font-size: 13px;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
    }
    .confirm .cancel {
      background: transparent;
      border: 0;
      color: rgba(255,255,255,0.8);
    }
    .confirm .cancel:hover { background: rgba(255,255,255,0.08); }
    .confirm .danger {
      background: #c96442;
      border: 1px solid rgba(0,0,0,0.15);
      color: #fff;
      box-shadow: 0 1px 3px rgba(166,50,68,0.3), 0 2px 6px rgba(166,50,68,0.18);
    }
    .confirm .danger:hover { background: #b5563a; }

    /* ── Print: one page per slide, no chrome ────────────────────────────
       The screen layout stacks every slide at inset:0 inside a scaled
       canvas; for print we want them in document flow at the authored
       design size so the browser paginates one slide per sheet. The
       @page size is set from the width/height attributes via the inline
       <style id="deck-stage-print-page"> that _syncPrintPageRule appends
       to the document (the @page at-rule has no effect inside shadow DOM). */
    @media print {
      :host {
        position: static;
        inset: auto;
        background: none;
        overflow: visible;
        color: inherit;
      }
      .stage { position: static; display: block; }
      .canvas {
        transform: none !important;
        width: auto !important;
        height: auto !important;
        background: none;
        will-change: auto;
      }
      ::slotted(*) {
        position: relative !important;
        inset: auto !important;
        width: var(--deck-design-w) !important;
        height: var(--deck-design-h) !important;
        box-sizing: border-box !important;
        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: auto;
        break-after: page;
        page-break-after: always;
        break-inside: avoid;
        overflow: hidden;
      }
      /* :last-child alone isn't enough once data-deck-skip hides the
         trailing slide(s) — the last *visible* slide still carries
         break-after:page and prints a blank sheet. _markLastVisible()
         maintains data-deck-last-visible on the last non-skipped slide. */
      ::slotted(*:last-child),
      ::slotted([data-deck-last-visible]) {
        break-after: auto;
        page-break-after: auto;
      }
      ::slotted([data-deck-skip]) { display: none !important; }
      .overlay, .rail, .rail-resize, .ctxmenu, .confirm-backdrop { display: none !important; }
    }
  `;
  class DeckStage extends HTMLElement {
    static get observedAttributes() {
      return ['width', 'height', 'noscale', 'no-rail'];
    }
    constructor() {
      super();
      this._root = this.attachShadow({
        mode: 'open'
      });
      this._index = 0;
      this._slides = [];
      this._notes = [];
      this._hideTimer = null;
      this._mouseIdleTimer = null;
      this._menuIndex = -1;
      this._onKey = this._onKey.bind(this);
      this._onResize = this._onResize.bind(this);
      this._onSlotChange = this._onSlotChange.bind(this);
      this._onMouseMove = this._onMouseMove.bind(this);
      this._onTap = this._onTap.bind(this);
      this._onMessage = this._onMessage.bind(this);
      // Capture-phase close so a click anywhere dismisses the menu, but
      // ignore clicks that land inside the menu itself — otherwise the
      // capture handler runs before the menu's own (bubble) handler and
      // clears _menuIndex out from under it.
      this._onDocClick = e => {
        if (this._menu && e.composedPath && e.composedPath().includes(this._menu)) return;
        this._closeMenu();
      };
    }
    get designWidth() {
      return parseInt(this.getAttribute('width'), 10) || DESIGN_W_DEFAULT;
    }
    get designHeight() {
      return parseInt(this.getAttribute('height'), 10) || DESIGN_H_DEFAULT;
    }
    connectedCallback() {
      // Presenter-view popup loads deckUrl?_snthumb=...#N for its prev/cur/
      // next thumbnails — the rail has no business rendering inside those
      // (wrong scale, and it offsets the stage so the thumb shows a gutter).
      if (/[?&]_snthumb=/.test(location.search)) this.setAttribute('no-rail', '');
      this._render();
      this._loadNotes();
      this._syncPrintPageRule();
      window.addEventListener('keydown', this._onKey);
      window.addEventListener('resize', this._onResize);
      window.addEventListener('mousemove', this._onMouseMove, {
        passive: true
      });
      window.addEventListener('message', this._onMessage);
      window.addEventListener('click', this._onDocClick, true);
      this.addEventListener('click', this._onTap);
      // Print lays every slide out as its own page, so [data-deck-active]-
      // gated entrance styles need the attribute on every slide (not just
      // the current one) or their content prints at the hidden base style.
      // The transient freeze style lands BEFORE the attributes so any
      // attribute-keyed transition fires at 0s (changing transition-
      // duration after a transition has started doesn't affect it).
      this._onBeforePrint = () => {
        this._syncPrintPageRule();
        if (this._freezeStyle) this._freezeStyle.remove();
        this._freezeStyle = document.createElement('style');
        this._freezeStyle.textContent = '*,*::before,*::after{transition-duration:0s !important}';
        document.head.appendChild(this._freezeStyle);
        this._slides.forEach(s => s.setAttribute('data-deck-active', ''));
      };
      this._onAfterPrint = () => {
        this._applyIndex({
          showOverlay: false,
          broadcast: false
        });
        if (this._freezeStyle) {
          this._freezeStyle.remove();
          this._freezeStyle = null;
        }
      };
      window.addEventListener('beforeprint', this._onBeforePrint);
      window.addEventListener('afterprint', this._onAfterPrint);
      // Initial collection + layout happens via slotchange, which fires on mount.
      this._enableRail();
      // Hold the stage hidden until webfonts are ready so the first visible
      // paint has the deck's real typography — the :not(:defined) guard in
      // the page HTML only covers custom-element upgrade, not font load.
      // Capped so a 404'd font URL can't blank the deck indefinitely.
      this.setAttribute('data-fonts-pending', '');
      const reveal = () => this.removeAttribute('data-fonts-pending');
      // rAF first: fonts.ready is a pre-resolved promise until layout has
      // resolved the slotted text's font-family and pushed a FontFace into
      // 'loading'. Reading it here in connectedCallback (parse-time) would
      // settle the race in a microtask before any font fetch starts.
      requestAnimationFrame(() => {
        Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise(r => setTimeout(r, 2000))]).then(reveal, reveal);
      });
    }
    _enableRail() {
      // Idempotent — older host builds still post __omelette_rail_enabled.
      // no-rail guard keeps the observers/stylesheet walk off the cheap path
      // for presenter-popup thumbnail iframes (up to 9 per view).
      if (this._railEnabled || this.hasAttribute('no-rail')) return;
      this._railEnabled = true;
      // Per-viewer preference — restored alongside rail width. Default on;
      // only a stored '0' (from the TweaksPanel toggle) hides it.
      this._railVisible = true;
      try {
        if (localStorage.getItem('deck-stage.railVisible') === '0') this._railVisible = false;
      } catch (e) {}
      // Live thumbnail updates: watch the light-DOM slides for content
      // edits and re-clone just the affected thumb(s), debounced. Ignore
      // the data-deck-* / data-screen-label / data-om-validate attributes
      // this component itself writes so nav doesn't trigger spurious
      // refreshes — except data-deck-skip, which now arrives from the host
      // re-render and is what updates the rail badge, print bookkeeping,
      // and deckSkipped re-broadcast.
      const OWN_ATTRS = /^data-(deck-(?!skip$)|screen-label$|om-validate$)/;
      this._liveDirty = new Set();
      this._liveObserver = new MutationObserver(records => {
        for (const r of records) {
          if (r.type === 'attributes' && OWN_ATTRS.test(r.attributeName || '')) continue;
          let n = r.target;
          while (n && n.parentElement !== this) n = n.parentElement;
          // Skip/unskip is handled below without re-cloning (the badge sits
          // on the thumb wrapper, not the clone) — don't mark the slide
          // dirty for an attr change whose only visible effect is the badge.
          if (n && this._slideSet && this._slideSet.has(n) && !(r.type === 'attributes' && r.attributeName === 'data-deck-skip')) {
            this._liveDirty.add(n);
          }
          // Host-driven skip toggle: sync the rail badge + print + presenter
          // skipped-list the way _toggleSkip used to do locally.
          if (r.type === 'attributes' && r.attributeName === 'data-deck-skip' && n && this._slideSet && this._slideSet.has(n)) {
            const i = this._slides.indexOf(n);
            if (this._thumbs && this._thumbs[i]) {
              if (n.hasAttribute('data-deck-skip')) this._thumbs[i].thumb.setAttribute('data-skip', '');else this._thumbs[i].thumb.removeAttribute('data-skip');
            }
            this._markLastVisible();
            try {
              window.postMessage({
                slideIndexChanged: this._index,
                deckTotal: this._slides.length,
                deckSkipped: this._skippedIndices()
              }, '*');
            } catch (e) {}
          }
        }
        if (this._liveDirty.size && !this._liveTimer) {
          this._liveTimer = setTimeout(() => {
            this._liveTimer = null;
            this._liveDirty.forEach(s => this._refreshThumb(s));
            this._liveDirty.clear();
          }, 200);
        }
      });
      this._liveObserver.observe(this, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true
      });
      // Lazy thumbnail materialization — clone the slide only when its
      // frame scrolls into (or near) the rail viewport. rootMargin gives
      // ~4 thumbs of pre-load so fast scrolling doesn't flash blanks.
      this._railObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting && e.target.__deckThumb) {
            this._materialize(e.target.__deckThumb);
          }
        });
      }, {
        root: this._rail,
        rootMargin: '400px 0px'
      });
      // Tweaks typically change CSS vars / attrs OUTSIDE <deck-stage>
      // (on <html>, <body>, a wrapper div, or a <style> tag), which
      // _liveObserver can't see. Re-snapshot author CSS (constructable
      // sheet is shared by reference, so one replaceSync updates every
      // thumb shadow root) and re-sync each thumb host's attrs + custom
      // properties. In-slide DOM mutations are _liveObserver's job.
      // Debounced so slider drags don't thrash.
      this._onTweakChange = () => {
        clearTimeout(this._tweakTimer);
        this._tweakTimer = setTimeout(() => {
          this._snapshotAuthorCss();
          // One getComputedStyle for the whole batch — each
          // getPropertyValue read below reuses the same computed style
          // as long as nothing invalidates layout between thumbs.
          const cs = getComputedStyle(this);
          (this._thumbs || []).forEach(t => {
            if (t.host) this._syncThumbHostAttrs(t.host, cs);
          });
        }, 120);
      };
      window.addEventListener('tweakchange', this._onTweakChange);
      this._snapshotAuthorCss();
      // Build the rail now that it's enabled — slotchange already fired,
      // so _renderRail's early-return skipped the initial build.
      this._syncRailHidden();
      this._renderRail();
      this._fit();
    }

    /** Snapshot document stylesheets into a constructable sheet that each
     *  thumbnail's nested shadow root adopts — so author CSS styles the
     *  cloned slide content without touching this component's chrome.
     *  Cross-origin sheets throw on .cssRules — skip them. Re-callable:
     *  the existing constructable sheet is reused via replaceSync so every
     *  already-adopted shadow root picks up the fresh CSS without re-adopt. */
    _snapshotAuthorCss() {
      // :root in an adopted sheet inside a shadow root matches nothing
      // (only the document root qualifies), so author rules like
      // `:root[data-voice="modern"] .serif` never reach the clones.
      // Rewrite :root → :host and mirror <html>'s data-*/class/lang onto
      // each thumb host (see _syncThumbHostAttrs) so the same selectors
      // match inside the thumbnail's shadow tree.
      const authorCss = Array.from(document.styleSheets).map(sh => {
        try {
          return Array.from(sh.cssRules).map(r => r.cssText).join('\n');
        } catch (e) {
          return '';
        }
      }).join('\n')
      // The shadow host is featureless outside the functional :host(...)
      // form, so any compound on :root — [attr], .class, #id, :pseudo —
      // must become :host(<compound>) not :host<compound>. Same for the
      // html type selector (Tailwind class-strategy dark mode emits
      // html.dark; Pico uses html[data-theme]), which has nothing to
      // match inside the thumb's shadow tree.
      .replace(/:root((?:\[[^\]]*\]|[.#][-\w]+|:[-\w]+(?:\([^)]*\))?)+)/g, ':host($1)').replace(/:root\b/g, ':host').replace(/(^|[\s,>~+(}])html((?:\[[^\]]*\]|[.#][-\w]+|:[-\w]+(?:\([^)]*\))?)+)(?![-\w])/g, '$1:host($2)').replace(/(^|[\s,>~+(}])html(?![-\w])/g, '$1:host');
      // Every custom property the author references. _syncThumbHostAttrs
      // mirrors each one's *computed* value at <deck-stage> onto the
      // thumb host so the live value wins over the :host default above
      // regardless of which ancestor the tweak wrote to (<html>, <body>,
      // a wrapper div, or the deck-stage element itself all inherit
      // down to getComputedStyle(this)).
      this._authorVars = new Set(authorCss.match(/--[\w-]+/g) || []);
      try {
        if (!this._adoptedSheet) this._adoptedSheet = new CSSStyleSheet();
        this._adoptedSheet.replaceSync(authorCss);
      } catch (e) {
        this._adoptedSheet = null;
        this._authorCss = authorCss;
      }
    }
    _syncThumbHostAttrs(host, cs) {
      const de = document.documentElement;
      // setAttribute overwrites but can't delete — an attr removed from
      // <html> (toggleAttribute off, classList emptied) would linger on
      // the host and :host([data-*]) / :host(.foo) rules would keep
      // matching. Remove stale mirrored attrs first; iterate backward
      // because removeAttribute mutates the live NamedNodeMap.
      for (let i = host.attributes.length - 1; i >= 0; i--) {
        const n = host.attributes[i].name;
        if ((n.startsWith('data-') || n === 'class' || n === 'lang') && !de.hasAttribute(n)) {
          host.removeAttribute(n);
        }
      }
      for (const a of de.attributes) {
        if (a.name.startsWith('data-') || a.name === 'class' || a.name === 'lang') {
          host.setAttribute(a.name, a.value);
        }
      }
      // The :root→:host rewrite in _snapshotAuthorCss pins each custom
      // property to its stylesheet default on the thumb host, shadowing
      // the live value that would otherwise inherit. Tweaks can write the
      // live value on any ancestor — <html>, <body>, a wrapper div, the
      // deck-stage element — so read it as the *computed* value at
      // <deck-stage> (which sees the whole inheritance chain) rather than
      // trying to guess which element the author wrote to. Inline on the
      // host beats the :host{} rule. remove-stale covers vars dropped
      // from the stylesheet between snapshots.
      const vars = this._authorVars || new Set();
      for (let i = host.style.length - 1; i >= 0; i--) {
        const p = host.style[i];
        if (p.startsWith('--') && !vars.has(p)) host.style.removeProperty(p);
      }
      const live = cs || getComputedStyle(this);
      vars.forEach(p => {
        const v = live.getPropertyValue(p);
        if (v) host.style.setProperty(p, v.trim());else host.style.removeProperty(p);
      });
    }
    disconnectedCallback() {
      window.removeEventListener('keydown', this._onKey);
      window.removeEventListener('resize', this._onResize);
      window.removeEventListener('mousemove', this._onMouseMove);
      window.removeEventListener('message', this._onMessage);
      window.removeEventListener('click', this._onDocClick, true);
      window.removeEventListener('beforeprint', this._onBeforePrint);
      window.removeEventListener('afterprint', this._onAfterPrint);
      if (this._freezeStyle) {
        this._freezeStyle.remove();
        this._freezeStyle = null;
      }
      this.removeEventListener('click', this._onTap);
      if (this._hideTimer) clearTimeout(this._hideTimer);
      if (this._mouseIdleTimer) clearTimeout(this._mouseIdleTimer);
      if (this._liveTimer) clearTimeout(this._liveTimer);
      if (this._tweakTimer) clearTimeout(this._tweakTimer);
      if (this._railAnimTimer) clearTimeout(this._railAnimTimer);
      if (this._scaleRaf) cancelAnimationFrame(this._scaleRaf);
      if (this._liveObserver) this._liveObserver.disconnect();
      if (this._railObserver) this._railObserver.disconnect();
      if (this._onTweakChange) window.removeEventListener('tweakchange', this._onTweakChange);
    }
    attributeChangedCallback() {
      if (this._canvas) {
        this._canvas.style.width = this.designWidth + 'px';
        this._canvas.style.height = this.designHeight + 'px';
        this._canvas.style.setProperty('--deck-design-w', this.designWidth + 'px');
        this._canvas.style.setProperty('--deck-design-h', this.designHeight + 'px');
        if (this._rail) {
          this._rail.style.setProperty('--deck-aspect', this.designWidth + '/' + this.designHeight);
        }
        this._fit();
        this._scaleThumbs();
        this._syncPrintPageRule();
      }
    }
    _render() {
      const style = document.createElement('style');
      style.textContent = stylesheet;
      const stage = document.createElement('div');
      stage.className = 'stage';
      const canvas = document.createElement('div');
      canvas.className = 'canvas';
      canvas.style.width = this.designWidth + 'px';
      canvas.style.height = this.designHeight + 'px';
      canvas.style.setProperty('--deck-design-w', this.designWidth + 'px');
      canvas.style.setProperty('--deck-design-h', this.designHeight + 'px');
      const slot = document.createElement('slot');
      slot.addEventListener('slotchange', this._onSlotChange);
      canvas.appendChild(slot);
      stage.appendChild(canvas);

      // Overlay: compact, solid black, with clickable controls.
      const overlay = document.createElement('div');
      overlay.className = 'overlay export-hidden';
      overlay.setAttribute('role', 'toolbar');
      overlay.setAttribute('aria-label', 'Deck controls');
      overlay.setAttribute('data-omelette-chrome', '');
      overlay.innerHTML = `
        <button class="btn prev" type="button" aria-label="Previous slide" title="Previous (←)">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 3L5 8l5 5"/></svg>
        </button>
        <span class="count" aria-live="polite"><span class="current">1</span><span class="sep">/</span><span class="total">1</span></span>
        <button class="btn next" type="button" aria-label="Next slide" title="Next (→)">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3l5 5-5 5"/></svg>
        </button>
        <span class="divider"></span>
        <button class="btn reset" type="button" aria-label="Reset to first slide" title="Reset (R)">Reset<span class="kbd">R</span></button>
      `;
      overlay.querySelector('.prev').addEventListener('click', () => this._advance(-1, 'click'));
      overlay.querySelector('.next').addEventListener('click', () => this._advance(1, 'click'));
      overlay.querySelector('.reset').addEventListener('click', () => this._go(0, 'click'));

      // Thumbnail rail + context menu. Thumbnails are populated in
      // _renderRail() after _collectSlides().
      const rail = document.createElement('div');
      rail.className = 'rail export-hidden';
      rail.setAttribute('data-omelette-chrome', '');
      // Edit mode hooks wheel to pan the canvas; this opts the rail's own
      // scrollview out so thumbnails stay scrollable while editing.
      rail.setAttribute('data-dc-wheel-passthru', '');
      rail.style.setProperty('--deck-aspect', this.designWidth + '/' + this.designHeight);
      // Edge auto-scroll while dragging a thumb near the rail's top/bottom
      // so off-screen drop targets are reachable. Native dragover fires
      // continuously while the pointer is stationary, so a per-event nudge
      // (ramped by edge proximity) is enough — no rAF loop needed.
      rail.addEventListener('dragover', e => {
        if (this._dragFrom == null) return;
        const r = rail.getBoundingClientRect();
        const EDGE = 40;
        const dt = e.clientY - r.top;
        const db = r.bottom - e.clientY;
        if (dt < EDGE) rail.scrollTop -= Math.ceil((EDGE - dt) / 3);else if (db < EDGE) rail.scrollTop += Math.ceil((EDGE - db) / 3);
      });
      const menu = document.createElement('div');
      menu.className = 'ctxmenu export-hidden';
      menu.setAttribute('data-omelette-chrome', '');
      menu.innerHTML = `
        <button type="button" data-act="skip">Skip slide</button>
        <button type="button" data-act="up">Move up</button>
        <button type="button" data-act="down">Move down</button>
        <button type="button" data-act="duplicate">Duplicate slide</button>
        <hr>
        <button type="button" data-act="delete">Delete slide</button>
      `;
      menu.addEventListener('click', e => {
        const act = e.target && e.target.getAttribute && e.target.getAttribute('data-act');
        if (!act) return;
        const i = this._menuIndex;
        this._closeMenu();
        if (act === 'skip') this._toggleSkip(i);else if (act === 'up') this._moveSlide(i, i - 1);else if (act === 'down') this._moveSlide(i, i + 1);else if (act === 'duplicate') this._duplicateSlide(i);else if (act === 'delete') this._openConfirm(i);
      });
      menu.addEventListener('contextmenu', e => e.preventDefault());

      // Rail resize handle — drag to set --deck-rail-w, persisted to
      // localStorage so the width survives reloads.
      const resize = document.createElement('div');
      resize.className = 'rail-resize export-hidden';
      resize.setAttribute('data-omelette-chrome', '');
      resize.addEventListener('pointerdown', e => {
        e.preventDefault();
        resize.setPointerCapture(e.pointerId);
        resize.setAttribute('data-dragging', '');
        const move = ev => this._setRailWidth(ev.clientX);
        const up = () => {
          resize.removeEventListener('pointermove', move);
          resize.removeEventListener('pointerup', up);
          resize.removeEventListener('pointercancel', up);
          resize.removeAttribute('data-dragging');
          try {
            localStorage.setItem('deck-stage.railWidth', String(this._railPx));
          } catch (err) {}
        };
        resize.addEventListener('pointermove', move);
        resize.addEventListener('pointerup', up);
        resize.addEventListener('pointercancel', up);
      });

      // Delete-confirm dialog — mirrors the SPA's ConfirmDialog layout.
      const confirm = document.createElement('div');
      confirm.className = 'confirm-backdrop export-hidden';
      confirm.setAttribute('data-omelette-chrome', '');
      confirm.innerHTML = `
        <div class="confirm" role="dialog" aria-modal="true">
          <div class="body">
            <div class="title">Delete slide?</div>
            <div class="msg">This slide will be removed from the deck.</div>
          </div>
          <div class="footer">
            <button type="button" class="cancel">Cancel</button>
            <button type="button" class="danger">Delete</button>
          </div>
        </div>
      `;
      confirm.addEventListener('click', e => {
        if (e.target === confirm) this._closeConfirm();
      });
      confirm.querySelector('.cancel').addEventListener('click', () => this._closeConfirm());
      confirm.querySelector('.danger').addEventListener('click', () => {
        const i = this._confirmIndex;
        this._closeConfirm();
        this._deleteSlide(i);
      });
      this._root.append(style, rail, resize, stage, overlay, menu, confirm);
      this._canvas = canvas;
      this._stage = stage;
      this._slot = slot;
      this._overlay = overlay;
      this._rail = rail;
      this._resize = resize;
      this._menu = menu;
      this._confirm = confirm;
      this._countEl = overlay.querySelector('.current');
      this._totalEl = overlay.querySelector('.total');

      // Restore persisted rail width.
      let rw = 188;
      try {
        const s = localStorage.getItem('deck-stage.railWidth');
        if (s) rw = parseInt(s, 10) || rw;
      } catch (err) {}
      this._setRailWidth(rw);
      this._syncRailHidden();
    }
    _setRailWidth(px) {
      const w = Math.max(120, Math.min(360, Math.round(px)));
      this._railPx = w;
      this.style.setProperty('--deck-rail-w', w + 'px');
      this._fit();
      // _scaleThumbs forces a sync layout (frame.offsetWidth) then writes
      // N transforms. During a resize drag this runs per-pointermove;
      // coalesce to one per frame.
      if (!this._scaleRaf) {
        this._scaleRaf = requestAnimationFrame(() => {
          this._scaleRaf = null;
          this._scaleThumbs();
        });
      }
    }

    /** @page must live in the document stylesheet — it's a no-op inside
     *  shadow DOM. (Re-)append so any author @page landing later in
     *  source order can't reintroduce a margin and push each slide onto
     *  two sheets; called again from beforeprint. */
    _syncPrintPageRule() {
      const id = 'deck-stage-print-page';
      let tag = document.getElementById(id);
      if (!tag) {
        tag = document.createElement('style');
        tag.id = id;
      }
      (document.body || document.head).appendChild(tag);
      tag.textContent = '@page { size: ' + this.designWidth + 'px ' + this.designHeight + 'px; margin: 0; } ' + '@media print { html, body { margin: 0 !important; padding: 0 !important; background: none !important; overflow: visible !important; height: auto !important; } ' + '* { -webkit-print-color-adjust: exact; print-color-adjust: exact; } ' +
      // Jump authored animations/transitions to their end state so print
      // never captures mid-entrance — pairs with the beforeprint handler
      // in connectedCallback that sets data-deck-active on every slide.
      '*, *::before, *::after { animation-delay: -99s !important; animation-duration: .001s !important; ' + 'animation-iteration-count: 1 !important; animation-fill-mode: both !important; ' + 'animation-play-state: running !important; transition-duration: 0s !important; } }';
    }
    _onSlotChange() {
      // Self-mutate path already reconciled synchronously and emitted
      // slidechange; skip the async slotchange it caused.
      if (this._squelchSlotChange) {
        this._squelchSlotChange = false;
        return;
      }
      // Primary lock-clear is the host's __deck_rail_ack; this clears on a
      // dropped ack so the rail can't stay dead.
      this._railLock = false;
      this._collectSlides();
      this._restoreIndex();
      this._applyIndex({
        showOverlay: false,
        broadcast: true,
        reason: 'init'
      });
      this._fit();
    }
    _collectSlides() {
      const assigned = this._slot.assignedElements({
        flatten: true
      });
      this._slides = assigned.filter(el => {
        // Skip template/style/script nodes even if someone slots them.
        const tag = el.tagName;
        return tag !== 'TEMPLATE' && tag !== 'SCRIPT' && tag !== 'STYLE';
      });
      this._slideSet = new Set(this._slides);
      this._slides.forEach((slide, i) => {
        const n = i + 1;
        slide.setAttribute('data-screen-label', `${pad2(n)} ${getSlideLabel(slide)}`);

        // Validation attribute for comment flow / auto-checks.
        if (!slide.hasAttribute('data-om-validate')) {
          slide.setAttribute('data-om-validate', VALIDATE_ATTR);
        }
        slide.setAttribute('data-deck-slide', String(i));
      });
      if (this._totalEl) this._totalEl.textContent = String(this._slides.length || 1);
      if (this._index >= this._slides.length) this._index = Math.max(0, this._slides.length - 1);
      this._markLastVisible();
      this._renderRail();
    }

    /** Tag the last non-skipped slide so print CSS can drop its
     *  break-after (see the @media print comment above — :last-child
     *  alone matches a hidden skipped slide). */
    _markLastVisible() {
      let last = null;
      this._slides.forEach(s => {
        s.removeAttribute('data-deck-last-visible');
        if (!s.hasAttribute('data-deck-skip')) last = s;
      });
      if (last) last.setAttribute('data-deck-last-visible', '');
    }
    _loadNotes() {
      // Per-slide data-speaker-notes is authoritative when present (attrs
      // travel with the element on reorder/dup/delete); a slide without
      // the attr falls through to the legacy #speaker-notes JSON array
      // PER SLIDE so a single attr on a JSON-authored deck doesn't blank
      // the rest.
      const tag = document.getElementById('speaker-notes');
      let json = null;
      if (tag) try {
        const p = JSON.parse(tag.textContent || '[]');
        if (Array.isArray(p)) json = p;
      } catch (e) {
        console.warn('[deck-stage] Failed to parse #speaker-notes JSON:', e);
      }
      this._notes = this._slides.map((s, i) => {
        const a = s.getAttribute('data-speaker-notes');
        return a !== null ? a : json && typeof json[i] === 'string' ? json[i] : '';
      });
    }
    _restoreIndex() {
      // The host's ?slide= param is delivered as a #<int> hash (1-indexed) on
      // the iframe src. No hash → slide 1; the deck itself keeps no position
      // state across loads.
      const h = (location.hash || '').match(/^#(\d+)$/);
      if (h) {
        const n = parseInt(h[1], 10) - 1;
        if (n >= 0 && n < this._slides.length) this._index = n;
      }
    }
    _applyIndex({
      showOverlay = true,
      broadcast = true,
      reason = 'init'
    } = {}) {
      if (!this._slides.length) return;
      const prev = this._prevIndex == null ? -1 : this._prevIndex;
      const curr = this._index;
      // Keep the iframe's own hash in sync so an in-iframe location.reload()
      // (reload banner path in viewer-handle.ts) lands on the current slide,
      // not the stale deep-link hash from initial load.
      try {
        history.replaceState(null, '', '#' + (curr + 1));
      } catch (e) {}
      this._slides.forEach((s, i) => {
        if (i === curr) s.setAttribute('data-deck-active', '');else s.removeAttribute('data-deck-active');
      });
      if (this._countEl) this._countEl.textContent = String(curr + 1);
      // Follow-scroll on every navigation (init deep-link, keyboard, click,
      // tap, external goTo) — the only time we *don't* want the rail to
      // track current is after a rail-internal mutation, where _renderRail
      // has already restored the user's scroll position and yanking back to
      // current would undo it.
      this._syncRail(reason !== 'mutation');
      if (broadcast) {
        // (1) Legacy: host-window postMessage for speaker-notes renderers.
        try {
          window.postMessage({
            slideIndexChanged: curr,
            deckTotal: this._slides.length,
            deckSkipped: this._skippedIndices()
          }, '*');
        } catch (e) {}

        // (2) In-page CustomEvent on the <deck-stage> element itself.
        //     Bubbles and composes out of shadow DOM so slide code can listen:
        //       document.querySelector('deck-stage').addEventListener('slidechange', e => {
        //         e.detail.index, e.detail.previousIndex, e.detail.total, e.detail.slide, e.detail.reason
        //       });
        const detail = {
          index: curr,
          previousIndex: prev,
          total: this._slides.length,
          slide: this._slides[curr] || null,
          previousSlide: prev >= 0 ? this._slides[prev] || null : null,
          reason: reason // 'init' | 'keyboard' | 'click' | 'tap' | 'api'
        };
        this.dispatchEvent(new CustomEvent('slidechange', {
          detail,
          bubbles: true,
          composed: true
        }));
      }
      this._prevIndex = curr;
      if (showOverlay) this._flashOverlay();
    }
    _flashOverlay() {
      // Host posts __omelette_presenting while in fullscreen/tab presentation
      // mode — suppress the nav footer entirely (both hover and slide-change
      // flash) so the audience sees clean slides.
      if (!this._overlay || this._presenting) return;
      this._overlay.setAttribute('data-visible', '');
      if (this._hideTimer) clearTimeout(this._hideTimer);
      this._hideTimer = setTimeout(() => {
        this._overlay.removeAttribute('data-visible');
      }, OVERLAY_HIDE_MS);
    }
    _railWidth() {
      // State-based, no offsetWidth: the first _fit() can run before the
      // rail has had layout on some load paths, and a 0 there paints the
      // slide full-width for one frame before the post-slotchange _fit()
      // corrects it.
      if (!this._railEnabled || !this._railVisible || this.hasAttribute('no-rail') || this.hasAttribute('noscale') || this._presenting || this._previewMode || NARROW_MQ.matches) return 0;
      return this._railPx || 0;
    }
    _fit() {
      if (!this._canvas) return;
      const stage = this._canvas.parentElement;
      // PPTX export sets noscale so the DOM capture sees authored-size
      // geometry — the scaled canvas is in shadow DOM, so the exporter's
      // resetTransformSelector can't reach .canvas.style.transform directly.
      if (this.hasAttribute('noscale')) {
        this._canvas.style.transform = 'none';
        if (stage) stage.style.left = '0';
        if (this._overlay) this._overlay.style.marginLeft = '0';
        return;
      }
      const rw = this._railWidth();
      if (stage) stage.style.left = rw + 'px';
      // Overlay is centred on the viewport via left:50% + translate(-50%);
      // marginLeft shifts the centre by rw/2 so it lands in the middle of
      // the [rw, innerWidth] stage region.
      if (this._overlay) this._overlay.style.marginLeft = rw / 2 + 'px';
      const vw = window.innerWidth - rw;
      const vh = window.innerHeight;
      const s = Math.min(vw / this.designWidth, vh / this.designHeight);
      this._canvas.style.transform = `scale(${s})`;
    }
    _onResize() {
      this._fit();
      // Crossing the narrow-viewport breakpoint reveals the rail — rerun the
      // thumbnail scale the same way _setRailWidth does.
      if (!this._scaleRaf) {
        this._scaleRaf = requestAnimationFrame(() => {
          this._scaleRaf = null;
          this._scaleThumbs();
        });
      }
    }
    _onMouseMove() {
      // Keep overlay visible while mouse moves; hide after idle.
      this._flashOverlay();
    }
    _onMessage(e) {
      const d = e.data;
      if (d && typeof d.__omelette_presenting === 'boolean') {
        this._presenting = d.__omelette_presenting;
        if (this._presenting && this._overlay) {
          this._overlay.removeAttribute('data-visible');
          if (this._hideTimer) clearTimeout(this._hideTimer);
        }
        this._syncRailHidden();
        this._closeMenu();
        this._closeConfirm();
        this._fit();
        this._scaleThumbs();
      }
      // Host's Preview segment (ViewerMode='none'): the rail's drag-reorder /
      // right-click skip-delete affordances are editing chrome, so hide it
      // while the user is just looking at the deck. Same hard-hide path as
      // presenting; independent of the user's _railVisible preference so
      // returning to Edit restores whatever they had.
      if (d && typeof d.__omelette_preview_mode === 'boolean') {
        if (d.__omelette_preview_mode === this._previewMode) return;
        this._previewMode = d.__omelette_preview_mode;
        this._syncRailHidden();
        this._closeMenu();
        this._closeConfirm();
        this._fit();
        this._scaleThumbs();
      }
      // Host has processed a dc-op; rail input is safe again. Not tied to
      // slotchange — setAttr and refusal don't fire one. On refusal,
      // revert the optimistic _index/hash adjustment so the next nav
      // starts from what's actually on screen.
      if (d && d.__dc_op_ack) {
        this._railLock = false;
        if (d.applied === false && this._indexBeforeEmit != null) {
          this._index = this._indexBeforeEmit;
          try {
            history.replaceState(null, '', '#' + (this._index + 1));
          } catch (e) {}
        }
        this._indexBeforeEmit = null;
      }
      // Per-viewer show/hide, driven by the TweaksPanel's auto-injected
      // "Thumbnail rail" toggle (or any author script). Independent of
      // whether the Tweaks panel itself is open — closing the panel
      // doesn't change rail visibility. Persists alongside rail width.
      if (d && d.type === '__deck_rail_visible' && typeof d.on === 'boolean') {
        if (d.on === this._railVisible) return;
        this._railVisible = d.on;
        try {
          localStorage.setItem('deck-stage.railVisible', d.on ? '1' : '0');
        } catch (e) {}
        // Arm the transition, commit it, then flip state — otherwise the
        // browser coalesces both writes and nothing animates on show.
        this.setAttribute('data-rail-anim', '');
        void (this._rail && this._rail.offsetHeight);
        this._syncRailHidden();
        this._fit();
        this._scaleThumbs();
        clearTimeout(this._railAnimTimer);
        this._railAnimTimer = setTimeout(() => this.removeAttribute('data-rail-anim'), 220);
      }
      if (d && d.type === '__omelette_rail_enabled') this._enableRail();
    }
    _syncRailHidden() {
      if (!this._rail) return;
      // data-presenting is the hard hide (display:none) for flag-off,
      // presentation mode, and the host's Preview segment — instant, no
      // transition. data-user-hidden is the soft hide (translateX(-100%))
      // for the viewer's rail toggle, so show/hide slides under
      // :host([data-rail-anim]).
      const hard = !this._railEnabled || this._presenting || this._previewMode;
      if (hard) this._rail.setAttribute('data-presenting', '');else this._rail.removeAttribute('data-presenting');
      if (!this._railVisible) this._rail.setAttribute('data-user-hidden', '');else this._rail.removeAttribute('data-user-hidden');
      // translateX hide leaves thumbs (tabIndex=0) in the tab order —
      // inert keeps them unfocusable while the rail is off-screen.
      this._rail.inert = hard || !this._railVisible;
    }
    _onTap(e) {
      // Touch-only — keyboard + the overlay toolbar cover nav on desktop.
      if (FINE_POINTER_MQ.matches) return;
      // Only taps that land on the stage (slide content or letterbox); the
      // overlay / rail / menus are siblings with their own click handlers.
      const path = e.composedPath();
      if (!this._stage || !path.includes(this._stage)) return;
      // Let interactive slide content keep the tap. composedPath (not
      // e.target.closest) so we see through open shadow roots — a <button>
      // inside a slide-authored custom element retargets e.target to the
      // host but still appears in the composed path.
      if (e.defaultPrevented) return;
      for (const n of path) {
        if (n === this._stage) break;
        if (n.matches && n.matches(INTERACTIVE_SEL)) return;
      }
      e.preventDefault();
      const rw = this._railWidth();
      const mid = rw + (window.innerWidth - rw) / 2;
      this._advance(e.clientX < mid ? -1 : 1, 'tap');
    }
    _onKey(e) {
      // Ignore when the user is typing.
      const t = e.target;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      // Confirm dialog swallows nav keys while open; Escape cancels. Enter
      // is left to the focused button's native activation so Tab→Cancel
      // →Enter activates Cancel, not the window-level confirm path.
      if (this._confirm && this._confirm.hasAttribute('data-open')) {
        if (e.key === 'Escape') {
          this._closeConfirm();
          e.preventDefault();
        }
        return;
      }
      if (e.key === 'Escape' && this._menu && this._menu.hasAttribute('data-open')) {
        this._closeMenu();
        e.preventDefault();
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key;
      let handled = true;
      if (key === 'ArrowRight' || key === 'PageDown' || key === ' ' || key === 'Spacebar') {
        this._advance(1, 'keyboard');
      } else if (key === 'ArrowLeft' || key === 'PageUp') {
        this._advance(-1, 'keyboard');
      } else if (key === 'Home') {
        this._go(0, 'keyboard');
      } else if (key === 'End') {
        this._go(this._slides.length - 1, 'keyboard');
      } else if (key === 'r' || key === 'R') {
        this._go(0, 'keyboard');
      } else if (/^[0-9]$/.test(key)) {
        // 1..9 jump to that slide; 0 jumps to 10.
        const n = key === '0' ? 9 : parseInt(key, 10) - 1;
        if (n < this._slides.length) this._go(n, 'keyboard');
      } else {
        handled = false;
      }
      if (handled) {
        e.preventDefault();
        this._flashOverlay();
      }
    }
    _go(i, reason = 'api') {
      if (!this._slides.length) return;
      const clamped = Math.max(0, Math.min(this._slides.length - 1, i));
      if (clamped === this._index) {
        this._flashOverlay();
        return;
      }
      this._index = clamped;
      this._applyIndex({
        showOverlay: true,
        broadcast: true,
        reason
      });
    }

    /** Step forward/back skipping any slide marked data-deck-skip. Falls
     *  back to _go's clamp-at-ends behaviour (flash overlay) when there's
     *  nothing further in that direction. */
    _advance(dir, reason) {
      if (!this._slides.length) return;
      let i = this._index + dir;
      while (i >= 0 && i < this._slides.length && this._slides[i].hasAttribute('data-deck-skip')) {
        i += dir;
      }
      if (i < 0 || i >= this._slides.length) {
        this._flashOverlay();
        return;
      }
      this._go(i, reason);
    }

    // ── Thumbnail rail ────────────────────────────────────────────────────
    //
    // Thumbs are keyed by slide element and reused across _renderRail()
    // calls, so a reorder/delete is an O(changed) DOM shuffle instead of an
    // O(N) teardown-and-re-clone. Each thumb starts as a lightweight shell
    // (num + empty frame); the clone is materialized lazily by an
    // IntersectionObserver when the frame scrolls into (or near) view, so
    // only visible-ish slides pay the clone + image-decode cost.

    _renderRail() {
      if (!this._rail || !this._railEnabled) {
        this._thumbs = [];
        return;
      }
      // FLIP: record each *materialized* thumb's top before the reconcile.
      // Off-screen (non-materialized) thumbs don't need the animation and
      // skipping their getBoundingClientRect saves a forced layout per
      // off-screen thumb on large decks.
      const prevTops = new Map();
      (this._thumbs || []).forEach(({
        thumb,
        slide,
        host
      }) => {
        if (host) prevTops.set(slide, thumb.getBoundingClientRect().top);
      });
      const st = this._rail.scrollTop;

      // Reconcile: reuse thumbs that already exist for a slide, create
      // shells for new slides, drop thumbs for removed slides.
      const bySlide = new Map();
      (this._thumbs || []).forEach(t => bySlide.set(t.slide, t));
      const next = [];
      this._slides.forEach(slide => {
        let t = bySlide.get(slide);
        if (t) bySlide.delete(slide);else t = this._makeThumb(slide);
        next.push(t);
      });
      // Orphans — slides removed since last render.
      bySlide.forEach(t => {
        if (this._railObserver) this._railObserver.unobserve(t.frame);
        t.thumb.remove();
      });
      // Put thumbs into document order to match _slides. insertBefore on
      // an already-correctly-placed node is a no-op, so this is cheap
      // when nothing moved.
      next.forEach((t, i) => {
        const want = t.thumb;
        const at = this._rail.children[i];
        if (at !== want) this._rail.insertBefore(want, at || null);
        t.i = i;
        t.num.textContent = String(i + 1);
        if (t.slide.hasAttribute('data-deck-skip')) t.thumb.setAttribute('data-skip', '');else t.thumb.removeAttribute('data-skip');
      });
      this._thumbs = next;
      this._rail.scrollTop = st;
      if (prevTops.size) {
        const moved = [];
        this._thumbs.forEach(({
          thumb,
          slide
        }) => {
          const old = prevTops.get(slide);
          if (old == null) return;
          const dy = old - thumb.getBoundingClientRect().top;
          if (Math.abs(dy) < 1) return;
          thumb.style.transition = 'none';
          thumb.style.transform = `translateY(${dy}px)`;
          moved.push(thumb);
        });
        if (moved.length) {
          // Commit the inverted positions before flipping the transition
          // on — otherwise the browser coalesces both style writes and
          // nothing animates.
          void this._rail.offsetHeight;
          moved.forEach(t => {
            t.style.transition = 'transform 180ms cubic-bezier(.2,.7,.3,1)';
            t.style.transform = '';
          });
          setTimeout(() => moved.forEach(t => {
            t.style.transition = '';
          }), 220);
        }
      }
      requestAnimationFrame(() => this._scaleThumbs());
      this._syncRail(false);
    }

    /** Create a lightweight thumb shell for one slide. The clone is
     *  materialized later by the IntersectionObserver. Event handlers
     *  look up the thumb's *current* index (via _thumbs.indexOf) so the
     *  same element can be reused across reorders. */
    _makeThumb(slide) {
      const thumb = document.createElement('div');
      thumb.className = 'thumb';
      thumb.tabIndex = 0;
      const num = document.createElement('div');
      num.className = 'num';
      const frame = document.createElement('div');
      frame.className = 'frame';
      thumb.append(num, frame);
      const entry = {
        thumb,
        num,
        frame,
        slide,
        clone: null,
        host: null,
        i: -1
      };
      // entry.i is refreshed on every _renderRail reconcile pass, so
      // handlers read the thumb's current position without an O(N) scan.
      const idx = () => entry.i;
      thumb.addEventListener('click', () => this._go(idx(), 'click'));
      // ↑/↓ step through the rail when a thumb has focus. _go clamps at the
      // ends and _applyIndex→_syncRail scrolls the new current thumb into
      // view; we move focus to it (preventScroll — _syncRail already
      // scrolled) so a held key walks the whole list. stopPropagation keeps
      // this out of the window-level _onKey nav handler.
      thumb.addEventListener('keydown', e => {
        if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        e.preventDefault();
        e.stopPropagation();
        this._go(idx() + (e.key === 'ArrowDown' ? 1 : -1), 'keyboard');
        const cur = this._thumbs && this._thumbs[this._index];
        if (cur) cur.thumb.focus({
          preventScroll: true
        });
      });
      thumb.addEventListener('contextmenu', e => {
        e.preventDefault();
        this._openMenu(idx(), e.clientX, e.clientY);
      });
      thumb.draggable = true;
      thumb.addEventListener('dragstart', e => {
        this._dragFrom = idx();
        thumb.setAttribute('data-dragging', '');
        e.dataTransfer.effectAllowed = 'move';
        try {
          e.dataTransfer.setData('text/plain', String(this._dragFrom));
        } catch (err) {}
      });
      thumb.addEventListener('dragend', () => {
        thumb.removeAttribute('data-dragging');
        this._clearDrop();
        this._dragFrom = null;
      });
      thumb.addEventListener('dragover', e => {
        if (this._dragFrom == null) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const r = thumb.getBoundingClientRect();
        this._setDrop(idx(), e.clientY < r.top + r.height / 2 ? 'before' : 'after');
      });
      thumb.addEventListener('drop', e => {
        if (this._dragFrom == null) return;
        e.preventDefault();
        const i = idx();
        const r = thumb.getBoundingClientRect();
        let to = e.clientY >= r.top + r.height / 2 ? i + 1 : i;
        if (this._dragFrom < to) to--;
        const from = this._dragFrom;
        this._clearDrop();
        this._dragFrom = null;
        if (to !== from) this._moveSlide(from, to);
      });
      if (this._railObserver) this._railObserver.observe(frame);
      frame.__deckThumb = entry;
      return entry;
    }

    /** Lazily build the clone for a thumb that has scrolled into view. */
    _materialize(entry) {
      if (entry.host) return;
      const dw = this.designWidth,
        dh = this.designHeight;
      let clone = entry.slide.cloneNode(true);
      clone.removeAttribute('id');
      clone.removeAttribute('data-deck-active');
      clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
      // Neuter heavy media; replace <video> with its poster so the box
      // keeps a visual. <iframe>/<audio> become empty placeholders.
      clone.querySelectorAll('iframe, audio, object, embed').forEach(el => {
        el.removeAttribute('src');
        el.removeAttribute('srcdoc');
        el.removeAttribute('data');
        el.innerHTML = '';
      });
      clone.querySelectorAll('video').forEach(el => {
        if (!el.poster) {
          el.removeAttribute('src');
          el.innerHTML = '';
          return;
        }
        const img = document.createElement('img');
        img.src = el.poster;
        img.alt = '';
        img.style.cssText = el.style.cssText + ';object-fit:cover;width:100%;height:100%;';
        img.className = el.className;
        el.replaceWith(img);
      });
      // Images: defer decode and let the browser pick the smallest
      // srcset candidate for the ~140px thumb. Same-URL clones reuse the
      // slide's decoded bitmap (URL-keyed cache), so the remaining cost
      // is paint/composite — lazy+async keeps that off the main thread.
      clone.querySelectorAll('img').forEach(el => {
        el.loading = 'lazy';
        el.decoding = 'async';
        if (el.srcset) el.sizes = (this._railPx || 188) + 'px';
      });
      // Custom elements inside the slide would have their
      // connectedCallback fire when the clone is appended. Replace them
      // with inert boxes so a component-heavy deck doesn't run N copies
      // of each component's mount logic in the rail. Children are
      // preserved so layout-wrapper elements (<my-column><h2>…</h2>)
      // still show their authored content; the querySelectorAll NodeList
      // is static, so nested custom elements in the moved subtree are
      // still visited on later iterations.
      const neuter = el => {
        const box = document.createElement('div');
        box.style.cssText = (el.getAttribute('style') || '') + ';background:rgba(0,0,0,0.06);border:1px dashed rgba(0,0,0,0.15);';
        box.className = el.className;
        // Preserve theming/i18n hooks so [data-*] / :lang() / [dir]
        // descendant selectors still match the neutered root.
        for (const a of el.attributes) {
          const n = a.name;
          if (n.startsWith('data-') || n.startsWith('aria-') || n === 'lang' || n === 'dir' || n === 'role' || n === 'title') {
            box.setAttribute(n, a.value);
          }
        }
        while (el.firstChild) box.appendChild(el.firstChild);
        return box;
      };
      // querySelectorAll('*') returns descendants only — a custom-element
      // slide root (<my-slide>…</my-slide>) would slip through and upgrade
      // on append. Swap the root first.
      if (clone.tagName.includes('-')) clone = neuter(clone);
      clone.querySelectorAll('*').forEach(el => {
        if (el.tagName.includes('-')) el.replaceWith(neuter(el));
      });
      clone.style.cssText += ';position:absolute;top:0;left:0;transform-origin:0 0;' + 'pointer-events:none;width:' + dw + 'px;height:' + dh + 'px;' + 'box-sizing:border-box;overflow:hidden;visibility:visible;opacity:1;';
      const host = document.createElement('div');
      host.style.cssText = 'position:absolute;inset:0;';
      this._syncThumbHostAttrs(host);
      const sr = host.attachShadow({
        mode: 'open'
      });
      if (this._adoptedSheet) sr.adoptedStyleSheets = [this._adoptedSheet];else {
        const st = document.createElement('style');
        st.textContent = this._authorCss || '';
        sr.appendChild(st);
      }
      sr.appendChild(clone);
      entry.frame.appendChild(host);
      entry.host = host;
      entry.clone = clone;
      if (this._thumbScale) clone.style.transform = 'scale(' + this._thumbScale + ')';
      // Once materialized the IO callback is a no-op early-return —
      // unobserve so scroll doesn't keep firing it.
      if (this._railObserver) this._railObserver.unobserve(entry.frame);
    }

    /** Re-clone a single thumb (live-update path). No-op if the thumb
     *  hasn't been materialized yet — it'll pick up current content when
     *  it scrolls into view. */
    _refreshThumb(slide) {
      const entry = (this._thumbs || []).find(t => t.slide === slide);
      if (!entry || !entry.host) return;
      entry.host.remove();
      entry.host = entry.clone = null;
      this._materialize(entry);
    }
    _scaleThumbs() {
      if (!this._thumbs || !this._thumbs.length) return;
      // Every frame is the same width; if it reads 0 the rail is
      // display:none (noscale / no-rail / presenting / print) — leave the
      // clones as-is and re-run when the rail is revealed.
      const fw = this._thumbs[0].frame.offsetWidth;
      if (!fw) return;
      this._thumbScale = fw / this.designWidth;
      this._thumbs.forEach(({
        clone
      }) => {
        if (clone) clone.style.transform = 'scale(' + this._thumbScale + ')';
      });
    }
    _setDrop(i, where) {
      // dragover fires at pointer-event rate; touch only the previous
      // and new target rather than sweeping all N thumbs.
      const t = this._thumbs && this._thumbs[i];
      if (this._dropOn && this._dropOn !== t) {
        this._dropOn.thumb.removeAttribute('data-drop');
      }
      if (t) t.thumb.setAttribute('data-drop', where);
      this._dropOn = t || null;
    }
    _clearDrop() {
      if (this._dropOn) this._dropOn.thumb.removeAttribute('data-drop');
      this._dropOn = null;
    }
    _syncRail(follow) {
      if (!this._thumbs) return;
      this._thumbs.forEach(({
        thumb
      }, i) => {
        if (i === this._index) {
          thumb.setAttribute('data-current', '');
          if (follow && typeof thumb.scrollIntoView === 'function') {
            thumb.scrollIntoView({
              block: 'nearest'
            });
          }
        } else {
          thumb.removeAttribute('data-current');
        }
      });
    }
    _openMenu(i, x, y) {
      if (!this._menu) return;
      this._menuIndex = i;
      const slide = this._slides[i];
      const skip = slide && slide.hasAttribute('data-deck-skip');
      this._menu.querySelector('[data-act="skip"]').textContent = skip ? 'Unskip slide' : 'Skip slide';
      this._menu.querySelector('[data-act="up"]').disabled = i <= 0;
      this._menu.querySelector('[data-act="down"]').disabled = i >= this._slides.length - 1;
      this._menu.querySelector('[data-act="delete"]').disabled = this._slides.length <= 1;
      // Place, then clamp to viewport after it's measurable.
      this._menu.style.left = x + 'px';
      this._menu.style.top = y + 'px';
      this._menu.setAttribute('data-open', '');
      const r = this._menu.getBoundingClientRect();
      const nx = Math.min(x, window.innerWidth - r.width - 4);
      const ny = Math.min(y, window.innerHeight - r.height - 4);
      this._menu.style.left = Math.max(4, nx) + 'px';
      this._menu.style.top = Math.max(4, ny) + 'px';
    }
    _closeMenu() {
      if (this._menu) this._menu.removeAttribute('data-open');
      this._menuIndex = -1;
    }
    _openConfirm(i) {
      if (!this._confirm) return;
      this._confirmIndex = i;
      this._confirm.querySelector('.title').textContent = 'Delete slide ' + (i + 1) + '?';
      this._confirm.setAttribute('data-open', '');
      const btn = this._confirm.querySelector('.danger');
      if (btn && btn.focus) btn.focus();
    }
    _closeConfirm() {
      if (this._confirm) this._confirm.removeAttribute('data-open');
      this._confirmIndex = -1;
    }

    /** Rail mutations. When a dc-runtime is present (`window.__dcUpdate`)
     *  the host owns the light DOM — handlers emit a dc-op only and the
     *  host applies it (to the editor's model or to the source file) and
     *  re-renders via dc-runtime; slotchange catches the rail up.
     *  Structural ops lock rail input until the host acks so a rapid second
     *  click can't address a stale index; setAttr/removeAttr respect the
     *  lock but don't set it (indices unchanged; the host serializes).
     *  `newIndex` is written to location.hash so slotchange's
     *  _restoreIndex lands on the right slide.
     *
     *  With NO dc-runtime (a raw .html deck), there's no re-render path,
     *  so handlers self-mutate locally for an instant update and emit
     *  `emitOnly: false`; the host persists to disk without
     *  re-rendering over the already-mutated DOM.
     *
     *  See docs/dc-ops.md for the contract. */
    _emitDcOp(op, slide, lock, newIndex) {
      // Slide index (template/script/style filtered — same as
      // _collectSlides). deck-stage is a filtered-index dc-op emitter;
      // the host resolves against findDeckStage().slideTids. Callers
      // already pass `to` as a slide index.
      op.at = this._slides.indexOf(slide);
      op.witness = {
        childCount: this._slides.length
      };
      // dc-runtime wraps an <x-import>-mounted component in a
      // <div class="sc-host-x" data-dc-tpl="N"> host — the stamp is on the
      // WRAPPER, not this element. closest() finds it (or this element's
      // own stamp when directly templated).
      const host = this.closest('[data-dc-tpl]');
      const tid = host && host.getAttribute('data-dc-tpl');
      op.mount = {
        tid: tid !== null ? parseInt(tid, 10) : null,
        tag: 'deck-stage'
      };
      op.emitOnly = !!window.__dcUpdate;
      if (op.emitOnly) {
        if (lock) this._railLock = true;
        if (newIndex != null && newIndex !== this._index) {
          this._indexBeforeEmit = this._index;
          this._index = newIndex;
          try {
            history.replaceState(null, '', '#' + (newIndex + 1));
          } catch (e) {}
        }
      }
      this.dispatchEvent(new CustomEvent('dc-op', {
        detail: op,
        bubbles: true,
        composed: true
      }));
      return op.emitOnly;
    }
    _deleteSlide(i) {
      if (this._railLock) return;
      const slide = this._slides[i];
      if (!slide || this._slides.length <= 1) return;
      const cur = this._index;
      const ni = i < cur || i === cur && i === this._slides.length - 1 ? cur - 1 : cur;
      if (this._emitDcOp({
        op: 'remove'
      }, slide, true, ni)) return;
      this._index = ni;
      this._squelchSlotChange = true;
      slide.remove();
      this._collectSlides();
      this._applyIndex({
        showOverlay: true,
        broadcast: true,
        reason: 'mutation'
      });
    }
    _duplicateSlide(i) {
      if (this._railLock) return;
      const slide = this._slides[i];
      if (!slide) return;
      if (this._emitDcOp({
        op: 'duplicate'
      }, slide, true, i + 1)) return;
      const copy = slide.cloneNode(true);
      copy.removeAttribute('id');
      copy.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
      this._index = i + 1;
      this._squelchSlotChange = true;
      this.insertBefore(copy, slide.nextSibling);
      this._collectSlides();
      this._applyIndex({
        showOverlay: true,
        broadcast: true,
        reason: 'mutation'
      });
    }
    _toggleSkip(i) {
      if (this._railLock) return;
      const slide = this._slides[i];
      if (!slide) return;
      const on = !slide.hasAttribute('data-deck-skip');
      if (this._emitDcOp(on ? {
        op: 'setAttr',
        attr: 'data-deck-skip',
        value: ''
      } : {
        op: 'removeAttr',
        attr: 'data-deck-skip'
      }, slide, false)) return;
      if (on) slide.setAttribute('data-deck-skip', '');else slide.removeAttribute('data-deck-skip');
    }
    _skippedIndices() {
      const out = [];
      for (let i = 0; i < this._slides.length; i++) {
        if (this._slides[i].hasAttribute('data-deck-skip')) out.push(i);
      }
      return out;
    }
    _moveSlide(i, j) {
      if (this._railLock || j < 0 || j >= this._slides.length || j === i) return;
      const cur = this._index;
      const ni = cur === i ? j : i < cur && j >= cur ? cur - 1 : i > cur && j <= cur ? cur + 1 : cur;
      const slide = this._slides[i];
      if (this._emitDcOp({
        op: 'move',
        to: j
      }, slide, true, ni)) return;
      const ref = j < i ? this._slides[j] : this._slides[j].nextSibling;
      this._index = ni;
      this._squelchSlotChange = true;
      this.insertBefore(slide, ref);
      this._collectSlides();
      this._applyIndex({
        showOverlay: false,
        broadcast: true,
        reason: 'mutation'
      });
    }

    // Public API ------------------------------------------------------------

    /** Current slide index (0-based). */
    get index() {
      return this._index;
    }
    /** Total slide count. */
    get length() {
      return this._slides.length;
    }
    /** Programmatically navigate. */
    goTo(i) {
      this._go(i, 'api');
    }
    next() {
      this._advance(1, 'api');
    }
    prev() {
      this._advance(-1, 'api');
    }
    reset() {
      this._go(0, 'api');
    }
  }
  if (!customElements.get('deck-stage')) {
    customElements.define('deck-stage', DeckStage);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "deck-stage.js", error: String((e && e.message) || e) }); }

// screens.jsx
try { (() => {
/* More Muslim — keynote slide templates (1280×720).
   Browser-babel; composes window.MoreMuslimDesignSystem_019df4; assigns window.MMSlides.
   Based on the real deck "Imagining New Muslim Narratives in Media" (Dr. Sohaira
   Siddiqui, Georgetown University in Qatar) + the partner-overview content. */
(function () {
  const DS = window.MoreMuslimDesignSystem_019df4 || {};
  const {
    PatternPanel,
    Symbol,
    EyebrowLabel,
    PullQuote
  } = DS;
  const LOGO = "../../assets/logos/";
  const W = 1280,
    H = 720;
  const GROUND = {
    black: {
      bg: "#000000",
      tile: null,
      text: "#F6E1C7",
      sub: "rgba(246,225,199,0.6)",
      accent: "#F6E1C7",
      logo: "beige"
    },
    night: {
      bg: "#192136",
      tile: "5C",
      text: "#F6E1C7",
      sub: "rgba(246,225,199,0.62)",
      accent: "#F6E1C7",
      logo: "beige"
    },
    oak: {
      bg: "#511C13",
      tile: "6B",
      text: "#F6E1C7",
      sub: "rgba(246,225,199,0.66)",
      accent: "#F6E1C7",
      logo: "beige"
    },
    beige: {
      bg: "#FBF1E4",
      tile: "6A",
      text: "#511C13",
      sub: "rgba(81,28,19,0.6)",
      accent: "#511C13",
      logo: "oak"
    }
  };
  function Frame({
    g = "night",
    pattern = true,
    pad = 96,
    children,
    style
  }) {
    const c = GROUND[g];
    const body = /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        inset: 0,
        padding: pad,
        display: "flex",
        flexDirection: "column",
        color: c.text,
        boxSizing: "border-box",
        ...style,
        opacity: "0.1"
      }
    }, children);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: W,
        height: H,
        position: "relative",
        overflow: "hidden",
        background: c.bg,
        fontFamily: "var(--font-serif)"
      }
    }, pattern && PatternPanel ? /*#__PURE__*/React.createElement(PatternPanel, {
      tile: c.tile,
      color: c.bg,
      grainOpacity: 0.07,
      radius: "0",
      style: {
        position: "absolute",
        inset: 0
      }
    }, body) : body);
  }
  const eyebrow = (c, t) => /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-caps)",
      color: c.accent
    }
  }, t);

  // 1 — TITLE (the real keynote cover)
  function TitleSlide({
    g = "black"
  } = {}) {
    const c = GROUND[g];
    return /*#__PURE__*/React.createElement(Frame, {
      g: g,
      pattern: g !== "black"
    }, /*#__PURE__*/React.createElement("img", {
      src: LOGO + `logo-horizontal-${c.logo}.svg`,
      alt: "More Muslim",
      style: {
        height: 30
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: "auto"
      }
    }, /*#__PURE__*/React.createElement("h1", {
      style: {
        margin: 0,
        fontWeight: 400,
        fontSize: 78,
        lineHeight: 1.04,
        textWrap: "balance",
        maxWidth: "16ch"
      }
    }, "Imagining New Muslim Narratives in Media"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 40,
        fontSize: 24,
        color: c.sub
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        color: c.text,
        letterSpacing: "0.04em"
      }
    }, "Dr. Sohaira Siddiqui"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontStyle: "italic",
        marginTop: 4
      }
    }, "Georgetown University in Qatar"))));
  }

  // 2 — SECTION divider
  function SectionSlide({
    g = "oak",
    n = "01",
    title = "Overview"
  } = {}) {
    const c = GROUND[g];
    return /*#__PURE__*/React.createElement(Frame, {
      g: g
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: "auto"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 28,
        letterSpacing: "0.2em",
        color: c.accent
      }
    }, n), /*#__PURE__*/React.createElement("h2", {
      style: {
        margin: "20px 0 0",
        fontWeight: 400,
        fontSize: 92,
        lineHeight: 1.0,
        textTransform: "uppercase",
        letterSpacing: "var(--tracking-caps)"
      }
    }, title)), /*#__PURE__*/React.createElement(Symbol, {
      size: 56,
      style: {
        color: c.accent,
        marginTop: "auto"
      }
    }));
  }

  // 3 — STATEMENT / overview text
  function StatementSlide({
    g = "night",
    eyebrow: eb = "Qatar's first narrative podcast",
    lead = "",
    body = ""
  } = {}) {
    const c = GROUND[g];
    return /*#__PURE__*/React.createElement(Frame, {
      g: g
    }, eyebrow(c, eb), /*#__PURE__*/React.createElement("h2", {
      style: {
        margin: "28px 0 0",
        fontWeight: 400,
        fontSize: 52,
        lineHeight: 1.12,
        maxWidth: "20ch",
        textWrap: "balance"
      }
    }, lead), body && /*#__PURE__*/React.createElement("p", {
      style: {
        margin: "28px 0 0",
        fontSize: 26,
        lineHeight: 1.5,
        color: c.sub,
        maxWidth: "46ch",
        textWrap: "pretty"
      }
    }, body));
  }

  // 4 — STATS
  function StatsSlide({
    g = "night",
    eyebrow: eb = "Audience",
    stats = []
  } = {}) {
    const c = GROUND[g];
    return /*#__PURE__*/React.createElement(Frame, {
      g: g
    }, eyebrow(c, eb), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: "auto",
        marginBottom: "auto",
        display: "grid",
        gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
        gap: 48
      }
    }, stats.map((s, i) => /*#__PURE__*/React.createElement("div", {
      key: i
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 88,
        lineHeight: 1,
        color: c.accent
      }
    }, s.n), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 18,
        fontSize: 22,
        lineHeight: 1.4,
        color: c.sub,
        textTransform: "uppercase",
        letterSpacing: "var(--tracking-caps)"
      }
    }, s.l)))));
  }

  // 5 — QUOTE
  function QuoteSlide({
    g = "oak",
    text = "",
    cite = ""
  } = {}) {
    const c = GROUND[g];
    return /*#__PURE__*/React.createElement(Frame, {
      g: g
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        margin: "auto 0",
        display: "flex",
        flexDirection: "column",
        gap: 36
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontStyle: "italic",
        fontSize: 54,
        lineHeight: 1.22,
        maxWidth: "22ch"
      }
    }, `\u201C${text}\u201D`), cite && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 22,
        textTransform: "uppercase",
        letterSpacing: "var(--tracking-caps)",
        color: c.accent
      }
    }, "\u2014 ", cite)));
  }

  // 6 — EPISODE LIST
  function ListSlide({
    g = "beige",
    eyebrow: eb = "Season One",
    items = []
  } = {}) {
    const c = GROUND[g];
    return /*#__PURE__*/React.createElement(Frame, {
      g: g,
      pad: 88
    }, eyebrow(c, eb), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 36,
        display: "flex",
        flexDirection: "column"
      }
    }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: "flex",
        alignItems: "baseline",
        gap: 28,
        padding: "16px 0",
        borderTop: `1px solid ${GROUND[g].line.replace(/[\d.]+\)$/, "0.25)")}`
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 20,
        letterSpacing: "0.14em",
        color: c.accent,
        width: 64,
        flex: "none"
      }
    }, it.n), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 30,
        flex: 1
      }
    }, it.title), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 18,
        color: c.sub,
        textTransform: "uppercase",
        letterSpacing: "var(--tracking-caps)"
      }
    }, it.dur)))));
  }

  // 7 — CLOSING
  function ClosingSlide({
    g = "night"
  } = {}) {
    const c = GROUND[g];
    return /*#__PURE__*/React.createElement(Frame, {
      g: g
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        margin: "auto",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 36
      }
    }, /*#__PURE__*/React.createElement(Symbol, {
      size: 72,
      style: {
        color: c.accent
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 56,
        textTransform: "uppercase",
        letterSpacing: "var(--tracking-caps)"
      }
    }, "Thank you"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 22,
        letterSpacing: "var(--tracking-caps)",
        textTransform: "uppercase",
        color: c.sub
      }
    }, "moremuslim.org")));
  }

  // Ordered sample deck
  const DECK = [() => /*#__PURE__*/React.createElement(TitleSlide, {
    g: "black"
  }), () => /*#__PURE__*/React.createElement(SectionSlide, {
    g: "oak",
    n: "01",
    title: "Overview"
  }), () => /*#__PURE__*/React.createElement(StatementSlide, {
    g: "night",
    eyebrow: "Qatar's first narrative podcast",
    lead: "A narrative audio documentary series that explores the Muslim experience, with all its messiness.",
    body: "The first narrative podcast produced in Qatar \u2014 a production of the Al-Mujadilah Center and Mosque for Women. Nine documentaries told through the lived experiences of Muslim women."
  }), () => /*#__PURE__*/React.createElement(StatsSlide, {
    g: "night",
    eyebrow: "Audience \xB7 first three months",
    stats: [{
      n: "40k+",
      l: "downloads"
    }, {
      n: "143",
      l: "countries"
    }, {
      n: "7×",
      l: "launch-to-peak growth"
    }]
  }), () => /*#__PURE__*/React.createElement(QuoteSlide, {
    g: "oak",
    text: "It calls her habibti. Gives her Islamic relationship advice.",
    cite: "In Therapy, With SheikhaGPT"
  }), () => /*#__PURE__*/React.createElement(ListSlide, {
    g: "beige",
    eyebrow: "Season One \xB7 selected episodes",
    items: [{
      n: "E1",
      title: "Side Entrances",
      dur: "44 min"
    }, {
      n: "E3",
      title: "The Secret Translators",
      dur: "44 min"
    }, {
      n: "E6",
      title: "Cape Malay",
      dur: "42 min"
    }, {
      n: "E7",
      title: "In Therapy, With SheikhaGPT",
      dur: "42 min"
    }, {
      n: "E9",
      title: "A More Muslim Japan",
      dur: "26 min"
    }]
  }), () => /*#__PURE__*/React.createElement(ClosingSlide, {
    g: "night"
  })];
  window.MMSlides = {
    TitleSlide,
    SectionSlide,
    StatementSlide,
    StatsSlide,
    QuoteSlide,
    ListSlide,
    ClosingSlide,
    DECK,
    W,
    H
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "screens.jsx", error: String((e && e.message) || e) }); }

// tweaks-panel.jsx
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)

/* BEGIN USAGE */
// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
// Exports (to window): useTweaks, TweaksPanel, TweakSection, TweakRow, TweakSlider,
//   TweakToggle, TweakRadio, TweakSelect, TweakText, TweakNumber, TweakColor, TweakButton.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "palette": ["#D97757", "#29261b", "#f6f4ef"],
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        options={['#D97757', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakColor  label="Palette" value={t.palette}
//                        options={[['#D97757', '#29261b', '#f6f4ef'],
//                                  ['#475569', '#0f172a', '#f1f5f9']]}
//                        onChange={(v) => setTweak('palette', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// TweakRadio is the segmented control for 2–3 short options (auto-falls-back to
// TweakSelect past ~16/~10 chars per label); reach for TweakSelect directly when
// options are many or long. For color tweaks always curate 3-4 options rather than
// a free picker; an option can also be a whole 2–5 color palette (the stored value
// is the array). The Tweak* controls are a floor, not a ceiling — build custom
// controls inside the panel if a tweak calls for UI they don't cover.
/* END USAGE */
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;box-sizing:border-box;min-width:0;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null ? keyOrEdits : {
      [keyOrEdits]: val
    };
    setValues(prev => ({
      ...prev,
      ...edits
    }));
    window.parent.postMessage({
      type: '__edit_mode_set_keys',
      edits
    }, '*');
    // Same-window signal so in-page listeners (deck-stage rail thumbnails)
    // can react — the parent message only reaches the host, not peers.
    window.dispatchEvent(new CustomEvent('tweakchange', {
      detail: edits
    }));
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({
  title = 'Tweaks',
  children
}) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({
    x: 16,
    y: 16
  });
  const PAD = 16;
  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth,
      h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y))
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);
  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);
  React.useEffect(() => {
    const onMsg = e => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({
      type: '__edit_mode_available'
    }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({
      type: '__edit_mode_dismissed'
    }, '*');
  };
  const onDragStart = e => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX,
      sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = ev => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, __TWEAKS_STYLE), /*#__PURE__*/React.createElement("div", {
    ref: dragRef,
    className: "twk-panel",
    "data-omelette-chrome": "",
    style: {
      right: offsetRef.current.x,
      bottom: offsetRef.current.y
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-hd",
    onMouseDown: onDragStart
  }, /*#__PURE__*/React.createElement("b", null, title), /*#__PURE__*/React.createElement("button", {
    className: "twk-x",
    "aria-label": "Close tweaks",
    onMouseDown: e => e.stopPropagation(),
    onClick: dismiss
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "twk-body"
  }, children)));
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "twk-sect"
  }, label), children);
}
function TweakRow({
  label,
  value,
  children,
  inline = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: inline ? 'twk-row twk-row-h' : 'twk-row'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label), value != null && /*#__PURE__*/React.createElement("span", {
    className: "twk-val"
  }, value)), children);
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label,
    value: `${value}${unit}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "twk-slider",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => onChange(Number(e.target.value))
  }));
}
function TweakToggle({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "twk-toggle",
    "data-on": value ? '1' : '0',
    role: "switch",
    "aria-checked": !!value,
    onClick: () => onChange(!value)
  }, /*#__PURE__*/React.createElement("i", null)));
}
function TweakRadio({
  label,
  value,
  options,
  onChange
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Segments wrap mid-word once per-segment width runs out. The track is
  // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px
  // to its own padding, and 11.5px system-ui averages ~6.3px/char — so 2
  // options fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall
  // back to a dropdown rather than wrap.
  const labelLen = o => String(typeof o === 'object' ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({
    2: 16,
    3: 10
  }[options.length] ?? 0);
  if (!fitsAsSegments) {
    // <select> emits strings — map back to the original option value so the
    // fallback stays type-preserving (numbers, booleans) like the segment path.
    const resolve = s => {
      const m = options.find(o => String(typeof o === 'object' ? o.value : o) === s);
      return m === undefined ? s : typeof m === 'object' ? m.value : m;
    };
    return /*#__PURE__*/React.createElement(TweakSelect, {
      label: label,
      value: value,
      options: options,
      onChange: s => onChange(resolve(s))
    });
  }
  const opts = options.map(o => typeof o === 'object' ? o : {
    value: o,
    label: o
  });
  const idx = Math.max(0, opts.findIndex(o => o.value === value));
  const n = opts.length;
  const segAt = clientX => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor((clientX - r.left - 2) / inner * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };
  const onPointerDown = e => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = ev => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    role: "radiogroup",
    onPointerDown: onPointerDown,
    className: dragging ? 'twk-seg dragging' : 'twk-seg'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-seg-thumb",
    style: {
      left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
      width: `calc((100% - 4px) / ${n})`
    }
  }), opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    type: "button",
    role: "radio",
    "aria-checked": o.value === value
  }, o.label))));
}
function TweakSelect({
  label,
  value,
  options,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("select", {
    className: "twk-field",
    value: value,
    onChange: e => onChange(e.target.value)
  }, options.map(o => {
    const v = typeof o === 'object' ? o.value : o;
    const l = typeof o === 'object' ? o.label : o;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })));
}
function TweakText({
  label,
  value,
  placeholder,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("input", {
    className: "twk-field",
    type: "text",
    value: value,
    placeholder: placeholder,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakNumber({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}) {
  const clamp = n => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({
    x: 0,
    val: 0
  });
  const onScrubStart = e => {
    e.preventDefault();
    startRef.current = {
      x: e.clientX,
      val: value
    };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = ev => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "twk-num-lbl",
    onPointerDown: onScrubStart
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value,
    min: min,
    max: max,
    step: step,
    onChange: e => onChange(clamp(Number(e.target.value)))
  }), unit && /*#__PURE__*/React.createElement("span", {
    className: "twk-num-unit"
  }, unit));
}

// Relative-luminance contrast pick — checkmarks drawn over a swatch need to
// read on both #111 and #fafafa without per-option configuration. Hex input
// only (#rgb / #rrggbb); named or rgb()/hsl() colors fall through to "light".
function __twkIsLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, c => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = n >> 16 & 255,
    g = n >> 8 & 255,
    b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}
const __TwkCheck = ({
  light
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 14 14",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M3 7.2 5.8 10 11 4.2",
  fill: "none",
  strokeWidth: "2.2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  stroke: light ? 'rgba(0,0,0,.78)' : '#fff'
}));

// TweakColor — curated color/palette picker. Each option is either a single
// hex string or an array of 1-5 hex strings; the card adapts — a lone color
// renders solid, a palette renders colors[0] as the hero (left ~2/3) with the
// rest stacked in a sharp column on the right. onChange emits the
// option in the shape it was passed (string stays string, array stays array).
// Without options it falls back to the native color input for back-compat.
function TweakColor({
  label,
  value,
  options,
  onChange
}) {
  if (!options || !options.length) {
    return /*#__PURE__*/React.createElement("div", {
      className: "twk-row twk-row-h"
    }, /*#__PURE__*/React.createElement("div", {
      className: "twk-lbl"
    }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("input", {
      type: "color",
      className: "twk-swatch",
      value: value,
      onChange: e => onChange(e.target.value)
    }));
  }
  // Native <input type=color> emits lowercase hex per the HTML spec, so
  // compare case-insensitively. String() guards JSON.stringify(undefined),
  // which returns the primitive undefined (no .toLowerCase).
  const key = o => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-chips",
    role: "radiogroup"
  }, options.map((o, i) => {
    const colors = Array.isArray(o) ? o : [o];
    const [hero, ...rest] = colors;
    const sup = rest.slice(0, 4);
    const on = key(o) === cur;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      className: "twk-chip",
      role: "radio",
      "aria-checked": on,
      "data-on": on ? '1' : '0',
      "aria-label": colors.join(', '),
      title: colors.join(' · '),
      style: {
        background: hero
      },
      onClick: () => onChange(o)
    }, sup.length > 0 && /*#__PURE__*/React.createElement("span", null, sup.map((c, j) => /*#__PURE__*/React.createElement("i", {
      key: j,
      style: {
        background: c
      }
    }))), on && /*#__PURE__*/React.createElement(__TwkCheck, {
      light: __twkIsLight(hero)
    }));
  })));
}
function TweakButton({
  label,
  onClick,
  secondary = false
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: secondary ? 'twk-btn secondary' : 'twk-btn',
    onClick: onClick
  }, label);
}
Object.assign(window, {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRow,
  TweakSlider,
  TweakToggle,
  TweakRadio,
  TweakSelect,
  TweakText,
  TweakNumber,
  TweakColor,
  TweakButton
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "tweaks-panel.jsx", error: String((e && e.message) || e) }); }

// ui_kits/slides/screens.jsx
try { (() => {
/* More Muslim — keynote slide templates (1280×720).
   Browser-babel; composes window.MoreMuslimDesignSystem_019df4; assigns window.MMSlides.
   Type scale sourced from moremuslim.org main CSS:
     — All-caps labels: font-size 0.75rem, letter-spacing 1.5px, line-height 1.2
     — Titles: letter-spacing 2.7–3.14px, line-height 1.059–1.0, text-transform uppercase
     — Body: line-height 1.125–1.176, letter-spacing 0.2–0.21px
   Scaled proportionally for 1280×720 format. */
(function () {
  const DS = window.MoreMuslimDesignSystem_019df4 || {};
  const {
    PatternPanel,
    Symbol
  } = DS;
  const LOGO = "../../assets/logos/";
  const IMG = "../../assets/imagery/";
  const W = 1280,
    H = 720;
  const GROUND = {
    black: {
      bg: "#000000",
      tile: null,
      text: "#F6E1C6",
      accent: "#F6E1C6",
      logo: "beige"
    },
    night: {
      bg: "#192136",
      tile: "5C",
      text: "#F6E1C6",
      accent: "#F6E1C6",
      logo: "beige"
    },
    oak: {
      bg: "#511C14",
      tile: "6B",
      text: "#F6E1C6",
      accent: "#F6E1C6",
      logo: "beige"
    },
    beige: {
      bg: "#FBF2E9",
      tile: "6A",
      text: "#511C14",
      accent: "#511C14",
      logo: "oak"
    }
  };

  /* Shared text styles — scaled for 1280×720 from moremuslim.org CSS */
  const T = {
    label: {
      fontSize: 20,
      letterSpacing: "0.165em",
      textTransform: "uppercase",
      lineHeight: 1.2
    },
    title: {
      fontSize: 56,
      letterSpacing: "0.165em",
      textTransform: "uppercase",
      lineHeight: 1.0,
      fontWeight: 400,
      margin: 0
    },
    lead: {
      fontSize: 52,
      lineHeight: 1.125,
      letterSpacing: "0.02em",
      fontWeight: 400,
      margin: 0
    },
    body: {
      fontSize: 26,
      lineHeight: 1.176,
      letterSpacing: "0.2px"
    },
    stat: {
      fontSize: 88,
      lineHeight: 1,
      letterSpacing: "-0.01em"
    },
    statLbl: {
      fontSize: 22,
      letterSpacing: "0.165em",
      textTransform: "uppercase",
      lineHeight: 1.2
    },
    quote: {
      fontSize: 52,
      lineHeight: 1.14,
      letterSpacing: "0.01em",
      fontStyle: "italic"
    },
    cite: {
      fontSize: 22,
      letterSpacing: "0.165em",
      textTransform: "uppercase",
      lineHeight: 1.2
    },
    list: {
      fontSize: 30,
      lineHeight: 1.125,
      letterSpacing: "0.01em"
    },
    listN: {
      fontSize: 20,
      letterSpacing: "0.14em",
      lineHeight: 1.2
    },
    listDur: {
      fontSize: 18,
      letterSpacing: "0.165em",
      textTransform: "uppercase",
      lineHeight: 1.2
    }
  };
  function Frame({
    g = "night",
    pattern = true,
    pad = 96,
    patternOpacity = 0.2,
    children,
    style
  }) {
    const c = GROUND[g];
    const body = /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        inset: 0,
        padding: pad,
        display: "flex",
        flexDirection: "column",
        color: c.text,
        boxSizing: "border-box",
        fontFamily: "var(--font-serif)",
        ...style
      }
    }, children);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: W,
        height: H,
        position: "relative",
        overflow: "hidden",
        background: c.bg
      }
    }, pattern && PatternPanel ? /*#__PURE__*/React.createElement(PatternPanel, {
      tile: c.tile,
      color: c.bg,
      grainOpacity: 0.07,
      tileOpacity: patternOpacity,
      radius: "0",
      style: {
        position: "absolute",
        inset: 0
      }
    }, body) : body);
  }

  // 1 — TITLE
  function TitleSlide({
    g = "black",
    patternOpacity = 0.2
  } = {}) {
    const c = GROUND[g];
    return /*#__PURE__*/React.createElement(Frame, {
      g: g,
      pattern: g !== "black",
      patternOpacity: patternOpacity
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginLeft: "auto"
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: LOGO + `logo-horizontal-${c.logo}.svg`,
      alt: "More Muslim",
      style: {
        height: 56
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: "auto"
      }
    }, /*#__PURE__*/React.createElement("h1", {
      style: {
        ...T.lead,
        fontSize: 78,
        lineHeight: 1.04,
        textWrap: "balance",
        maxWidth: "22ch"
      }
    }, "Imagining New Muslim Narratives in Media"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 40,
        ...T.body,
        fontSize: 24
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        letterSpacing: "0.04em"
      }
    }, "Dr. Sohaira Siddiqui"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontStyle: "italic",
        marginTop: 4
      }
    }, "Georgetown University in Qatar"))));
  }

  // 2 — SECTION
  function SectionSlide({
    g = "oak",
    n = "01",
    title = "Overview",
    patternOpacity = 0.2
  } = {}) {
    const c = GROUND[g];
    return /*#__PURE__*/React.createElement(Frame, {
      g: g,
      patternOpacity: patternOpacity
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 44
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...T.label,
        fontSize: 28,
        letterSpacing: "0.2em"
      }
    }, n), /*#__PURE__*/React.createElement("h2", {
      style: {
        ...T.title,
        fontSize: 92,
        marginTop: 20
      }
    }, title)), /*#__PURE__*/React.createElement(Symbol, {
      size: 56,
      style: {
        color: c.accent
      }
    }));
  }

  // 3 — STATEMENT
  function StatementSlide({
    g = "night",
    eyebrow: eb = "More Muslim",
    lead = "",
    body = "",
    patternOpacity = 0.2
  } = {}) {
    const c = GROUND[g];
    return /*#__PURE__*/React.createElement(Frame, {
      g: g,
      patternOpacity: patternOpacity
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...T.label,
        color: c.accent
      }
    }, eb), /*#__PURE__*/React.createElement("h2", {
      style: {
        ...T.lead,
        lineHeight: 1.04,
        marginTop: 28,
        maxWidth: "22ch",
        textWrap: "balance"
      }
    }, lead), body && /*#__PURE__*/React.createElement("p", {
      style: {
        ...T.body,
        lineHeight: 1.125,
        margin: "28px 0 0",
        maxWidth: "52ch",
        textWrap: "pretty"
      }
    }, body));
  }

  // 4 — STATS
  function StatsSlide({
    g = "night",
    eyebrow: eb = "Audience",
    stats = [],
    patternOpacity = 0.2
  } = {}) {
    const c = GROUND[g];
    return /*#__PURE__*/React.createElement(Frame, {
      g: g,
      patternOpacity: patternOpacity
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...T.label,
        color: c.accent
      }
    }, eb), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: "auto",
        marginBottom: "auto",
        display: "grid",
        gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
        gap: 48
      }
    }, stats.map((s, i) => /*#__PURE__*/React.createElement("div", {
      key: i
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...T.stat,
        color: c.accent
      }
    }, s.n), /*#__PURE__*/React.createElement("div", {
      style: {
        ...T.statLbl,
        marginTop: 18
      }
    }, s.l)))));
  }

  // 5 — QUOTE
  function QuoteSlide({
    g = "oak",
    text = "",
    cite = "",
    patternOpacity = 0.2
  } = {}) {
    const c = GROUND[g];
    return /*#__PURE__*/React.createElement(Frame, {
      g: g,
      patternOpacity: patternOpacity
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        margin: "auto 0",
        display: "flex",
        flexDirection: "column",
        gap: 36
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...T.quote,
        maxWidth: "22ch"
      }
    }, `\u201C${text}\u201D`), cite && /*#__PURE__*/React.createElement("div", {
      style: {
        ...T.cite,
        color: c.accent
      }
    }, cite)));
  }

  // 6 — EPISODE LIST
  function ListSlide({
    g = "beige",
    eyebrow: eb = "Season One",
    items = [],
    patternOpacity = 0.2
  } = {}) {
    const c = GROUND[g];
    const borderColor = g === "beige" ? "rgba(81,28,19,0.18)" : "rgba(246,225,199,0.18)";
    return /*#__PURE__*/React.createElement(Frame, {
      g: g,
      pad: 88,
      patternOpacity: patternOpacity
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...T.label,
        color: c.accent
      }
    }, eb), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 36,
        display: "flex",
        flexDirection: "column"
      }
    }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: "flex",
        alignItems: "baseline",
        gap: 28,
        padding: "16px 0",
        borderTop: `1px solid ${borderColor}`
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        ...T.listN,
        color: c.accent,
        width: 64,
        flex: "none"
      }
    }, it.n), /*#__PURE__*/React.createElement("span", {
      style: {
        ...T.list,
        flex: 1
      }
    }, it.title), /*#__PURE__*/React.createElement("span", {
      style: {
        ...T.listDur
      }
    }, it.dur)))));
  }

  // 7 — CLOSING
  function ClosingSlide({
    g = "night",
    patternOpacity = 0.2
  } = {}) {
    const c = GROUND[g];
    return /*#__PURE__*/React.createElement(Frame, {
      g: g,
      patternOpacity: patternOpacity
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        margin: "auto",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...T.title,
        fontSize: 56
      }
    }, "Thank you"), /*#__PURE__*/React.createElement("div", {
      style: {
        ...T.label
      }
    }, "moremuslim.org")), /*#__PURE__*/React.createElement(Symbol, {
      size: 56,
      style: {
        color: c.accent
      }
    }));
  }
  const DECK = [() => /*#__PURE__*/React.createElement(TitleSlide, {
    g: "black"
  }), () => /*#__PURE__*/React.createElement(SectionSlide, {
    g: "oak",
    n: "01",
    title: "Overview"
  }), () => /*#__PURE__*/React.createElement(StatementSlide, {
    g: "night",
    eyebrow: "More Muslim",
    lead: "A narrative audio documentary series that explores the Muslim experience, with all its messiness.",
    body: "A sound-rich, cinematic narrative podcast telling deeply reported stories about Muslims across the world. Each episode is a mix of interviews, field reporting, history, and research, all scored to original music."
  }), () => /*#__PURE__*/React.createElement(StatsSlide, {
    g: "night",
    eyebrow: "Audience \xB7 first three months",
    stats: [{
      n: "40k+",
      l: "downloads"
    }, {
      n: "143",
      l: "countries"
    }, {
      n: "7\u00d7",
      l: "launch-to-peak growth"
    }]
  }), () => /*#__PURE__*/React.createElement(QuoteSlide, {
    g: "oak",
    text: "It calls her habibti. Gives her Islamic relationship advice.",
    cite: "In Therapy, With SheikhaGPT"
  }), () => /*#__PURE__*/React.createElement(ListSlide, {
    g: "beige",
    eyebrow: "Season One \\u00b7 selected episodes",
    items: [{
      n: "E1",
      title: "Side Entrances",
      dur: "44 min"
    }, {
      n: "E3",
      title: "The Secret Translators",
      dur: "44 min"
    }, {
      n: "E6",
      title: "Cape Malay",
      dur: "42 min"
    }, {
      n: "E7",
      title: "In Therapy, With SheikhaGPT",
      dur: "42 min"
    }, {
      n: "E9",
      title: "A More Muslim Japan",
      dur: "26 min"
    }]
  }), () => /*#__PURE__*/React.createElement(ClosingSlide, {
    g: "night"
  })];
  window.MMSlides = {
    TitleSlide,
    SectionSlide,
    StatementSlide,
    StatsSlide,
    QuoteSlide,
    ListSlide,
    ClosingSlide,
    DECK,
    W,
    H,
    IMG
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/slides/screens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/slides/tweaks-panel.jsx
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)

/* BEGIN USAGE */
// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
// Exports (to window): useTweaks, TweaksPanel, TweakSection, TweakRow, TweakSlider,
//   TweakToggle, TweakRadio, TweakSelect, TweakText, TweakNumber, TweakColor, TweakButton.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "palette": ["#D97757", "#29261b", "#f6f4ef"],
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        options={['#D97757', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakColor  label="Palette" value={t.palette}
//                        options={[['#D97757', '#29261b', '#f6f4ef'],
//                                  ['#475569', '#0f172a', '#f1f5f9']]}
//                        onChange={(v) => setTweak('palette', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// TweakRadio is the segmented control for 2–3 short options (auto-falls-back to
// TweakSelect past ~16/~10 chars per label); reach for TweakSelect directly when
// options are many or long. For color tweaks always curate 3-4 options rather than
// a free picker; an option can also be a whole 2–5 color palette (the stored value
// is the array). The Tweak* controls are a floor, not a ceiling — build custom
// controls inside the panel if a tweak calls for UI they don't cover.
/* END USAGE */
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;box-sizing:border-box;min-width:0;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null ? keyOrEdits : {
      [keyOrEdits]: val
    };
    setValues(prev => ({
      ...prev,
      ...edits
    }));
    window.parent.postMessage({
      type: '__edit_mode_set_keys',
      edits
    }, '*');
    // Same-window signal so in-page listeners (deck-stage rail thumbnails)
    // can react — the parent message only reaches the host, not peers.
    window.dispatchEvent(new CustomEvent('tweakchange', {
      detail: edits
    }));
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({
  title = 'Tweaks',
  children
}) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({
    x: 16,
    y: 16
  });
  const PAD = 16;
  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth,
      h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y))
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);
  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);
  React.useEffect(() => {
    const onMsg = e => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({
      type: '__edit_mode_available'
    }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({
      type: '__edit_mode_dismissed'
    }, '*');
  };
  const onDragStart = e => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX,
      sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = ev => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, __TWEAKS_STYLE), /*#__PURE__*/React.createElement("div", {
    ref: dragRef,
    className: "twk-panel",
    "data-omelette-chrome": "",
    style: {
      right: offsetRef.current.x,
      bottom: offsetRef.current.y
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-hd",
    onMouseDown: onDragStart
  }, /*#__PURE__*/React.createElement("b", null, title), /*#__PURE__*/React.createElement("button", {
    className: "twk-x",
    "aria-label": "Close tweaks",
    onMouseDown: e => e.stopPropagation(),
    onClick: dismiss
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "twk-body"
  }, children)));
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "twk-sect"
  }, label), children);
}
function TweakRow({
  label,
  value,
  children,
  inline = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: inline ? 'twk-row twk-row-h' : 'twk-row'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label), value != null && /*#__PURE__*/React.createElement("span", {
    className: "twk-val"
  }, value)), children);
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label,
    value: `${value}${unit}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "twk-slider",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => onChange(Number(e.target.value))
  }));
}
function TweakToggle({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "twk-toggle",
    "data-on": value ? '1' : '0',
    role: "switch",
    "aria-checked": !!value,
    onClick: () => onChange(!value)
  }, /*#__PURE__*/React.createElement("i", null)));
}
function TweakRadio({
  label,
  value,
  options,
  onChange
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Segments wrap mid-word once per-segment width runs out. The track is
  // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px
  // to its own padding, and 11.5px system-ui averages ~6.3px/char — so 2
  // options fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall
  // back to a dropdown rather than wrap.
  const labelLen = o => String(typeof o === 'object' ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({
    2: 16,
    3: 10
  }[options.length] ?? 0);
  if (!fitsAsSegments) {
    // <select> emits strings — map back to the original option value so the
    // fallback stays type-preserving (numbers, booleans) like the segment path.
    const resolve = s => {
      const m = options.find(o => String(typeof o === 'object' ? o.value : o) === s);
      return m === undefined ? s : typeof m === 'object' ? m.value : m;
    };
    return /*#__PURE__*/React.createElement(TweakSelect, {
      label: label,
      value: value,
      options: options,
      onChange: s => onChange(resolve(s))
    });
  }
  const opts = options.map(o => typeof o === 'object' ? o : {
    value: o,
    label: o
  });
  const idx = Math.max(0, opts.findIndex(o => o.value === value));
  const n = opts.length;
  const segAt = clientX => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor((clientX - r.left - 2) / inner * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };
  const onPointerDown = e => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = ev => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    role: "radiogroup",
    onPointerDown: onPointerDown,
    className: dragging ? 'twk-seg dragging' : 'twk-seg'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-seg-thumb",
    style: {
      left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
      width: `calc((100% - 4px) / ${n})`
    }
  }), opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    type: "button",
    role: "radio",
    "aria-checked": o.value === value
  }, o.label))));
}
function TweakSelect({
  label,
  value,
  options,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("select", {
    className: "twk-field",
    value: value,
    onChange: e => onChange(e.target.value)
  }, options.map(o => {
    const v = typeof o === 'object' ? o.value : o;
    const l = typeof o === 'object' ? o.label : o;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })));
}
function TweakText({
  label,
  value,
  placeholder,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("input", {
    className: "twk-field",
    type: "text",
    value: value,
    placeholder: placeholder,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakNumber({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}) {
  const clamp = n => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({
    x: 0,
    val: 0
  });
  const onScrubStart = e => {
    e.preventDefault();
    startRef.current = {
      x: e.clientX,
      val: value
    };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = ev => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "twk-num-lbl",
    onPointerDown: onScrubStart
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value,
    min: min,
    max: max,
    step: step,
    onChange: e => onChange(clamp(Number(e.target.value)))
  }), unit && /*#__PURE__*/React.createElement("span", {
    className: "twk-num-unit"
  }, unit));
}

// Relative-luminance contrast pick — checkmarks drawn over a swatch need to
// read on both #111 and #fafafa without per-option configuration. Hex input
// only (#rgb / #rrggbb); named or rgb()/hsl() colors fall through to "light".
function __twkIsLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, c => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = n >> 16 & 255,
    g = n >> 8 & 255,
    b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}
const __TwkCheck = ({
  light
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 14 14",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M3 7.2 5.8 10 11 4.2",
  fill: "none",
  strokeWidth: "2.2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  stroke: light ? 'rgba(0,0,0,.78)' : '#fff'
}));

// TweakColor — curated color/palette picker. Each option is either a single
// hex string or an array of 1-5 hex strings; the card adapts — a lone color
// renders solid, a palette renders colors[0] as the hero (left ~2/3) with the
// rest stacked in a sharp column on the right. onChange emits the
// option in the shape it was passed (string stays string, array stays array).
// Without options it falls back to the native color input for back-compat.
function TweakColor({
  label,
  value,
  options,
  onChange
}) {
  if (!options || !options.length) {
    return /*#__PURE__*/React.createElement("div", {
      className: "twk-row twk-row-h"
    }, /*#__PURE__*/React.createElement("div", {
      className: "twk-lbl"
    }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("input", {
      type: "color",
      className: "twk-swatch",
      value: value,
      onChange: e => onChange(e.target.value)
    }));
  }
  // Native <input type=color> emits lowercase hex per the HTML spec, so
  // compare case-insensitively. String() guards JSON.stringify(undefined),
  // which returns the primitive undefined (no .toLowerCase).
  const key = o => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-chips",
    role: "radiogroup"
  }, options.map((o, i) => {
    const colors = Array.isArray(o) ? o : [o];
    const [hero, ...rest] = colors;
    const sup = rest.slice(0, 4);
    const on = key(o) === cur;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      className: "twk-chip",
      role: "radio",
      "aria-checked": on,
      "data-on": on ? '1' : '0',
      "aria-label": colors.join(', '),
      title: colors.join(' · '),
      style: {
        background: hero
      },
      onClick: () => onChange(o)
    }, sup.length > 0 && /*#__PURE__*/React.createElement("span", null, sup.map((c, j) => /*#__PURE__*/React.createElement("i", {
      key: j,
      style: {
        background: c
      }
    }))), on && /*#__PURE__*/React.createElement(__TwkCheck, {
      light: __twkIsLight(hero)
    }));
  })));
}
function TweakButton({
  label,
  onClick,
  secondary = false
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: secondary ? 'twk-btn secondary' : 'twk-btn',
    onClick: onClick
  }, label);
}
Object.assign(window, {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRow,
  TweakSlider,
  TweakToggle,
  TweakRadio,
  TweakSelect,
  TweakText,
  TweakNumber,
  TweakColor,
  TweakButton
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/slides/tweaks-panel.jsx", error: String((e && e.message) || e) }); }

// ui_kits/social/screens.jsx
try { (() => {
/* More Muslim — Social post templates.
   Loaded in the browser via <script type="text/babel" src="screens.jsx">.
   Uses design-system primitives off window.MoreMuslimDesignSystem_019df4 and
   assigns its own components to window.MMSocial. No ES imports (browser-babel). */
(function () {
  const DS = window.MoreMuslimDesignSystem_019df4 || {};
  const {
    PatternPanel,
    PullQuote,
    EyebrowLabel,
    Symbol
  } = DS;
  const WAYS = {
    night: {
      bg: "#192136",
      tile: "5C",
      text: "#F6E1C6",
      sub: "rgba(246,225,198,0.62)",
      accent: "#F6E1C6",
      logo: "beige",
      grain: 0.10,
      tileOpacity: 0.15
    },
    oak: {
      bg: "#511C14",
      tile: "6B",
      text: "#F6E1C6",
      sub: "rgba(246,225,198,0.66)",
      accent: "#F6E1C6",
      logo: "beige",
      grain: 0.10,
      tileOpacity: 0.15
    },
    beige: {
      bg: "#FBF2E9",
      tile: "6A",
      text: "#511C14",
      sub: "rgba(81,28,20,0.62)",
      accent: "#511C14",
      logo: "oak",
      grain: 0.06,
      tileOpacity: 0.10
    },
    harvest: {
      bg: "#E2B16D",
      tile: "3A",
      text: "#511C14",
      sub: "rgba(81,28,20,0.62)",
      accent: "#511C14",
      logo: "oak",
      grain: 0.08,
      tileOpacity: 0.10
    },
    mist: {
      bg: "#9FBCCC",
      tile: "2B",
      text: "#192136",
      sub: "rgba(25,33,54,0.7)",
      accent: "#192136",
      logo: "night",
      grain: 0.07,
      tileOpacity: 0.10
    },
    black: {
      bg: "#000000",
      tile: null,
      text: "#FBF2E9",
      sub: "rgba(251,242,233,0.62)",
      accent: "#FBF2E9",
      logo: "beige",
      grain: 0.14,
      tileOpacity: 0
    }
  };
  const LOGO = v => `../../assets/logos/logo-horizontal-${v}.svg`;
  const SYM = v => `../../assets/logos/symbol-${v}.svg`;
  const SIZES = {
    portrait: {
      w: 1080,
      h: 1350
    },
    story: {
      w: 1080,
      h: 1920
    }
  };
  const TEXT_WIDTH = {
    portrait: 910,
    story: 780
  };
  function PostFrame({
    format = "square",
    way = "night",
    pattern = true,
    children,
    scale = 1,
    image,
    cropX = 50,
    cropY = 50,
    cropZoom = 1
  }) {
    const c = WAYS[way];
    const {
      w,
      h
    } = SIZES[format];
    const inner = /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        padding: 85,
        boxSizing: "border-box",
        color: c.text,
        lineHeight: 1
      }
    }, children);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: w * scale,
        height: h * scale,
        flex: "none"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: w,
        height: h,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        position: "relative",
        overflow: "hidden",
        background: c.bg,
        fontFamily: "var(--font-serif)"
      }
    }, image ? /*#__PURE__*/React.createElement("img", {
      src: image,
      alt: "",
      style: {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: `${cropX}% ${cropY}%`,
        transform: `scale(${cropZoom})`,
        transformOrigin: `${cropX}% ${cropY}%`
      }
    }) : pattern && PatternPanel ? /*#__PURE__*/React.createElement(PatternPanel, {
      tile: c.tile,
      color: c.bg,
      grain: true,
      grainOpacity: c.grain,
      tileOpacity: c.tileOpacity,
      radius: "0",
      style: {
        position: "absolute",
        inset: 0
      }
    }) : null, inner));
  }
  const eyebrow = (c, txt, field) => /*#__PURE__*/React.createElement("div", {
    "data-field": field,
    style: {
      fontSize: 32,
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-caps)",
      color: c.accent,
      whiteSpace: "nowrap",
      textAlign: "center",
      width: "100%",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, txt);
  const footerMark = (c, way, label = "MOREMUSLIM.ORG", showSymbol = false) => /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 28
    }
  }, showSymbol && /*#__PURE__*/React.createElement("img", {
    src: SYM(WAYS[way].logo),
    style: {
      width: 216,
      height: 216
    },
    alt: ""
  }), label && /*#__PURE__*/React.createElement("div", {
    "data-field": "url",
    style: {
      fontSize: 32,
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-caps)",
      color: c.accent,
      whiteSpace: "nowrap"
    }
  }, label));

  // 1 — COVER
  function CoverPost({
    format = "portrait",
    way = "night",
    presents = "More Muslim presents",
    title = "Side Entrances",
    episode = "S1 E7",
    image,
    cropX = 50,
    cropY = 50,
    cropZoom = 1,
    scale = 1
  }) {
    const c = WAYS[way];
    const tw = TEXT_WIDTH[format];
    return /*#__PURE__*/React.createElement(PostFrame, {
      format: format,
      way: way,
      image: image,
      cropX: cropX,
      cropY: cropY,
      cropZoom: cropZoom,
      scale: scale
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center"
      }
    }, eyebrow(c, presents, "presents")), /*#__PURE__*/React.createElement("h1", {
      "data-field": "title",
      style: {
        margin: "36px auto 0",
        textAlign: "center",
        fontWeight: 400,
        textTransform: "uppercase",
        letterSpacing: "var(--tracking-caps)",
        fontSize: 77,
        maxWidth: tw
      }
    }, title), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: "auto",
        width: "100%",
        display: "flex",
        alignItems: "flex-end"
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: SYM(WAYS[way].logo),
      style: {
        width: 216,
        height: 216,
        flex: "none"
      },
      alt: ""
    }), /*#__PURE__*/React.createElement("div", {
      "data-field": "episode",
      style: {
        flex: 1,
        textAlign: "center",
        fontSize: 32,
        textTransform: "uppercase",
        letterSpacing: "var(--tracking-caps)",
        color: c.accent,
        whiteSpace: "nowrap"
      }
    }, episode), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 216,
        flex: "none"
      }
    })));
  }

  // 2 — QUOTE
  function QuotePost({
    format = "story",
    way = "oak",
    episode = "Episode 7: In Therapy, with SheikhAGPT",
    exchanges = [],
    image,
    cropX = 50,
    cropY = 50,
    cropZoom = 1,
    scale = 1
  }) {
    const c = WAYS[way];
    return /*#__PURE__*/React.createElement(PostFrame, {
      format: format,
      way: way,
      image: image,
      cropX: cropX,
      cropY: cropY,
      cropZoom: cropZoom,
      scale: scale
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 56
      }
    }, eyebrow(c, episode, "episode")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 56,
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        textAlign: "center"
      }
    }, exchanges.map((ex, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 20,
        alignItems: "center",
        width: "100%"
      }
    }, /*#__PURE__*/React.createElement("div", {
      "data-field": `s${i + 1}`,
      style: {
        fontSize: 32,
        textTransform: "uppercase",
        letterSpacing: "var(--tracking-caps)",
        whiteSpace: "nowrap"
      }
    }, ex.speaker), /*#__PURE__*/React.createElement("div", {
      "data-field": `t${i + 1}`,
      style: {
        fontSize: 42,
        maxWidth: TEXT_WIDTH[format],
        textAlign: "center"
      },
      dangerouslySetInnerHTML: {
        __html: ex.text
      }
    })))), footerMark(c, way));
  }

  // 3 — SYNOPSIS
  function SynopsisPost({
    format = "portrait",
    way = "black",
    episode = "In Therapy, with SheikhAGPT",
    paragraphs = [],
    image,
    cropX = 50,
    cropY = 50,
    cropZoom = 1,
    scale = 1
  }) {
    const c = WAYS[way];
    // Auto-detect body copy size based on total text length
    const totalLength = paragraphs.join("").replace(/<[^>]*>/g, '').length;
    const bodyCopySize = totalLength > 200 ? "M" : "L";
    const bodySizes = {
      L: 77,
      M: 56
    };
    const bodySize = bodySizes[bodyCopySize];
    return /*#__PURE__*/React.createElement(PostFrame, {
      format: format,
      way: way,
      image: image,
      cropX: cropX,
      cropY: cropY,
      cropZoom: cropZoom,
      scale: scale
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        marginBottom: 64
      }
    }, eyebrow(c, episode, "episode")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 40,
        justifyContent: "center",
        flex: 1
      }
    }, paragraphs.map((p, i) => /*#__PURE__*/React.createElement("p", {
      "data-field": `p${i + 1}`,
      key: i,
      style: {
        margin: 0,
        fontSize: bodySize,
        maxWidth: TEXT_WIDTH[format],
        textWrap: "pretty"
      },
      dangerouslySetInnerHTML: {
        __html: p
      }
    }))), /*#__PURE__*/React.createElement("div", {
      "data-field": "url",
      style: {
        marginTop: 56,
        textAlign: "center",
        fontSize: 32,
        textTransform: "uppercase",
        letterSpacing: "var(--tracking-caps)",
        whiteSpace: "nowrap"
      }
    }, "MOREMUSLIM.ORG"));
  }

  // 4 — NOW STREAMING
  function NowStreamingPost({
    format = "story",
    way = "night",
    episode = "Episode 7",
    lines = [],
    image,
    cropX = 50,
    cropY = 50,
    cropZoom = 1,
    scale = 1
  }) {
    const c = WAYS[way];
    return /*#__PURE__*/React.createElement(PostFrame, {
      format: format,
      way: way,
      image: image,
      cropX: cropX,
      cropY: cropY,
      cropZoom: cropZoom,
      scale: scale
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 48,
        justifyContent: "center",
        flex: 1,
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        margin: "0 auto",
        fontWeight: 400,
        textAlign: "center",
        textTransform: "uppercase",
        letterSpacing: "var(--tracking-caps)",
        fontSize: 56,
        color: c.accent,
        maxWidth: TEXT_WIDTH[format]
      }
    }, /*#__PURE__*/React.createElement("span", {
      "data-field": "episode"
    }, episode), /*#__PURE__*/React.createElement("br", null), "Now Streaming"), lines.map((l, i) => /*#__PURE__*/React.createElement("p", {
      "data-field": `l${i + 1}`,
      key: i,
      style: {
        margin: "0 auto",
        textAlign: "center",
        fontSize: 42,
        maxWidth: TEXT_WIDTH[format]
      },
      dangerouslySetInnerHTML: {
        __html: l
      }
    }))), footerMark(c, way, "MOREMUSLIM.ORG", true));
  }

  // 5 — CREDITS
  function CreditsPost({
    format = "portrait",
    way = "night",
    body = "",
    episode = "S1 E7",
    image,
    cropX = 50,
    cropY = 50,
    cropZoom = 1,
    scale = 1
  }) {
    const c = WAYS[way];
    const processedBody = body.replace(/<b([^>]*)>/gi, '<span$1 style="text-transform:uppercase;letter-spacing:var(--tracking-caps)">').replace(/<\/b>/gi, '</span>').replace(/<strong([^>]*)>/gi, '<span$1 style="text-transform:uppercase;letter-spacing:var(--tracking-caps)">').replace(/<\/strong>/gi, '</span>');
    return /*#__PURE__*/React.createElement(PostFrame, {
      format: format,
      way: way,
      image: image,
      cropX: cropX,
      cropY: cropY,
      cropZoom: cropZoom,
      scale: scale
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        marginBottom: 56
      }
    }, eyebrow(c, "Episode Credits", null)), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      "data-field": "body",
      style: {
        fontSize: 32,
        textAlign: "center",
        lineHeight: 1.7,
        color: c.text
      },
      dangerouslySetInnerHTML: {
        __html: processedBody
      }
    })), /*#__PURE__*/React.createElement("div", {
      "data-field": "episode",
      style: {
        marginTop: 40,
        textAlign: "center",
        fontSize: 32,
        letterSpacing: "var(--tracking-caps)",
        textTransform: "uppercase",
        whiteSpace: "nowrap"
      }
    }, episode));
  }
  window.MMSocial = {
    PostFrame,
    CoverPost,
    QuotePost,
    SynopsisPost,
    NowStreamingPost,
    CreditsPost,
    WAYS,
    SIZES
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/social/screens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/screens.jsx
try { (() => {
/* moremuslim.org — website UI kit screens.
   Light theme matching the actual site (beige ground, oak brown text).
   Episode page: dark immersive for covered episodes.
   Typography from moremuslim.org main CSS — line-height 1.176 body, 1.0 titles.
   Browser-babel (no ES imports). Assigns window.MMSite. */
(function () {
  const DS = window.MoreMuslimDesignSystem_019df4 || {};
  const {
    Button,
    Tag,
    EyebrowLabel,
    Avatar,
    Symbol,
    AudioBar,
    PullQuote,
    PatternPanel
  } = DS;
  const IMG = "../../assets/imagery/";
  const LOGO = "../../assets/logos/";

  // Ground colours for CoverArt panels (corrected from moremuslim.org)
  const WAY_BG = {
    night: "#192136",
    oak: "#511C14",
    terra: "#C15A3A",
    stone: "#3C5065",
    mist: "#9FBCCC"
  };
  const WAY_TILE = {
    night: "5C",
    oak: "6B",
    terra: "5B",
    stone: "1B",
    mist: "2B"
  };
  const symClr = way => way === "mist" ? "#192136" : "#F6E1C6";

  // Light-theme palette (matches actual site)
  const BG = "#FBF2E9"; // beige soft
  const INK = "#511C14"; // oak brown
  const WH = "#FFFFFF"; // white cards
  const BDR = "rgba(81,28,20,0.1)"; // subtle border

  // Typography tokens from moremuslim.org CSS
  const F = {
    meta: {
      fontSize: "0.75rem",
      letterSpacing: "1.5px",
      lineHeight: 1.2,
      textTransform: "uppercase"
    },
    epttl: {
      fontSize: "1.25rem",
      letterSpacing: "3.14px",
      lineHeight: 1,
      textTransform: "uppercase",
      fontWeight: 400
    },
    body: {
      fontSize: "1.0625rem",
      letterSpacing: "0.21px",
      lineHeight: 1.176
    },
    intro: {
      fontSize: "1.875rem",
      letterSpacing: "0.5px",
      lineHeight: 1,
      fontWeight: 400
    },
    about: {
      fontSize: "1.25rem",
      letterSpacing: "0.5px",
      lineHeight: 1.2,
      fontWeight: 400
    },
    caps: {
      fontSize: "0.75rem",
      letterSpacing: "1.5px",
      textTransform: "uppercase"
    }
  };
  const CREDITS_BASE = [["Sohaira Siddiqui", "Host"], ["Salman Ahad Khan", "Executive Producer"], ["Alexander Overington", "Technical Director"], ["Sarah Qari", "Consulting Editor"], ["Heba Elorbany", "Fact Checker"]];
  const EPISODES = [{
    id: "e9",
    n: 9,
    title: "A More Muslim Japan",
    dur: "25:45",
    date: "11 Jun 2026",
    cover: null,
    way: "stone",
    blurb: "The number of Muslims in Japan has almost quadrupled in the last two decades. Migrants are coming in ever greater numbers to work there from countries like Indonesia. And yet, Islam is still seen as this\u2026 foreign, elusive thing. This week on the show, reporter Tanita Rahmani follows two Muslim women who try to change things.",
    quote: {
      text: "Islam is still seen as this foreign, elusive thing.",
      cite: "Episode 9 · A More Muslim Japan"
    },
    reporter: "Tanita Rahmani",
    credits: [["Tanita Rahmani", "Reporter & Producer"], ...CREDITS_BASE]
  }, {
    id: "e8",
    n: 8,
    title: "The Travelling Sisterhood",
    dur: "43:00",
    date: "27 May 2026",
    cover: null,
    way: "mist",
    blurb: "As millions of Muslims complete Hajj, we revisit a question scholars have debated for centuries: can a Muslim woman make a journey like that without a mahram? This week on the show, host Sohaira Siddiqui recalls the first time she ran headfirst into that debate, when she decided to tell her parents she wanted to move to Jordan to study Arabic. And how that initial conversation at her parents\u2019 kitchen table led her to dive deep into centuries of scholarly debate on the topic, from the Mughal princess Gulbadan Begum\u2019s seven-year pilgrimage to Mecca, to the 2023 Saudi ruling that let women perform Hajj without a male guardian.",
    quote: {
      text: "Can a Muslim woman make a journey like that without a mahram?",
      cite: "Episode 8 · The Travelling Sisterhood"
    },
    reporter: "Sohaira Siddiqui",
    credits: [["Sohaira Siddiqui", "Reporter & Host"], ["Salman Ahad Khan", "Executive Producer"], ["Alexander Overington", "Technical Director"], ["Sarah Qari", "Consulting Editor"]]
  }, {
    id: "e7",
    n: 7,
    title: "In Therapy, With SheikhaGPT",
    dur: "42:11",
    date: "24 Apr 2026",
    cover: IMG + "illus-therapy.jpg",
    way: "night",
    blurb: "When reporter Yassmin Abdel-Magied\u2019s friend tells her she\u2019s been using ChatGPT as a therapist, Yassmin doesn\u2019t know what to think. The chatbot calls her friend \u201Chabibti.\u201D Gives her Islamic relationship advice. It\u2019s helping her reconnect with her faith in ways no human in her life has been able to. But it\u2019s also a product built by a tech company with no soul, no silsila, and no duty of care. Yassmin\u2019s search for answers leads her to a 12th-century hospital in Damascus and a Stanford psychiatrist who\u2019s building something unexpected: a chatbot, rooted in Islamic Psychology.",
    quote: {
      text: "It calls her habibti. Gives her Islamic relationship advice.",
      cite: "Episode 7 · In Therapy, With SheikhaGPT"
    },
    reporter: "Yassmin Abdel-Magied",
    credits: [["Yassmin Abdel-Magied", "Reporter"], ["Lina Jaradat", "Illustrator"], ...CREDITS_BASE]
  }, {
    id: "e6",
    n: 6,
    title: "Cape Malay: The Indonesian Roots of South African Islam",
    dur: "41:43",
    date: "02 Apr 2026",
    cover: IMG + "illus-ep6.webp",
    way: "oak",
    blurb: "Growing up, Aina had heard about the transatlantic slave trade that enslaved Africans and took them to the Americas. But on one of her reporting trips, she was shocked to learn that, around the same time, Dutch colonizers were deporting and enslaving Muslims from Indonesia and shipping them thousands of miles\u2026 all the way to South Africa.",
    quote: {
      text: "I want to let them know that there's consequences of everything.",
      cite: "Bo-Kaap resident · Cape Malay"
    },
    reporter: "Aina J. Khan",
    credits: [["Aina J. Khan", "Reporter"], ["Catherine Boulle", "Contributing Producer"], ...CREDITS_BASE]
  }, {
    id: "e5",
    n: 5,
    title: "Hanabneehu: Rebuilding Sudan, One Class at a Time",
    dur: "35:50",
    date: "19 Mar 2026",
    cover: IMG + "illus-ep5.webp",
    way: "terra",
    blurb: "When war broke out in Sudan in April 2023, Dr. Fairouz El Hijzi faced an impossible choice: give up on her students' futures or attempt to resume classes in the middle of the worst humanitarian crisis in modern history. Reporter Yassmin Abdel-Magied tells the story of what happened when she and her students decided to keep hope alive and start building a new future for Sudan.",
    quote: {
      text: "They decided to keep hope alive and start building a new future for Sudan.",
      cite: "Episode 5 · Hanabneehu"
    },
    reporter: "Yassmin Abdel-Magied",
    credits: [["Yassmin Abdel-Magied", "Reporter"], ...CREDITS_BASE]
  }, {
    id: "e4",
    n: 4,
    title: "A Recitation Revolution",
    dur: "49:39",
    date: "06 Mar 2026",
    cover: IMG + "illus-ep4.webp",
    way: "night",
    blurb: "For most of her life, Maryam believed women couldn't recite the Qur'an aloud. That a woman's voice, especially while reciting the Qur'an, is awrah. Something to be hidden. Then, one day in high school, she heard a girl recite in public.",
    quote: {
      text: "Then, one day, she heard a girl recite in public.",
      cite: "Episode 4 · A Recitation Revolution"
    },
    reporter: "More Muslim Team",
    credits: CREDITS_BASE
  }, {
    id: "e3",
    n: 3,
    title: "The Secret Translators",
    dur: "43:48",
    date: "18 Feb 2026",
    cover: IMG + "illus-ep3.webp",
    way: "stone",
    blurb: "The \u2018Sahih International\u2019 translation is one of the most widely read English versions of the Qur\u2019an, but the authors of the translation are rarely ever mentioned by name. Until one day, The Digital Sisterhood\u2019s Cadar Mohamud hears a rumor about who actually wrote the mysterious translation: three white revert American women living in Saudi Arabia.",
    quote: {
      text: "Three white revert American women living in Saudi Arabia.",
      cite: "Episode 3 · The Secret Translators"
    },
    reporter: "Cadar Mohamud",
    credits: [["Cadar Mohamud", "Contributing Reporter"], ...CREDITS_BASE]
  }, {
    id: "e2",
    n: 2,
    title: "The Nikkah Loophole",
    dur: "35:54",
    date: "01 Feb 2026",
    cover: IMG + "illus-ep2.webp",
    way: "mist",
    blurb: "Reporter Tanita Rahmani realizes a small detail on her marriage contract means her marriage was never legally registered. That revelation sends her on a personal and investigative journey into the legal gray zone where many Muslim marriages exist: recognized by faith, but invisible to the law.",
    quote: {
      text: "Recognized by faith, but invisible to the law.",
      cite: "Episode 2 · The Nikkah Loophole"
    },
    reporter: "Tanita Rahmani",
    credits: [["Tanita Rahmani", "Reporter & Producer"], ...CREDITS_BASE]
  }, {
    id: "e1",
    n: 1,
    title: "Side Entrances",
    dur: "43:59",
    date: "01 Feb 2026",
    cover: IMG + "illus-ep1.webp",
    way: "oak",
    blurb: "What does it mean when the presence of half our community in the most central and sacred space of Muslim life is up for debate? Reporter Taqwa Sadiq traces the evolution of Muslim women's relationship with the mosque, from the prophetic era when women prayed alongside men without barriers to today's reality.",
    quote: {
      text: "From the prophetic era, when women prayed alongside men, to today.",
      cite: "Episode 1 · Side Entrances"
    },
    reporter: "Taqwa Sadiq",
    credits: [["Taqwa Sadiq", "Reporter & Producer"], ...CREDITS_BASE]
  }];

  // Shared episode cover/art panel
  function CoverArt({
    ep,
    height = 220,
    radius = "5px"
  }) {
    const bg = WAY_BG[ep.way] || "#192136";
    const tile = WAY_TILE[ep.way] || "5C";
    if (ep.cover) {
      return /*#__PURE__*/React.createElement("div", {
        style: {
          height,
          borderRadius: radius,
          overflow: "hidden",
          background: bg,
          flexShrink: 0
        }
      }, /*#__PURE__*/React.createElement("img", {
        src: ep.cover,
        alt: "",
        style: {
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block"
        }
      }));
    }
    return PatternPanel ? /*#__PURE__*/React.createElement(PatternPanel, {
      tile: tile,
      color: bg,
      radius: radius,
      grainOpacity: 0.08,
      tileOpacity: 0.14,
      style: {
        height,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement(Symbol, {
      size: Math.min(72, (typeof height === "number" ? height : 220) * 0.32),
      style: {
        color: symClr(ep.way),
        opacity: 0.92
      }
    })) : /*#__PURE__*/React.createElement("div", {
      style: {
        height,
        background: bg,
        borderRadius: radius,
        flexShrink: 0
      }
    });
  }

  // Header: 3-col grid, logo centred (matches moremuslim.org desktop layout)
  function Header({
    onHome,
    onAbout
  }) {
    return /*#__PURE__*/React.createElement("header", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        padding: "20px 48px 15px",
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: `rgba(251,242,233,0.92)`,
        backdropFilter: "blur(10px)",
        borderBottom: `1px solid ${BDR}`
      }
    }, /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("img", {
      src: LOGO + "logo-horizontal-oak.svg",
      alt: "More Muslim",
      style: {
        height: 54,
        cursor: "pointer"
      },
      onClick: onHome
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "flex-end"
      }
    }, /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "primary"
    }, "Subscribe")));
  }
  function Footer() {
    return /*#__PURE__*/React.createElement("footer", {
      style: {
        padding: "60px 0 40px",
        borderTop: `1px solid ${BDR}`,
        marginTop: 80
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: LOGO + "logo-horizontal-oak.svg",
      alt: "More Muslim",
      style: {
        height: 54
      }
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        ...F.body,
        maxWidth: "40ch",
        textAlign: "center",
        fontStyle: "italic",
        color: INK
      }
    }, "A narrative audio documentary series that explores the Muslim experience, with all its messiness."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 24,
        ...F.caps,
        color: INK,
        opacity: 0.4
      }
    }, /*#__PURE__*/React.createElement("span", null, "Apple Podcasts"), /*#__PURE__*/React.createElement("span", null, "Spotify"), /*#__PURE__*/React.createElement("span", null, "RSS")), /*#__PURE__*/React.createElement("div", {
      style: {
        ...F.caps,
        fontSize: "0.6875rem",
        color: INK,
        opacity: 0.28,
        textAlign: "center"
      }
    }, "\xA9 2026 More Muslim \xB7 All rights reserved.")));
  }

  // Episode card: .c-episode layout — white content panel (left) + image (right)
  function EpCard({
    ep,
    onOpen,
    showBlurb = false
  }) {
    return /*#__PURE__*/React.createElement("article", {
      onClick: () => onOpen(ep.id),
      style: {
        display: "grid",
        gridTemplateColumns: "5fr 9fr",
        gap: 12,
        cursor: "pointer",
        marginBottom: 20,
        color: INK
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: WH,
        border: `1px solid ${BDR}`,
        borderRadius: 5,
        padding: "27px 32px",
        display: "flex",
        flexDirection: "column",
        minHeight: showBlurb ? 320 : 260
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "1.5rem",
        ...F.meta,
        color: INK
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        opacity: 0.3
      }
    }, ep.date), /*#__PURE__*/React.createElement("span", null, "S1 \xB7 E", ep.n), /*#__PURE__*/React.createElement("span", {
      style: {
        opacity: 0.3
      }
    }, ep.dur)), /*#__PURE__*/React.createElement("h2", {
      style: {
        margin: "0 0 1.25rem",
        textAlign: "center",
        ...F.epttl,
        color: INK
      }
    }, ep.title), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "center",
        marginBottom: showBlurb ? "1rem" : 0
      }
    }, /*#__PURE__*/React.createElement("button", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        cursor: "pointer",
        padding: "6.5px 14px 5.5px",
        fontFamily: "inherit",
        ...F.meta,
        color: INK,
        background: "transparent",
        border: `1px solid rgba(81,28,20,0.05)`,
        borderRadius: 5
      }
    }, "\u25B6 Play Episode")), showBlurb && /*#__PURE__*/React.createElement("p", {
      style: {
        margin: "0 0 auto",
        ...F.body,
        color: INK,
        textWrap: "pretty"
      }
    }, ep.blurb), /*#__PURE__*/React.createElement("a", {
      style: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        ...F.caps,
        fontVariantCaps: "all-small-caps",
        lineHeight: 1.083,
        opacity: 0.3,
        color: INK,
        marginTop: showBlurb ? 24 : "auto"
      }
    }, "Transcript & Credits \u2192")), /*#__PURE__*/React.createElement("div", {
      style: {
        aspectRatio: "749/621",
        borderRadius: 5,
        overflow: "hidden",
        background: WAY_BG[ep.way]
      }
    }, ep.cover ? /*#__PURE__*/React.createElement("img", {
      src: ep.cover,
      alt: "",
      style: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block"
      }
    }) : PatternPanel ? /*#__PURE__*/React.createElement(PatternPanel, {
      tile: WAY_TILE[ep.way],
      color: WAY_BG[ep.way],
      radius: "0",
      grainOpacity: 0.08,
      tileOpacity: 0.14,
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement(Symbol, {
      size: 72,
      style: {
        color: symClr(ep.way),
        opacity: 0.9
      }
    })) : null));
  }
  function Home({
    onOpen,
    onAbout
  }) {
    const featured = EPISODES[0];
    const rest = EPISODES.slice(1);
    return /*#__PURE__*/React.createElement("main", {
      style: {
        background: BG,
        color: INK
      }
    }, /*#__PURE__*/React.createElement("section", {
      style: {
        maxWidth: 820,
        margin: "0 auto",
        padding: "200px 48px 160px",
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        margin: "28px auto 0",
        ...F.intro,
        maxWidth: "26ch",
        color: INK
      }
    }, "A narrative audio documentary series that explores the Muslim experience, with all its messiness."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 14,
        marginTop: 44,
        justifyContent: "center",
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "lg",
      onClick: () => onOpen(featured.id)
    }, "Listen now"), /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      size: "lg",
      onClick: onAbout
    }, "About the show"))), /*#__PURE__*/React.createElement("section", {
      style: {
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 48px 80px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...F.caps,
        color: INK,
        opacity: 0.45,
        marginBottom: 24,
        textAlign: "center"
      }
    }, "Season One \xB7 Nine episodes"), /*#__PURE__*/React.createElement(EpCard, {
      ep: featured,
      onOpen: onOpen,
      showBlurb: true
    }), rest.map(ep => /*#__PURE__*/React.createElement(EpCard, {
      key: ep.id,
      ep: ep,
      onOpen: onOpen
    }))), /*#__PURE__*/React.createElement("section", {
      style: {
        background: "#F6E1C6",
        borderTop: `1px solid ${BDR}`,
        borderBottom: `1px solid ${BDR}`,
        padding: "100px 48px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 80,
        maxWidth: 1200,
        margin: "0 auto",
        alignItems: "start"
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        margin: 0,
        ...F.epttl,
        fontSize: "1.25rem",
        color: INK
      }
    }, "About the show"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      style: {
        margin: "0 0 28px",
        ...F.about,
        color: INK
      }
    }, "More Muslim is a sound-rich, cinematic narrative podcast telling deeply reported stories about Muslims across the world. Each episode is a mix of interviews, field reporting, history, and research, all scored to original music. Our first season is a production of Al-Mujadilah Center and Mosque for Women."), /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      onClick: onAbout
    }, "Read more")))), /*#__PURE__*/React.createElement("div", {
      style: {
        background: BG,
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 48px"
      }
    }, /*#__PURE__*/React.createElement(Footer, null)));
  }
  function EpisodePage({
    id,
    onOpen,
    onHome
  }) {
    const ep = EPISODES.find(e => e.id === id) || EPISODES[0];
    const [playing, setPlaying] = React.useState(false);
    const [prog, setProg] = React.useState(0.18);
    const more = EPISODES.filter(e => e.id !== ep.id).slice(0, 3);
    const durSec = parseInt(ep.dur) * 60;
    const hasCover = !!ep.cover;
    const txtClr = hasCover ? "#F6E1C6" : INK;
    return /*#__PURE__*/React.createElement("article", {
      style: {
        background: hasCover ? "#192136" : BG,
        color: txtClr,
        minHeight: "100vh"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        height: 480,
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement(CoverArt, {
      ep: ep,
      height: 480,
      radius: "0"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.75) 100%)"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        bottom: 44,
        left: 0,
        right: 0,
        textAlign: "center",
        color: "#F6E1C6"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...F.meta,
        opacity: 0.7
      }
    }, "S1 \xB7 E", ep.n, " \xB7 ", ep.dur, " \xB7 ", ep.date), /*#__PURE__*/React.createElement("h1", {
      style: {
        margin: "16px auto 0",
        ...F.epttl,
        fontSize: "1.875rem",
        letterSpacing: "0.08em",
        maxWidth: "20ch"
      }
    }, ep.title))), /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 760,
        margin: "0 auto",
        padding: "48px 48px 0"
      }
    }, /*#__PURE__*/React.createElement("a", {
      onClick: onHome,
      style: {
        cursor: "pointer",
        ...F.caps,
        opacity: 0.5,
        color: txtClr
      }
    }, "\u2190 All episodes"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 14,
        marginTop: 36
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: ep.reporter,
      size: 42
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        ...F.body,
        color: txtClr
      }
    }, ep.reporter), /*#__PURE__*/React.createElement("div", {
      style: {
        ...F.caps,
        opacity: 0.5,
        color: txtClr
      }
    }, "Reporting"))), /*#__PURE__*/React.createElement("div", {
      style: {
        margin: "32px 0"
      }
    }, /*#__PURE__*/React.createElement(AudioBar, {
      episode: `S1 · E${ep.n}`,
      title: ep.title,
      playing: playing,
      progress: prog,
      duration: durSec,
      onToggle: () => setPlaying(p => !p),
      onSeek: setProg
    })), /*#__PURE__*/React.createElement("p", {
      style: {
        ...F.body,
        fontSize: "1.1875rem",
        lineHeight: 1.158,
        letterSpacing: "0.14px",
        textWrap: "pretty",
        maxWidth: "60ch",
        color: txtClr
      }
    }, ep.blurb), /*#__PURE__*/React.createElement("div", {
      style: {
        margin: "44px 0"
      }
    }, /*#__PURE__*/React.createElement(PullQuote, {
      size: "lg",
      cite: ep.quote.cite
    }, ep.quote.text)), /*#__PURE__*/React.createElement("section", {
      style: {
        margin: "44px 0"
      }
    }, /*#__PURE__*/React.createElement(EyebrowLabel, {
      tone: "secondary"
    }, "Episode credits"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))",
        gap: "18px 32px",
        marginTop: 22
      }
    }, ep.credits.map(([name, role], i) => /*#__PURE__*/React.createElement("div", {
      key: i
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...F.body,
        textTransform: "uppercase",
        letterSpacing: "1.5px",
        color: txtClr
      }
    }, name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontStyle: "italic",
        opacity: 0.6,
        ...F.body,
        fontSize: "0.9375rem",
        color: txtClr
      }
    }, role))))), /*#__PURE__*/React.createElement("section", {
      style: {
        marginTop: 64
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...F.caps,
        opacity: 0.4,
        marginBottom: 22,
        textAlign: "center",
        color: txtClr
      }
    }, "More from Season One"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gap: 18
      }
    }, more.map(e => /*#__PURE__*/React.createElement("article", {
      key: e.id,
      style: {
        cursor: "pointer"
      },
      onClick: () => {
        onOpen(e.id);
        window.scrollTo(0, 0);
      }
    }, /*#__PURE__*/React.createElement(CoverArt, {
      ep: e,
      height: 140,
      radius: "5px"
    }), /*#__PURE__*/React.createElement("h4", {
      style: {
        margin: "14px 0 0",
        fontWeight: 400,
        ...F.body,
        lineHeight: 1.2,
        color: txtClr
      }
    }, e.title), /*#__PURE__*/React.createElement("div", {
      style: {
        ...F.caps,
        opacity: 0.4,
        marginTop: 6,
        color: txtClr
      }
    }, "E", e.n, " \xB7 ", e.dur)))))), /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 760,
        margin: "0 auto",
        padding: "0 48px"
      }
    }, /*#__PURE__*/React.createElement(Footer, null)));
  }
  function About({
    onHome
  }) {
    return /*#__PURE__*/React.createElement("article", {
      style: {
        background: BG,
        color: INK,
        minHeight: "100vh"
      }
    }, /*#__PURE__*/React.createElement("section", {
      style: {
        maxWidth: 860,
        margin: "0 auto",
        padding: "100px 48px 0"
      }
    }, /*#__PURE__*/React.createElement(EyebrowLabel, null, "About the show"), /*#__PURE__*/React.createElement("h1", {
      style: {
        margin: "22px 0 0",
        fontWeight: 400,
        fontSize: "2.5rem",
        lineHeight: 1.04,
        letterSpacing: "0.02em",
        color: INK
      }
    }, "Made in Doha. Reported across the world."), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 36,
        display: "flex",
        flexDirection: "column",
        gap: 22
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        ...F.about,
        color: INK
      }
    }, "More Muslim is a sound-rich, cinematic narrative podcast telling deeply reported stories about Muslims across the world. Each episode is a mix of interviews, field reporting, history, and research, all scored to original music. Our first season is a production of Al-Mujadilah Center and Mosque for Women and is focused on covering some of the most interesting stories in the Muslim world through the lived experiences of Muslim women.")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gap: 20,
        margin: "52px 0"
      }
    }, [["40,000+", "downloads"], ["143", "countries"], ["7\u00d7", "launch-to-peak growth"]].map(([n, l], i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        padding: "24px",
        border: `1px solid ${BDR}`,
        borderRadius: 5,
        background: WH
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: "2.5rem",
        color: INK,
        lineHeight: 1
      }
    }, n), /*#__PURE__*/React.createElement("div", {
      style: {
        ...F.caps,
        color: INK,
        opacity: 0.45,
        marginTop: 10
      }
    }, l)))), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      onClick: onHome
    }, "Browse episodes")), /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 860,
        margin: "0 auto",
        padding: "0 48px"
      }
    }, /*#__PURE__*/React.createElement(Footer, null)));
  }
  window.MMSite = {
    Header,
    Footer,
    Home,
    EpisodePage,
    About,
    EPISODES
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/screens.jsx", error: String((e && e.message) || e) }); }

// uploads/main.js
try { (() => {
var currentPage = 0;
const totalHtmlFiles = 19;
function changePublication() {
  if (currentPage >= 0 && currentPage < totalHtmlFiles) {
    var currentPageUrl = document.getElementById("contentIFrame").src;
    currentPageUrl = currentPageUrl.substring(0, currentPageUrl.lastIndexOf("/") + 1);
    var nextPageUrl = currentPageUrl;
    if (currentPage !== 0) currentPageUrl = currentPageUrl + "publication-" + currentPage + ".html";else currentPageUrl = currentPageUrl + "publication" + ".html";
    document.getElementById("contentIFrame").src = currentPageUrl;
    if (currentPage + 1 < totalHtmlFiles) {
      nextPageUrl = nextPageUrl + "publication-" + (currentPage + 1) + ".html";
      document.getElementById("dummyIFrame").src = nextPageUrl;
    }
  }
}
function showNextPage() {
  ++currentPage;
  changePublication();
  showHideArrows();
}
function showPreviousPage() {
  --currentPage;
  changePublication();
  showHideArrows();
}
function showHideArrows() {
  if (currentPage === 0) {
    document.getElementsByClassName("prev")[0].style.visibility = "hidden";
  } else {
    document.getElementsByClassName("prev")[0].style.visibility = "visible";
  }
  if (currentPage === totalHtmlFiles - 1) {
    document.getElementsByClassName("next")[0].style.visibility = "hidden";
  } else {
    document.getElementsByClassName("next")[0].style.visibility = "visible";
  }
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "uploads/main.js", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.EyebrowLabel = __ds_scope.EyebrowLabel;

__ds_ns.Symbol = __ds_scope.Symbol;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.AudioBar = __ds_scope.AudioBar;

__ds_ns.EpisodeCard = __ds_scope.EpisodeCard;

__ds_ns.PATTERN_TILES = __ds_scope.PATTERN_TILES;

__ds_ns.PatternPanel = __ds_scope.PatternPanel;

__ds_ns.PlayButton = __ds_scope.PlayButton;

__ds_ns.PullQuote = __ds_scope.PullQuote;

})();
