import React from "react";

/** Circular play / pause control. Calm hover (warm deepen), gentle press. */
export function PlayButton({ playing = false, size = 56, label, style, onClick, ...rest }) {
  const r = size;
  return (
    <button
      onClick={onClick}
      aria-label={label || (playing ? "Pause" : "Play")}
      className="mm-play"
      style={{
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
        ...style,
      }}
      {...rest}
    >
      <svg width={size * 0.4} height={size * 0.4} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        {playing ? (
          <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
        ) : (
          <path d="M8 5.2v13.6a.8.8 0 0 0 1.22.68l10.6-6.8a.8.8 0 0 0 0-1.36L9.22 4.52A.8.8 0 0 0 8 5.2z" />
        )}
      </svg>
      <style>{`
        .mm-play:hover { background: var(--more-oak-brown); color: var(--more-ivory-beige); }
        .mm-play:active { transform: scale(0.96); }
        .mm-play:focus-visible { outline: 2px solid var(--focus-ring); outline-offset: 3px; }
      `}</style>
    </button>
  );
}
