import * as React from "react";

export interface PlayButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  playing?: boolean;
  /** Diameter in px. Default 56. */
  size?: number;
  /** Accessible label override. */
  label?: string;
}

/** Circular play / pause control in harvest yellow. */
export function PlayButton(props: PlayButtonProps): JSX.Element;
