/* More Muslim social post templates.
   Ported from the legacy studio (ui_kits/social/screens.jsx). Every template
   renders at its native output size (1080×1350 or 1080×1920) inside PostFrame;
   the caller scales it to the runtime canvas. Product text carries
   data-toolcraft-product-text so runtime export/copy rules apply. */

import * as React from "react";

import {
  COLOURWAYS,
  POST_SIZES,
  SYMBOLS,
  TEXT_WIDTH,
  type ColourwayKey,
  type PostFormat,
} from "./brand";
import {
  activeBlockIndex,
  breatheOpacity,
  firstName,
  groundMotion,
  groundState,
  highlightIndex,
  outroFadeAt,
  OUTRO_FADE_DELAYS,
  outroProgress,
  outroStartAt,
  wordVisual,
  type AudiogramMotionConfig,
  type AudiogramSpeechBlock,
} from "./audiogram-motion";
import type { Credit } from "./credits";

const CAPS_TRACKING = "0.165em";
const MARIST = '"ABC Marist", Georgia, serif';

export type PostTemplateKey =
  | "cover"
  | "quote"
  | "synopsis"
  | "streaming"
  | "credits"
  | "audiogram";

export type SceneProps = {
  grainSeed?: number;
  image?: string | null;
  imageFlipHorizontal?: boolean;
  imageFlipVertical?: boolean;
  imageOffsetX?: number;
  imageOffsetY?: number;
  /** 0–1 factor; below 1 the image fades into the colourway ground behind it,
   *  trading image presence for text legibility. */
  imageOpacity?: number;
  imageRotation?: number;
  imageZoom?: number;
  includeBackground?: boolean;
  pattern?: boolean;
};

type PostFrameProps = SceneProps & {
  children: React.ReactNode;
  format: PostFormat;
  padBottom?: number;
  padTop?: number;
  way: ColourwayKey;
};

function Grain({ opacity, seed = 7 }: { opacity: number; seed?: number }): React.JSX.Element {
  const id = React.useId().replace(/:/g, "");

  return (
    <svg
      aria-hidden="true"
      height="100%"
      style={{ inset: 0, mixBlendMode: "overlay", opacity, pointerEvents: "none", position: "absolute" }}
      width="100%"
    >
      <filter id={`mm-grain-${id}`}>
        <feTurbulence baseFrequency="0.9" numOctaves="2" seed={seed} stitchTiles="stitch" type="fractalNoise" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect filter={`url(#mm-grain-${id})`} height="100%" width="100%" />
    </svg>
  );
}

export function PostFrame({
  children,
  format,
  grainSeed,
  image = null,
  imageFlipHorizontal = false,
  imageFlipVertical = false,
  imageOffsetX = 50,
  imageOffsetY = 50,
  imageOpacity = 1,
  imageRotation = 0,
  imageZoom = 1,
  includeBackground = true,
  padBottom = 85,
  padTop = 85,
  pattern = true,
  way,
}: PostFrameProps): React.JSX.Element {
  const c = COLOURWAYS[way];
  const { h, w } = POST_SIZES[format];

  return (
    <div
      data-mm-post-frame=""
      style={{
        background: includeBackground ? c.bg : "transparent",
        color: c.ink,
        fontFamily: MARIST,
        height: h,
        lineHeight: 1.2,
        overflow: "hidden",
        position: "relative",
        width: w,
      }}
    >
      {includeBackground && image ? (
        <img
          alt=""
          src={image}
          style={{
            height: "100%",
            inset: 0,
            objectFit: "cover",
            objectPosition: `${imageOffsetX}% ${imageOffsetY}%`,
            opacity: imageOpacity,
            position: "absolute",
            transform: `scale(${imageZoom}) rotate(${imageRotation}deg) scale(${imageFlipHorizontal ? -1 : 1}, ${imageFlipVertical ? -1 : 1})`,
            transformOrigin: `${imageOffsetX}% ${imageOffsetY}%`,
            width: "100%",
          }}
        />
      ) : null}
      {includeBackground && !image && pattern && c.tile ? (
        <div
          aria-hidden="true"
          style={{
            backgroundImage: `url("${c.tile}")`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            inset: 0,
            opacity: c.tileOpacity,
            pointerEvents: "none",
            position: "absolute",
          }}
        />
      ) : null}
      {includeBackground && !image ? <Grain opacity={c.grain} seed={grainSeed} /> : null}
      <div
        style={{
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          inset: 0,
          padding: `${padTop}px 85px ${padBottom}px`,
          position: "absolute",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Eyebrow({
  editTarget,
  ink,
  text,
}: {
  editTarget?: string;
  ink: string;
  text: string;
}): React.JSX.Element {
  return (
    <div
      data-edit-target={editTarget}
      data-toolcraft-product-text=""
      style={{
        color: ink,
        fontSize: 32,
        letterSpacing: CAPS_TRACKING,
        overflow: "hidden",
        textAlign: "center",
        textOverflow: "ellipsis",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        width: "100%",
      }}
    >
      {text}
    </div>
  );
}

function FooterMark({
  label = "MOREMUSLIM.ORG",
  showSymbol = false,
  way,
}: {
  label?: string;
  showSymbol?: boolean;
  way: ColourwayKey;
}): React.JSX.Element {
  const c = COLOURWAYS[way];

  return (
    <div style={{ alignItems: "center", display: "flex", flexDirection: "column", gap: 28, marginTop: "auto" }}>
      {showSymbol ? <img alt="" src={SYMBOLS[c.logo]} style={{ height: 216, width: 216 }} /> : null}
      {label ? (
        <div
          data-toolcraft-product-text=""
          style={{ color: c.ink, fontSize: 32, letterSpacing: CAPS_TRACKING, textTransform: "uppercase", whiteSpace: "nowrap" }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
}

export type CoverValues = { episode: string; presents: string; title: string };

export function CoverPost({
  format,
  scene,
  values,
  way,
}: {
  format: PostFormat;
  scene: SceneProps;
  values: CoverValues;
  way: ColourwayKey;
}): React.JSX.Element {
  const c = COLOURWAYS[way];
  const isStory = format === "story";

  return (
    <PostFrame format={format} padBottom={isStory ? 370 : 85} padTop={isStory ? 370 : 85} way={way} {...scene}>
      <Eyebrow editTarget="content.cover.presents" ink={c.ink} text={values.presents} />
      <h1
        data-edit-target="content.cover.title"
        data-toolcraft-product-text=""
        style={{
          fontSize: 77,
          fontWeight: 400,
          letterSpacing: CAPS_TRACKING,
          margin: "36px auto 0",
          maxWidth: TEXT_WIDTH[format],
          textAlign: "center",
          textTransform: "uppercase",
        }}
      >
        {values.title}
      </h1>
      <div style={{ alignItems: "flex-end", display: "flex", marginTop: "auto", width: "100%" }}>
        <img
          alt=""
          src={SYMBOLS[c.logo]}
          style={{ flex: "none", height: 216, transform: "translate(-37px, 36px)", width: 216 }}
        />
        <div
          data-edit-target="content.episode"
          data-toolcraft-product-text=""
          style={{
            color: c.ink,
            flex: 1,
            fontSize: 32,
            letterSpacing: CAPS_TRACKING,
            textAlign: "center",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          {values.episode}
        </div>
        <div style={{ flex: "none", width: 216 }} />
      </div>
    </PostFrame>
  );
}

export type QuoteValues = {
  episode: string;
  exchanges: readonly { speaker: string; text: string }[];
};

export function QuotePost({
  format,
  scene,
  values,
  way,
}: {
  format: PostFormat;
  scene: SceneProps;
  values: QuoteValues;
  way: ColourwayKey;
}): React.JSX.Element {
  const c = COLOURWAYS[way];
  const isStory = format === "story";
  const exchanges = values.exchanges;

  return (
    <PostFrame format={format} padBottom={isStory ? 370 : 85} padTop={isStory ? 370 : 85} way={way} {...scene}>
      <div style={{ marginBottom: isStory ? 80 : 56 }}>
        <Eyebrow editTarget="content.episode" ink={c.ink} text={values.episode} />
      </div>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flex: 1,
          flexDirection: "column",
          gap: isStory ? 72 : 56,
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        {exchanges.map((exchange, index) => (
          <div
            key={index}
            style={{ alignItems: "center", display: "flex", flexDirection: "column", gap: isStory ? 48 : 20, width: "100%" }}
          >
            <div
              data-toolcraft-product-text=""
              style={{ fontSize: isStory ? 64 : 32, letterSpacing: CAPS_TRACKING, textTransform: "uppercase", whiteSpace: "nowrap" }}
            >
              {exchange.speaker}
            </div>
            <div
              data-toolcraft-product-text=""
              style={{
                fontSize: isStory ? 56 : 42,
                fontStyle: isStory ? "italic" : "normal",
                maxWidth: TEXT_WIDTH[format],
                textAlign: "center",
              }}
            >
              {exchange.text}
            </div>
          </div>
        ))}
      </div>
      <FooterMark way={way} />
    </PostFrame>
  );
}

export type SynopsisValues = { episode: string; paragraphs: readonly string[] };

export function SynopsisPost({
  format,
  scene,
  values,
  way,
}: {
  format: PostFormat;
  scene: SceneProps;
  values: SynopsisValues;
  way: ColourwayKey;
}): React.JSX.Element {
  const c = COLOURWAYS[way];
  const isStory = format === "story";
  const paragraphs = values.paragraphs;
  const totalLength = paragraphs.join("").length;
  const bodySize = totalLength > 200 ? 56 : 77;

  return (
    <PostFrame format={format} padBottom={isStory ? 370 : 85} padTop={isStory ? 370 : 85} way={way} {...scene}>
      <div style={{ marginBottom: 64, textAlign: "center" }}>
        <Eyebrow editTarget="content.episode" ink={c.ink} text={values.episode} />
      </div>
      <div style={{ display: "flex", flex: 1, flexDirection: "column", gap: 40, justifyContent: "center" }}>
        {paragraphs.map((paragraph, index) => (
          <p
            data-edit-index={index}
            data-edit-separator="\n\n"
            data-edit-target="content.synopsis.body"
            data-toolcraft-product-text=""
            key={index}
            style={{ fontSize: bodySize, margin: 0, maxWidth: TEXT_WIDTH[format], textWrap: "pretty" }}
          >
            {paragraph}
          </p>
        ))}
      </div>
      <div
        data-toolcraft-product-text=""
        style={{
          fontSize: 32,
          letterSpacing: CAPS_TRACKING,
          marginTop: 56,
          textAlign: "center",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        MOREMUSLIM.ORG
      </div>
    </PostFrame>
  );
}

export type StreamingValues = { episode: string; lines: readonly string[] };

export function NowStreamingPost({
  format,
  scene,
  values,
  way,
}: {
  format: PostFormat;
  scene: SceneProps;
  values: StreamingValues;
  way: ColourwayKey;
}): React.JSX.Element {
  const c = COLOURWAYS[way];
  const isStory = format === "story";
  const lines = values.lines;

  return (
    <PostFrame format={format} padBottom={isStory ? 370 : 85} padTop={isStory ? 370 : 85} way={way} {...scene}>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flex: 1,
          flexDirection: "column",
          gap: 48,
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <h2
          data-toolcraft-product-text=""
          style={{
            color: c.ink,
            fontSize: 56,
            fontWeight: 400,
            letterSpacing: CAPS_TRACKING,
            margin: "0 auto",
            maxWidth: TEXT_WIDTH[format],
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          {values.episode}
          <br />
          Now Streaming
        </h2>
        {lines.map((line, index) => (
          <p
            data-edit-index={index}
            data-edit-separator="\n"
            data-edit-target="content.streaming.lines"
            data-toolcraft-product-text=""
            key={index}
            style={{ fontSize: 56, margin: "0 auto", maxWidth: TEXT_WIDTH[format], textAlign: "center" }}
          >
            {line}
          </p>
        ))}
      </div>
      <FooterMark showSymbol way={way} />
    </PostFrame>
  );
}

export type CreditsValues = { credits: readonly Credit[]; episode: string };

export function CreditsPost({
  format,
  scene,
  values,
  way,
}: {
  format: PostFormat;
  scene: SceneProps;
  values: CreditsValues;
  way: ColourwayKey;
}): React.JSX.Element {
  const c = COLOURWAYS[way];
  const isStory = format === "story";
  const credits = values.credits;

  return (
    <PostFrame format={format} padBottom={isStory ? 370 : 85} padTop={isStory ? 370 : 85} way={way} {...scene}>
      <div style={{ marginBottom: 56, textAlign: "center" }}>
        <Eyebrow ink={c.ink} text="Episode Credits" />
      </div>
      <div style={{ alignItems: "center", display: "flex", flex: 1, justifyContent: "center" }}>
        <div data-toolcraft-product-text="" style={{ color: c.ink, fontSize: 32, textAlign: "center" }}>
          {credits.map((credit, index) => (
            <div key={index} style={{ lineHeight: 1.2, marginBottom: index < credits.length - 1 ? 48 : 0 }}>
              <div style={{ letterSpacing: CAPS_TRACKING, textTransform: "uppercase" }}>{credit.name}</div>
              {credit.title ? <div>{credit.title}</div> : null}
            </div>
          ))}
        </div>
      </div>
      <div
        data-toolcraft-product-text=""
        style={{
          fontSize: 32,
          letterSpacing: CAPS_TRACKING,
          marginTop: 40,
          textAlign: "center",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        {values.episode}
      </div>
    </PostFrame>
  );
}

export type AudiogramMotionProps = {
  blocks: readonly AudiogramSpeechBlock[];
  config: AudiogramMotionConfig;
  durationSeconds: number;
  envelope: Float32Array | null;
  episode: string;
  guest: string;
  outroLines: readonly string[];
  timeSeconds: number;
};

/* One textured (pattern/solid) ground layer with the slow push-in + pan
   (feature 10), the audio-envelope breathing tile (feature 3), and the living
   grain overlay (feature 4). Illustration grounds take the image path instead. */
function AudiogramGround({
  config,
  envelope,
  opacity,
  timeSeconds,
  durationSeconds,
  way,
}: {
  config: AudiogramMotionConfig;
  envelope: Float32Array | null;
  opacity: number;
  timeSeconds: number;
  durationSeconds: number;
  way: ColourwayKey;
}): React.JSX.Element {
  const c = COLOURWAYS[way];
  const move = groundMotion(config, timeSeconds, durationSeconds);
  const patternOpacity = breatheOpacity(config, envelope, timeSeconds);
  const showTile = !config.solid && !!c.tile;

  return (
    <div style={{ background: c.bg, inset: 0, opacity, position: "absolute" }}>
      <div
        style={{
          inset: 0,
          position: "absolute",
          transform: `scale(${move.scale}) translate(${move.tx.toFixed(2)}px, ${move.ty.toFixed(2)}px)`,
          transformOrigin: "center",
          willChange: "transform",
        }}
      >
        {showTile ? (
          <div
            aria-hidden="true"
            style={{
              backgroundImage: `url("${c.tile}")`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              inset: 0,
              opacity: c.tileOpacity * patternOpacity,
              position: "absolute",
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

/* Timeline-synced audiogram slide (story format) with the full design-dynamics
   motion system: speaker ground crossfade, breathing pattern, active-word
   accent, pull-quote highlight, ground pan / Ken Burns, and the staggered fade
   outro. Every value is a pure function of timeSeconds so the live preview and
   the offline export stay frame-identical. */
export function AudiogramPost({
  motion,
  scene,
  way,
}: {
  motion: AudiogramMotionProps;
  scene: SceneProps;
  way: ColourwayKey;
}): React.JSX.Element {
  const { blocks, config, durationSeconds, envelope, episode, guest, timeSeconds } = motion;
  const hasImage = !!scene.image;
  const ground = groundState(blocks, guest, config, timeSeconds);
  const activeIndex = activeBlockIndex(blocks, timeSeconds);
  const active = activeIndex >= 0 ? blocks[activeIndex] : null;
  const highlight = highlightIndex(blocks, config);
  const isHighlight = highlight >= 0 && activeIndex === highlight;

  const contentEnd = blocks.length ? blocks[blocks.length - 1].end : 0;
  const outroStart = outroStartAt(durationSeconds, contentEnd);
  const outroProg = outroProgress(timeSeconds, outroStart);
  const chromeOp = (1 - outroProg) * (isHighlight ? 0.35 : 1);

  const ink = ground.ink;
  const accent = ground.accent;
  const captionSize = Math.round((isHighlight ? 82 : 69) * Math.max(0.1, config.captionScale));
  const outroWay = config.hostWay;
  const outroColour = COLOURWAYS[outroWay];

  const words = active?.words ?? [];
  const speakerLabel = active ? firstName(active.speaker) : "";
  const outroLines = motion.outroLines;

  return (
    <div
      data-mm-post-frame=""
      style={{
        // Base fill behind the full-cover ground layers; it tracks the current
        // speaker's settled ground so the crossfade (rendered by the layers) is
        // never seen against a stale base.
        background: hasImage ? COLOURWAYS[way].bg : COLOURWAYS[ground.curWay].bg,
        color: ink,
        fontFamily: MARIST,
        height: POST_SIZES.story.h,
        lineHeight: 1,
        overflow: "hidden",
        position: "relative",
        width: POST_SIZES.story.w,
      }}
    >
      {scene.includeBackground ? (
        hasImage ? (
          <img
            alt=""
            src={scene.image ?? undefined}
            style={{
              height: "100%",
              inset: 0,
              objectFit: "cover",
              objectPosition: `${scene.imageOffsetX ?? 50}% ${scene.imageOffsetY ?? 50}%`,
              opacity: scene.imageOpacity ?? 1,
              position: "absolute",
              transform: `scale(${(scene.imageZoom ?? 1) * groundMotion(config, timeSeconds, durationSeconds).scale}) rotate(${scene.imageRotation ?? 0}deg) scale(${scene.imageFlipHorizontal ? -1 : 1}, ${scene.imageFlipVertical ? -1 : 1})`,
              transformOrigin: `${scene.imageOffsetX ?? 50}% ${scene.imageOffsetY ?? 50}%`,
              width: "100%",
            }}
          />
        ) : (
          <>
            {ground.k < 1 ? (
              <AudiogramGround
                config={config}
                durationSeconds={durationSeconds}
                envelope={envelope}
                opacity={1}
                timeSeconds={timeSeconds}
                way={ground.prevWay}
              />
            ) : null}
            <AudiogramGround
              config={config}
              durationSeconds={durationSeconds}
              envelope={envelope}
              opacity={ground.k}
              timeSeconds={timeSeconds}
              way={ground.curWay}
            />
          </>
        )
      ) : null}

      {/* Active caption */}
      <div
        style={{
          alignItems: isHighlight ? "center" : "flex-start",
          bottom: 460,
          display: "flex",
          flexDirection: "column",
          justifyContent: isHighlight ? "center" : "flex-start",
          left: 86,
          pointerEvents: "none",
          position: "absolute",
          right: 86,
          top: 460,
        }}
      >
        {active ? (
          <div style={{ color: ink, textAlign: isHighlight ? "center" : "left", width: isHighlight ? "100%" : "auto" }}>
            {config.speakerSwap === false || isHighlight || !speakerLabel ? null : (
              <div
                data-toolcraft-product-text=""
                style={{ color: accent, fontSize: 32, letterSpacing: "0.165em", marginBottom: 28, textTransform: "uppercase" }}
              >
                {speakerLabel}
              </div>
            )}
            <div
              data-audiogram-caption=""
              data-toolcraft-product-text=""
              style={{
                fontSize: captionSize,
                fontStyle: isHighlight ? "italic" : "normal",
                lineHeight: 1.06,
                margin: isHighlight ? "0 auto" : 0,
                maxWidth: isHighlight ? 880 : TEXT_WIDTH.story,
              }}
            >
              {words.map((word, index) => {
                const nextStart = index < words.length - 1 ? words[index + 1].start : active.end;
                const visual = wordVisual(word, nextStart, timeSeconds, ink, accent, config.wordAccent);

                // Every word stays in the DOM (opacity carries the entrance) so
                // the full caption is present for copy/accessibility even before
                // it is spoken; the export skips fully-transparent words. A real
                // space text node separates words so the caption reads as words,
                // not a run-on string, in copy and tests.
                return (
                  <React.Fragment key={index}>
                    <span
                      style={{
                        color: visual.color,
                        display: "inline-block",
                        opacity: visual.opacity,
                      }}
                    >
                      {word.text}
                    </span>{" "}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>

      {/* Footer mark */}
      <div
        data-toolcraft-product-text=""
        style={{
          bottom: 370,
          color: ink,
          fontSize: 32,
          left: 0,
          letterSpacing: CAPS_TRACKING,
          opacity: chromeOp,
          position: "absolute",
          right: 0,
          textAlign: "center",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        MOREMUSLIM.ORG
      </div>

      {/* Staggered fade outro */}
      {outroProg > 0 ? (
        <div style={{ inset: 0, opacity: outroProg, position: "absolute" }}>
          {scene.includeBackground ? (
            <AudiogramGround
              config={{ ...config, hasImage: false }}
              durationSeconds={durationSeconds}
              envelope={envelope}
              opacity={1}
              timeSeconds={timeSeconds}
              way={outroWay}
            />
          ) : null}
          <div
            style={{
              alignItems: "center",
              color: outroColour.ink,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "center",
              padding: "0 130px",
              position: "relative",
              textAlign: "center",
            }}
          >
            <div
              data-toolcraft-product-text=""
              style={{ fontSize: 56, letterSpacing: "0.165em", lineHeight: 1.16, opacity: outroFadeAt(timeSeconds, outroStart, OUTRO_FADE_DELAYS.title), textTransform: "uppercase" }}
            >
              {episode}
              <br />
              Now Streaming
            </div>
            {outroLines.map((line, index) => (
              <div
                data-toolcraft-product-text=""
                key={index}
                style={{
                  fontSize: 48,
                  lineHeight: 1.2,
                  marginTop: index === 0 ? 140 : 90,
                  maxWidth: 860,
                  opacity: outroFadeAt(
                    timeSeconds,
                    outroStart,
                    OUTRO_FADE_DELAYS.line1 + index * 0.4,
                  ),
                }}
              >
                {line}
              </div>
            ))}
            <img
              alt=""
              src={SYMBOLS[outroColour.logo]}
              style={{
                height: 190,
                marginTop: 150,
                opacity: outroFadeAt(
                  timeSeconds,
                  outroStart,
                  OUTRO_FADE_DELAYS.line1 + outroLines.length * 0.4,
                ),
                width: 190,
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
