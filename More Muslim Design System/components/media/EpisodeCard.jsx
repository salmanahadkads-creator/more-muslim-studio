import React from "react";

var INACTIVE = "color-mix(in srgb, var(--more-oak-brown) 40%, transparent)";

/**
 * Editorial episode card.
 * desktop (default): white content panel left, full-bleed image right.
 * mobile: image stacked on top, content panel below.
 */
export function EpisodeCard(props) {
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
    lineHeight: 1.2,
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
    textAlign: "center",
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
    alignSelf: "center",
  };

  var bodyStyle = {
    margin: 0,
    fontSize: "1rem",
    lineHeight: 1.125,
    letterSpacing: "0.2px",
    color: "var(--more-oak-brown)",
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
    justifyContent: "center",
  };

  var contentStyle = {
    background: "var(--more-white)",
    padding: "var(--space-7)",
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-5)",
    flex: 1,
  };

  var meta = React.createElement("div", { style: metaStyle },
    React.createElement("span", null, date),
    React.createElement("span", null, season + " E" + number),
    React.createElement("span", null, duration)
  );

  var playBtn = React.createElement("button", { onClick: onPlay, style: playBtnStyle },
    "\u25B6 Play Episode"
  );

  var body = description
    ? React.createElement("p", { style: bodyStyle }, description)
    : null;

  var cta = React.createElement("a", { onClick: onTranscript, style: ctaStyle },
    "Transcript & Credits \u2192"
  );

  var content = React.createElement("div", { style: contentStyle },
    meta,
    React.createElement("h2", { style: titleStyle }, title),
    playBtn,
    body,
    cta
  );

  var imgPanel = image
    ? React.createElement("div", {
        style: { flex: "0 0 58%", overflow: "hidden", background: "var(--more-night-blue)" }
      },
        React.createElement("img", {
          src: image, alt: "",
          style: { width: "100%", height: "100%", objectFit: "cover", display: "block" }
        })
      )
    : null;

  if (mobile) {
    var mobileImgPanel = image
      ? React.createElement("div", {
          style: { width: "100%", aspectRatio: "4/3", overflow: "hidden", background: "var(--more-night-blue)" }
        },
          React.createElement("img", {
            src: image, alt: "",
            style: { width: "100%", height: "100%", objectFit: "cover", display: "block" }
          })
        )
      : null;

    return React.createElement("article", {
      style: Object.assign({
        background: "var(--more-white)",
        borderRadius: "var(--radius-card)",
        overflow: "hidden",
      }, style)
    }, mobileImgPanel, content);
  }

  return React.createElement("article", {
    style: Object.assign({
      display: "flex",
      background: "var(--more-ivory-beige)",
      borderRadius: "var(--radius-card)",
      overflow: "hidden",
    }, style)
  },
    React.createElement("div", { style: { flex: "0 0 42%", display: "flex" } }, content),
    imgPanel
  );
}
