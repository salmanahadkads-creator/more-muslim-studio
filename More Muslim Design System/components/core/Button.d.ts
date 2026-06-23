import * as React from "react";

/**
 * Props for the More Muslim button — uppercase, tracked, pill-shaped, single weight.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. Default "primary" (harvest fill). */
  variant?: "primary" | "solid" | "outline" | "ghost";
  /** Default "md". */
  size?: "sm" | "md" | "lg";
  /** Render as another element, e.g. "a". Default "button". */
  as?: "button" | "a";
  fullWidth?: boolean;
}

/** More Muslim button — uppercase, tracked, pill-shaped, single weight. */
export function Button(props: ButtonProps): JSX.Element;
