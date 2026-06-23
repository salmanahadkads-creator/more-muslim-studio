import React from "react";

/** Circular avatar for hosts / guests. Falls back to initials on a warm tint. */
export function Avatar({ src, name = "", size = 48, ring = false, style, ...rest }) {
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return (
    <span
      style={{
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
        ...style,
      }}
      {...rest}
    >
      {src ? (
        <img src={src} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        initials || "MM"
      )}
    </span>
  );
}
