import React from "react";

/** Large italic serif pull-quote — the brand's signature editorial device. */
export function PullQuote({ children, cite, marks = true, align = "left", size = "lg", style, ...rest }) {
  const sizes = {
    md: { fontSize: "var(--text-xl)",  lineHeight: "var(--leading-display-xs)" },
    lg: { fontSize: "var(--text-2xl)", lineHeight: "var(--leading-display-xs)" },
    xl: { fontSize: "var(--text-3xl)", lineHeight: "var(--leading-display-sm)" },
  };
  const text = marks && typeof children === "string" ? `\u201C${children}\u201D` : children;
  return (
    <figure style={{ margin: 0, textAlign: align, ...style }} {...rest}>
      <blockquote
        style={{
          margin: 0,
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontSize: sizes[size].fontSize,
          lineHeight: sizes[size].lineHeight,
          color: "var(--text-primary)",
          textWrap: "pretty",
        }}
      >
        {text}
      </blockquote>
      {cite && (
        <figcaption
          style={{
            marginTop: "var(--space-4)",
            fontStyle: "normal",
            fontSize: "var(--text-xs)",
            textTransform: "uppercase",
            letterSpacing: "var(--tracking-caps)",
            color: "var(--text-primary)",
          }}
        >
          {cite}
        </figcaption>
      )}
    </figure>
  );
}
