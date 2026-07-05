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

const CAPS_TRACKING = "0.165em";
const MARIST = '"ABC Marist", Georgia, serif';

export type PostTemplateKey =
  | "cover"
  | "quote"
  | "synopsis"
  | "streaming"
  | "credits";

export type SceneProps = {
  grainSeed?: number;
  image?: string | null;
  imageFlipHorizontal?: boolean;
  imageFlipVertical?: boolean;
  imageOffsetX?: number;
  imageOffsetY?: number;
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

function Eyebrow({ ink, text }: { ink: string; text: string }): React.JSX.Element {
  return (
    <div
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
      <Eyebrow ink={c.ink} text={values.presents} />
      <h1
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
        <Eyebrow ink={c.ink} text={values.episode} />
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
        <Eyebrow ink={c.ink} text={values.episode} />
      </div>
      <div style={{ display: "flex", flex: 1, flexDirection: "column", gap: 40, justifyContent: "center" }}>
        {paragraphs.map((paragraph, index) => (
          <p
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

export type CreditsValues = { credits: string; episode: string };

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
  const credits = values.credits
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^(.*?)\s*[—:|-]\s*(.+)$/);

      return match
        ? { name: match[1].trim(), title: match[2].trim() }
        : { name: line, title: "" };
    });

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
