/* Custom control for "Highlight line" (target: audiogram.highlightLine).
   A plain number slider can only ask "which line, by index?" — the client
   needs to SEE the actual caption wording to recognise the line, and to fix a
   typo without re-exporting captions. This renders every parsed caption block
   as its real text; clicking a line selects it as the highlight, and editing
   the text writes a correction that survives independently of the uploaded
   SRT file (see audiogram-motion.ts applyBlockTextOverrides).

   IMPORTANT: the controls panel invokes custom renderers as a plain function
   call (`CustomControl({...})`), not as a JSX element — there is no real
   component boundary, so this function must never call a React hook itself
   (its calls would inline into the PANEL's hook sequence and break as soon as
   this control's visibility — and therefore whether it runs at all — differs
   between renders, e.g. "Rendered more hooks than during the previous
   render."). <TextInput> below is safe because it IS rendered via JSX. */
"use client";

import type { ToolcraftMediaAsset } from "@/toolcraft/runtime";
import type { ToolcraftCustomControlRenderer } from "@/toolcraft/runtime/react";
import { ControlFieldLabel, Field, TextInput } from "@/toolcraft/ui";

import { blockText, buildSpeechBlocks, type AudiogramSpeechBlock } from "./audiogram-motion";
import { decodeCaptionAsset, readBlockOverrides } from "./post-renderer";
import { parseSrt } from "./srt";

function readCaptionBlocks(mediaAssets: readonly ToolcraftMediaAsset[]): AudiogramSpeechBlock[] {
  const asset = mediaAssets.find((entry) => entry.sourceTarget === "audiogram.captions");

  if (!asset) {
    return [];
  }

  return buildSpeechBlocks(parseSrt(decodeCaptionAsset(asset.dataUrl)));
}

export const AudiogramHighlightPicker: ToolcraftCustomControlRenderer = ({
  dispatch,
  name,
  state,
  setValue,
  value,
}) => {
  const blocks = readCaptionBlocks(state.mediaAssets);
  const overrides = readBlockOverrides(state.values["audiogram.blockOverrides"]);
  const selectedLine = typeof value === "number" ? value : 1;

  if (blocks.length === 0) {
    return (
      <Field className="gap-2">
        <ControlFieldLabel>{name}</ControlFieldLabel>
        <p className="text-xs text-[color:var(--muted-foreground)]">
          Upload captions above to choose and edit a highlight line.
        </p>
      </Field>
    );
  }

  return (
    <Field className="gap-2">
      <ControlFieldLabel>{name}</ControlFieldLabel>
      <div className="flex flex-col gap-1">
        {blocks.map((block, index) => {
          const lineNumber = index + 1;
          const isSelected = selectedLine === lineNumber;
          const text = overrides[index] ?? blockText(block);

          return (
            <div
              className={
                isSelected
                  ? "rounded-md border border-[color:var(--primary)] bg-[color:color-mix(in_oklab,var(--primary)_8%,transparent)] px-1.5 py-1"
                  : "rounded-md border border-transparent px-1.5 py-1"
              }
              data-selected={isSelected}
              key={index}
              // Selecting is "start interacting with this line" — clicking to
              // place a cursor for a typo fix also picks it as the highlight,
              // matching how the client actually works (fix the line you meant).
              onMouseDown={() => {
                if (!isSelected) {
                  setValue(lineNumber);
                }
              }}
            >
              <TextInput
                name={block.speaker || `Line ${lineNumber}`}
                onValueChange={(nextText) => {
                  dispatch({
                    target: "audiogram.blockOverrides",
                    type: "controls.setValue",
                    value: { ...overrides, [index]: nextText },
                  });
                }}
                showLabel={false}
                value={text}
              />
            </div>
          );
        })}
      </div>
    </Field>
  );
};
