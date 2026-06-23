import React from "react";

/**
 * Small uppercase metadata tag — episode number, category, "New".
 * Hairline by default; `filled` for emphasis.
 */
export function Tag({ children, variant = "outline", style, ...rest }) {
  const variants = {
    outline: { background: "transparent", color: "var(--text-primary)", border: "1px solid var(--border-strong)" },
    filled: { background: "var(--more-harvest-yellow)", color: "var(--more-oak-brown)", border: "1px solid transparent" },
    ivory: { background: "var(--more-ivory-beige)", color: "var(--more-oak-brown)", border: "1px solid transparent" },
    mist:  { background: "var(--more-mist-blue)",   color: "var(--more-night-blue)", border: "1px solid transparent" },
  };
  return (
    <span
      style={{
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
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
