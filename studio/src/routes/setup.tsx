/* Guided onboarding for the studio — the Toolcraft port of the legacy
   wizard (ui_kits/social/onboarding.html). Styled to match the minimal
   Toolcraft chrome: dark surfaces, ABC Diatype, the runtime CSS variables so
   it tracks the active theme. Collects what the user is making, the episode,
   and the scene, then opens the studio with prefill search params that
   SetupPrefill applies to runtime state. App chrome only — no runtime
   surfaces are recreated here. */

import * as React from "react";
import { useNavigate } from "@tanstack/react-router";

import {
  COLOURWAY_KEYS,
  COLOURWAYS,
  EPISODE_ILLUSTRATIONS,
  type ColourwayKey,
} from "../app/brand";
import "../app/brand.css";

type WizardMode = "post" | "carousel" | "audiogram";
type WizardScene = "pattern" | "solid" | "illustration";

const surface = "color-mix(in oklab, var(--popover) 96%, transparent)";
const subtleBorder = "color-mix(in oklab, var(--border) 60%, transparent)";

const label: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
};

function OptionCard({
  description,
  onSelect,
  selected,
  title,
}: {
  description: string;
  onSelect: () => void;
  selected: boolean;
  title: string;
}): React.JSX.Element {
  return (
    <button
      aria-pressed={selected}
      onClick={onSelect}
      style={{
        background: selected
          ? "color-mix(in oklab, var(--foreground) 8%, var(--popover))"
          : surface,
        border: `1px solid ${selected ? "var(--foreground)" : subtleBorder}`,
        borderRadius: "var(--radius)",
        color: "var(--foreground)",
        cursor: "pointer",
        padding: "22px 20px",
        textAlign: "left",
        transition: "border-color 0.12s, background 0.12s",
      }}
      type="button"
    >
      <span style={{ display: "block", fontSize: 17, fontWeight: 500, marginBottom: 8 }}>
        {title}
      </span>
      <span
        style={{
          color: "var(--muted-foreground)",
          display: "block",
          fontSize: 13,
          lineHeight: 1.55,
        }}
      >
        {description}
      </span>
    </button>
  );
}

export function SetupWizard(): React.JSX.Element {
  const navigate = useNavigate();
  const [step, setStep] = React.useState(0);
  const [mode, setMode] = React.useState<WizardMode>("post");
  const [episode, setEpisode] = React.useState<string>("ep1");
  const [scene, setScene] = React.useState<WizardScene>("pattern");
  const [way, setWay] = React.useState<ColourwayKey>("night");

  const openStudio = () =>
    void navigate({ search: { episode, mode, scene, way } as never, to: "/" });
  const skip = () => void navigate({ search: { mode: "skip" } as never, to: "/" });

  const questions = [
    "What are you making?",
    "Which episode?",
    "Set the scene",
    "Ready",
  ];

  const pill = (active: boolean): React.CSSProperties => ({
    ...label,
    background: active
      ? "color-mix(in oklab, var(--foreground) 10%, var(--popover))"
      : "transparent",
    border: `1px solid ${active ? "var(--foreground)" : subtleBorder}`,
    borderRadius: "var(--radius)",
    color: "var(--foreground)",
    cursor: "pointer",
    padding: "9px 14px",
  });

  return (
    <div
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        overflowY: "auto",
      }}
    >
      <header
        style={{
          alignItems: "center",
          borderBottom: `1px solid ${subtleBorder}`,
          display: "flex",
          justifyContent: "space-between",
          padding: "20px 40px",
        }}
      >
        <span style={{ ...label, fontWeight: 500 }}>More Muslim — Studio Setup</span>
        <button onClick={skip} style={pill(false)} type="button">
          Skip setup →
        </button>
      </header>

      <main
        style={{ margin: "0 auto", maxWidth: 760, padding: "56px 32px 96px", width: "100%" }}
      >
        <div style={{ ...label, color: "var(--muted-foreground)", marginBottom: 14 }}>
          Step {step + 1} of {questions.length}
        </div>
        <h1
          style={{ fontSize: 30, fontWeight: 500, letterSpacing: "-0.01em", marginBottom: 36 }}
        >
          {questions[step]}
        </h1>

        {step === 0 ? (
          <div
            style={{
              display: "grid",
              gap: 10,
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            }}
          >
            <OptionCard
              description="Start from any single layout and build freely."
              onSelect={() => setMode("post")}
              selected={mode === "post"}
              title="Single post"
            />
            <OptionCard
              description="A full launch set — cover, synopsis, credits, and now-streaming slides."
              onSelect={() => setMode("carousel")}
              selected={mode === "carousel"}
              title="New episode"
            />
            <OptionCard
              description="A caption-synced video clip for Stories and Reels."
              onSelect={() => setMode("audiogram")}
              selected={mode === "audiogram"}
              title="Audiogram"
            />
          </div>
        ) : null}

        {step === 1 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[{ label: "General post (no specific episode)", value: "general" }]
              .concat(
                EPISODE_ILLUSTRATIONS.map((entry) => ({
                  label: entry.label,
                  value: entry.value,
                })),
              )
              .map((option) => {
                const active = episode === option.value;

                return (
                  <button
                    aria-pressed={active}
                    key={option.value}
                    onClick={() => setEpisode(option.value)}
                    style={{
                      alignItems: "center",
                      background: active
                        ? "color-mix(in oklab, var(--foreground) 8%, var(--popover))"
                        : surface,
                      border: `1px solid ${active ? "var(--foreground)" : subtleBorder}`,
                      borderRadius: "var(--radius)",
                      color: "var(--foreground)",
                      cursor: "pointer",
                      display: "flex",
                      fontSize: 15,
                      gap: 14,
                      padding: "13px 16px",
                      textAlign: "left",
                      width: "100%",
                    }}
                    type="button"
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        background: active ? "var(--foreground)" : "transparent",
                        border: `1.5px solid ${
                          active ? "var(--foreground)" : "var(--muted-foreground)"
                        }`,
                        borderRadius: "50%",
                        flex: "none",
                        height: 14,
                        width: 14,
                      }}
                    />
                    {option.label}
                  </button>
                );
              })}
          </div>
        ) : null}

        {step === 2 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <div style={{ display: "flex", gap: 8 }}>
              {(["pattern", "solid", "illustration"] as const).map((option) => (
                <button
                  aria-pressed={scene === option}
                  key={option}
                  onClick={() => setScene(option)}
                  style={pill(scene === option)}
                  type="button"
                >
                  {option === "pattern"
                    ? "Colour pattern"
                    : option === "solid"
                      ? "Solid colour"
                      : "Episode illustration"}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {COLOURWAY_KEYS.map((key) => (
                <button
                  aria-label={COLOURWAYS[key].label}
                  aria-pressed={way === key}
                  key={key}
                  onClick={() => setWay(key)}
                  style={{
                    background: COLOURWAYS[key].bg,
                    border:
                      way === key
                        ? "2px solid var(--foreground)"
                        : `1px solid ${subtleBorder}`,
                    borderRadius: "var(--radius)",
                    cursor: "pointer",
                    height: 52,
                    width: 52,
                  }}
                  title={COLOURWAYS[key].label}
                  type="button"
                />
              ))}
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <dl
            style={{
              border: `1px solid ${subtleBorder}`,
              borderRadius: "var(--radius)",
              margin: 0,
              overflow: "hidden",
            }}
          >
            {[
              [
                "Format",
                mode === "post"
                  ? "Single post"
                  : mode === "carousel"
                    ? "New episode carousel"
                    : "Audiogram",
              ],
              [
                "Episode",
                episode === "general"
                  ? "General post"
                  : (EPISODE_ILLUSTRATIONS.find((entry) => entry.value === episode)?.label ??
                    episode),
              ],
              [
                "Scene",
                `${
                  scene === "pattern"
                    ? "Star-lattice pattern"
                    : scene === "solid"
                      ? "Solid colour"
                      : "Episode illustration"
                } · ${COLOURWAYS[way].label}`,
              ],
            ].map(([key, value], index) => (
              <div
                key={key}
                style={{
                  background: surface,
                  borderTop: index === 0 ? "none" : `1px solid ${subtleBorder}`,
                  display: "flex",
                  gap: 20,
                  padding: "16px 18px",
                }}
              >
                <dt
                  style={{
                    ...label,
                    color: "var(--muted-foreground)",
                    minWidth: 92,
                    paddingTop: 2,
                  }}
                >
                  {key}
                </dt>
                <dd style={{ fontSize: 15, margin: 0 }}>{value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40 }}>
          <button
            onClick={() => setStep((current) => Math.max(0, current - 1))}
            style={{
              ...label,
              background: "transparent",
              border: "none",
              color: "var(--muted-foreground)",
              cursor: "pointer",
              opacity: step === 0 ? 0 : 1,
              padding: "12px 0",
              pointerEvents: step === 0 ? "none" : "auto",
            }}
            type="button"
          >
            ← Back
          </button>
          <button
            onClick={() => (step < 3 ? setStep((current) => current + 1) : openStudio())}
            style={{
              ...label,
              background: "var(--foreground)",
              border: "none",
              borderRadius: "var(--radius)",
              color: "var(--background)",
              cursor: "pointer",
              padding: "13px 26px",
            }}
            type="button"
          >
            {step < 3 ? "Continue →" : "Open Studio →"}
          </button>
        </div>
      </main>
    </div>
  );
}
