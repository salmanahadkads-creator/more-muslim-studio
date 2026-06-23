import * as React from "react";

export interface SymbolProps extends React.SVGAttributes<SVGSVGElement> {
  /** Pixel size of the square mark. Default 32. */
  size?: number;
  /** Optional explicit colour (otherwise inherits `currentColor`). */
  color?: string;
  /** Accessible label. Omit for purely decorative use. */
  title?: string;
}

/** The More Muslim 8-point star mark. Inline SVG, colour via `currentColor`. */
export function Symbol(props: SymbolProps): JSX.Element;
