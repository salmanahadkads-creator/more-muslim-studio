import * as React from "react";

export interface EyebrowLabelProps extends React.HTMLAttributes<HTMLElement> {
  /** Colour role. Default "accent". */
  tone?: "accent" | "primary" | "secondary" | "muted";
  as?: keyof JSX.IntrinsicElements;
}

/** Uppercase, wide-tracked kicker label (episode eyebrows, sign-offs). */
export function EyebrowLabel(props: EyebrowLabelProps): JSX.Element;
