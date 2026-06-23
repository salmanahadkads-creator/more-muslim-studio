import * as React from "react";

/**
 * Editorial episode card — white content panel + full-bleed image.
 * Desktop: content left, image right. Mobile: image top, content below.
 */
export interface EpisodeCardProps extends React.HTMLAttributes<HTMLElement> {
  /** e.g. "06 Mar 2026" */
  date?: string;
  number?: number | string;
  /** Season label. Default "S1". */
  season?: string;
  /** e.g. "49:39" */
  duration?: string;
  title: React.ReactNode;
  description?: string;
  /** Full-bleed editorial image URL. */
  image?: string;
  /** Switch to mobile stacked layout (image top, content below). Default false. */
  mobile?: boolean;
  onPlay?: () => void;
  onTranscript?: () => void;
}

/**
 * Editorial episode card — white content panel + full-bleed image.
 */
export function EpisodeCard(props: EpisodeCardProps): JSX.Element;
