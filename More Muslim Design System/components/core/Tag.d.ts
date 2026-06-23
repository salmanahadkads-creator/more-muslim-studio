import * as React from "react";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Default "outline". */
  variant?: "outline" | "filled" | "ivory" | "mist";
}

/** Small uppercase metadata tag (episode number, category, "New"). */
export function Tag(props: TagProps): JSX.Element;
