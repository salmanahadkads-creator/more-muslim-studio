import * as React from "react";

export interface PullQuoteProps extends React.HTMLAttributes<HTMLElement> {
  /** Speaker / source line, shown uppercase below the quote. */
  cite?: React.ReactNode;
  /** Auto-wrap a string child in curly quotes. Default true. */
  marks?: boolean;
  align?: "left" | "center";
  size?: "md" | "lg" | "xl";
}

/** Large italic serif pull-quote with optional attribution. */
export function PullQuote(props: PullQuoteProps): JSX.Element;
