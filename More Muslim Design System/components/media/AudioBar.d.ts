import * as React from "react";

export interface AudioBarProps extends React.HTMLAttributes<HTMLDivElement> {
  title: React.ReactNode;
  /** Eyebrow, e.g. "S1 · E7". */
  episode?: string;
  /** 0–1 playback fraction. */
  progress?: number;
  /** Total seconds. Default 2460 (41 min). */
  duration?: number;
  playing?: boolean;
  onToggle?: () => void;
  /** Receives a 0–1 fraction on scrub click. */
  onSeek?: (fraction: number) => void;
}

/** Podcast player bar — play control, scrubber and timecodes. */
export function AudioBar(props: AudioBarProps): JSX.Element;
