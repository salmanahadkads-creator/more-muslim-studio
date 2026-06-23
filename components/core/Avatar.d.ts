import * as React from "react";

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string;
  /** Used for initials fallback and alt text. */
  name?: string;
  /** Pixel diameter. Default 48. */
  size?: number;
  /** Show a thin separator ring. */
  ring?: boolean;
}

/** Circular host/guest avatar with initials fallback. */
export function Avatar(props: AvatarProps): JSX.Element;
