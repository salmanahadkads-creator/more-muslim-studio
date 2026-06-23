import React from "react";
import { PlayButton } from "./PlayButton.jsx";

function fmt(s) {
  if (s == null || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
}

/** Sticky-style audio player bar. Controlled progress (0–1) for mockups. */
export function AudioBar({ title, episode, progress = 0.33, duration = 2460, playing = false, onToggle, onSeek, style, ...rest }) {
  const cur = Math.round(progress * duration);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-5)",
        padding: "var(--space-4) var(--space-5)",
        background: "var(--surface-raised)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-card)",
        ...style,
      }}
      {...rest}
    >
      <PlayButton playing={playing} onClick={onToggle} size={48} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-4)", marginBottom: "var(--space-2)" }}>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-sm)", color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {episode && <span style={{ color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "var(--tracking-caps)", fontSize: "var(--text-2xs)", marginRight: "0.8em" }}>{episode}</span>}
            {title}
          </span>
        </div>
        <div
          onClick={(e) => {
            if (!onSeek) return;
            const rect = e.currentTarget.getBoundingClientRect();
            onSeek((e.clientX - rect.left) / rect.width);
          }}
          style={{ position: "relative", height: 4, borderRadius: 999, background: "var(--border-subtle)", cursor: onSeek ? "pointer" : "default" }}
        >
          <div style={{ position: "absolute", inset: 0, width: `${progress * 100}%`, background: "var(--accent)", borderRadius: 999 }} />
          <div style={{ position: "absolute", top: "50%", left: `${progress * 100}%`, width: 10, height: 10, marginLeft: -5, marginTop: -5, borderRadius: "50%", background: "var(--accent)" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "var(--space-2)", fontSize: "var(--text-2xs)", letterSpacing: "0.06em", color: "var(--text-primary)" }}>
          <span>{fmt(cur)}</span>
          <span>{fmt(duration)}</span>
        </div>
      </div>
    </div>
  );
}
