import React from "react";

/**
 * The signature uppercase, wide-tracked label used for episode eyebrows,
 * section kickers and sign-offs (e.g. "EPISODE 7: IN THERAPY").
 */
export function EyebrowLabel({ children, tone = "accent", as = "div", style, ...rest }) {
  const tones = {
    accent: "var(--accent)",
    primary: "var(--text-primary)",
  };
  const Tag = as;
  return (
    <Tag
      style={{
        fontFamily: "var(--font-serif)",
        fontSize: "var(--text-xs)",
        textTransform: "uppercase",
        letterSpacing: "var(--tracking-caps)",
        lineHeight: 1.3,
        color: tones[tone] || tones.accent,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
