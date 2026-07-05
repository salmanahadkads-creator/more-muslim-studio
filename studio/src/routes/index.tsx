import { ToolcraftApp } from "@/toolcraft/runtime/react";

import { appSchema } from "../app/app-schema";
import { exportPostImage } from "../app/export-post";
import { PostRenderer } from "../app/post-renderer";
import "../app/brand.css";

export function AppHome(): React.JSX.Element {
  return (
    <ToolcraftApp
      canvasContent={<PostRenderer />}
      className="h-dvh min-h-dvh"
      onPanelAction={({ action, state }) => {
        if (action.value === "export-png") {
          return exportPostImage(state);
        }
      }}
      renderDefaultCanvasMedia={false}
      schema={appSchema}
    />
  );
}
