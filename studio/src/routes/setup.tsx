/* Guided onboarding for the studio — the Toolcraft port of the legacy
   wizard (ui_kits/social/onboarding.html). Collects what the user is making,
   the episode, and the scene, then opens the studio with prefill search
   params that SetupPrefill applies to runtime state. App chrome only: no
   runtime surfaces are recreated here. */

import * as React from "react";
import { useNavigate } from "@tanstack/react-router";

import {
  COLOURWAY_KEYS,
  COLOURWAYS,
  EPISODE_ILLUSTRATIONS,
  type ColourwayKey,
} from "../app/brand";
import "../app/brand.css";

const OAK = "#511C14";
const MARIST = '"ABC Marist", Georgia, serif';
const DIATYPE = '"ABC Diatype", -apple-system, sans-serif';

type WizardMode = "post" | "carousel" | "audiogram";
type WizardScene = "pattern" | "solid" | "illustration";

const capsLabel: React.CSSProperties = {
  fontFamily: DIATYPE,
  fontSize: 12,
  letterSpacing: "0.165em",
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
      onClick={onSelect}
      style={{
        background: selected ? OAK : "rgba(246,225,198,0.5)",
        border: "none",
        color: selected ? "#F6E1C6" : OAK,
        cursor: "pointer",
        fontFamily: MARIST,
        padding: "32px 28px",
        textAlign: "left",
      }}
      type="button"
    >
      <span style={{ display: "block", fontSize: 28, marginBottom: 10 }}>{title}</span>
      <span
        style={{
          display: "block",
          fontFamily: DIATYPE,
          fontSize: 14,
          lineHeight: 1.6,
          opacity: 0.75,
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

  const openStudio = () => {
    void navigate({
      search: { episode, mode, scene, way } as never,
      to: "/",
    });
  };

  const skip = () => void navigate({ search: { mode: "skip" } as never, to: "/" });

  const questions = ["What are you making?", "Which episode?", "Set the scene.", "Ready."];

  return (
    <div
      style={{
        background: "rgba(246,225,198,0.4)",
        color: OAK,
        display: "flex",
        flexDirection: "column",
        fontFamily: MARIST,
        height: "100dvh",
        overflowY: "auto",
      }}
    >
      <header
        style={{
          alignItems: "center",
          borderBottom: "1px solid rgba(81,28,20,0.1)",
          display: "flex",
          justifyContent: "space-between",
          padding: "24px 48px",
        }}
      >
        <span style={{ ...capsLabel, fontWeight: 500 }}>More Muslim — Studio Setup</span>
        <button
          onClick={skip}
          style={{
            ...capsLabel,
            background: "transparent",
            border: "1px solid rgba(81,28,20,0.18)",
            color: "rgba(81,28,20,0.55)",
            cursor: "pointer",
            padding: "9px 16px",
          }}
          type="button"
        >
          Skip setup →
        </button>
      </header>

      <main style={{ margin: "0 auto", maxWidth: 860, padding: "56px 32px 80px", width: "100%" }}>
        <h1 style={{ fontSize: 46, fontWeight: 400, lineHeight: 1.05, marginBottom: 40 }}>
          {questions[step]}
        </h1>

        {step === 0 ? (
          <div
            style={{
              background: "rgba(81,28,20,0.1)",
              display: "grid",
              gap: 1,
              gridTemplateColumns: "1fr 1fr 1fr",
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
          <div style={{ borderTop: "1px solid rgba(81,28,20,0.1)" }}>
            {[{ label: "General post (no specific episode)", value: "general" }].concat(
              EPISODE_ILLUSTRATIONS.map((entry) => ({
                label: entry.label,
                value: entry.value,
              })),
            ).map((option) => (
              <button
                key={option.value}
                onClick={() => setEpisode(option.value)}
                style={{
                  alignItems: "center",
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid rgba(81,28,20,0.1)",
                  color: OAK,
                  cursor: "pointer",
                  display: "flex",
                  fontFamily: MARIST,
                  fontSize: 19,
                  gap: 16,
                  padding: "15px 4px",
                  textAlign: "left",
                  width: "100%",
                }}
                type="button"
              >
                <span
                  aria-hidden="true"
                  style={{
                    background: episode === option.value ? OAK : "transparent",
                    border: "1.5px solid rgba(81,28,20,0.35)",
                    borderRadius: "50%",
                    display: "inline-block",
                    flex: "none",
                    height: 16,
                    width: 16,
                  }}
                />
                {option.label}
              </button>
            ))}
          </div>
        ) : null}

        {step === 2 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <div style={{ display: "flex", gap: 8 }}>
              {(["pattern", "solid", "illustration"] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => setScene(option)}
                  style={{
                    ...capsLabel,
                    background: scene === option ? OAK : "transparent",
                    border: "1px solid rgba(81,28,20,0.2)",
                    color: scene === option ? "#F6E1C6" : OAK,
                    cursor: "pointer",
                    padding: "10px 18px",
                  }}
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
                  key={key}
                  onClick={() => setWay(key)}
                  style={{
                    background: COLOURWAYS[key].bg,
                    border:
                      way === key ? `3px solid ${OAK}` : "1px solid rgba(81,28,20,0.2)",
                    cursor: "pointer",
                    height: 56,
                    width: 56,
                  }}
                  title={COLOURWAYS[key].label}
                  type="button"
                />
              ))}
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <dl style={{ borderTop: "1px solid rgba(81,28,20,0.1)", fontSize: 20, margin: 0 }}>
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
            ].map(([key, value]) => (
              <div
                key={key}
                style={{
                  borderBottom: "1px solid rgba(81,28,20,0.1)",
                  display: "flex",
                  gap: 24,
                  padding: "18px 0",
                }}
              >
                <dt style={{ ...capsLabel, minWidth: 110, opacity: 0.55, paddingTop: 4 }}>
                  {key}
                </dt>
                <dd style={{ margin: 0 }}>{value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 48,
          }}
        >
          <button
            onClick={() => setStep((current) => Math.max(0, current - 1))}
            style={{
              ...capsLabel,
              background: "transparent",
              border: "none",
              color: OAK,
              cursor: "pointer",
              opacity: step === 0 ? 0 : 1,
              padding: "12px 0",
              pointerEvents: step === 0 ? "none" : "auto",
            }}
            type="button"
          >
            ← Back
          </button>
          {step < 3 ? (
            <button
              onClick={() => setStep((current) => current + 1)}
              style={{
                ...capsLabel,
                background: OAK,
                border: "none",
                color: "#F6E1C6",
                cursor: "pointer",
                padding: "14px 28px",
              }}
              type="button"
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={openStudio}
              style={{
                ...capsLabel,
                background: OAK,
                border: "none",
                color: "#F6E1C6",
                cursor: "pointer",
                padding: "14px 28px",
              }}
              type="button"
            >
              Open Studio →
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
