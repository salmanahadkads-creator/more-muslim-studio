import React from "react";

/**
 * Primary action control. One typeface, no bold — emphasis comes from fill,
 * uppercase tracking and size. Calm hover (colour deepen) and press (slight
 * darken), no scale bounce.
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  as = "button",
  fullWidth = false,
  style,
  ...rest
}) {
  const sizes = {
    sm: { padding: "8px 16px", fontSize: "var(--text-xs)", letterSpacing: "var(--tracking-caps)" },
    md: { padding: "12px 24px", fontSize: "var(--text-sm)", letterSpacing: "var(--tracking-caps)" },
    lg: { padding: "16px 34px", fontSize: "var(--text-base)", letterSpacing: "var(--tracking-caps)" },
  };

  const variants = {
    primary: {
      background: "var(--more-harvest-yellow)",
      color: "var(--more-oak-brown)",
      border: "1px solid transparent",
    },
    solid: {
      background: "var(--more-ivory-beige)",
      color: "var(--more-oak-brown)",
      border: "1px solid transparent",
    },
    outline: {
      background: "transparent",
      color: "var(--text-primary)",
      border: "1px solid var(--border-strong)",
    },
    ghost: {
      background: "transparent",
      color: "var(--text-primary)",
      border: "1px solid transparent",
    },
  };

  const Tag = as;
  return (
    <Tag
      className={`mm-btn mm-btn--${variant}`}
      style={{
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
        ...style,
      }}
      {...rest}
    >
      {children}
      <style>{`
        .mm-btn:hover { opacity: 0.92; }
        .mm-btn--primary:hover { background: var(--more-oak-brown); color: var(--more-ivory-beige); opacity: 1; }
        .mm-btn--outline:hover, .mm-btn--ghost:hover { background: var(--border-subtle); opacity: 1; }
        .mm-btn:active { transform: translateY(1px); }
        .mm-btn:focus-visible { outline: 2px solid var(--focus-ring); outline-offset: 2px; }
        .mm-btn:disabled { opacity: 0.45; cursor: not-allowed; }
      `}</style>
    </Tag>
  );
}
