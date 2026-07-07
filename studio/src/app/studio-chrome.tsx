/* Studio app chrome rendered as a sibling overlay to ToolcraftApp — route
   navigation only (no runtime surfaces). The "New post" pill re-enters the
   onboarding wizard, matching the legacy studio's Setup wizard entry point. */

import { useNavigate } from "@tanstack/react-router";

export function StudioChrome(): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => void navigate({ to: "/setup" })}
      style={{
        backdropFilter: "blur(24px) saturate(1.5)",
        background: "color-mix(in oklab, var(--popover) 82%, transparent)",
        border: "1px solid color-mix(in oklab, var(--border) 60%, transparent)",
        borderRadius: "var(--radius)",
        color: "var(--foreground)",
        cursor: "pointer",
        fontSize: 12,
        left: 14,
        letterSpacing: "0.14em",
        padding: "9px 16px",
        position: "fixed",
        textTransform: "uppercase",
        top: 14,
        WebkitBackdropFilter: "blur(24px) saturate(1.5)",
        zIndex: 45,
      }}
      title="Start a new post with the guided setup"
      type="button"
    >
      ✦ New post
    </button>
  );
}
