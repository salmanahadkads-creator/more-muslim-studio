/* Custom control for "Highlight lines" (target: audiogram.highlightLine).
   A plain number slider can only ask "which line, by index?" — the client
   needs to SEE the actual caption wording to recognise a line, to pin ONE OR
   MANY lines as large pull-quotes, and to fix a typo without re-exporting
   captions. This renders every parsed caption block as its real text; the
   star toggle on each row adds/removes it from the highlight set, and editing
   the text writes a correction that survives independently of the uploaded
   SRT file (see audiogram-motion.ts applyBlockTextOverrides).

   Selection is stored as an array of 1-based line numbers (a legacy single
   number is still read). See readHighlightLines in post-renderer.ts.

   IMPORTANT: the controls panel invokes custom renderers as a plain function
   call (`CustomControl({...})`), not as a JSX element — there is no real
   component boundary, so this function must never call a React hook itself
   (its calls would inline into the PANEL's hook sequence and break as soon as
   this control's visibility — and therefore whether it runs at all — differs
   between renders, e.g. "Rendered more hooks than during the previous
   render."). <TextInput> and <Button> below are safe because they ARE
   rendered via JSX. */
"use client";

import { StarIcon } from "@phosphor-icons/react";

import type { ToolcraftMediaAsset } from "@/toolcraft/runtime";
import type { ToolcraftCustomControlRenderer } from "@/toolcraft/runtime/react";
import { Button, ControlFieldLabel, Field, TextInput } from "@/toolcraft/ui";

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

/* Current selection as a Set of 1-based line numbers (accepts a legacy single
   number). */
function readSelectedLineNumbers(value: unknown): Set<number> {
  const raw = Array.isArray(value)
    ? value
    : typeof value === "number"
      ? [value]
      : [];

  return new Set(
    raw.filter((entry): entry is number => typeof entry === "number" && Number.isFinite(entry)),
  );
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
  const selected = readSelectedLineNumbers(value);

  if (blocks.length === 0) {
    return (
      <Field className="gap-2">
        <ControlFieldLabel>{name}</ControlFieldLabel>
        <p className="text-xs text-[color:var(--muted-foreground)]">
          Upload captions above to choose and edit highlight lines.
        </p>
      </Field>
    );
  }

  const toggleLine = (lineNumber: number) => {
    const next = new Set(selected);

    if (next.has(lineNumber)) {
      next.delete(lineNumber);
    } else {
      next.add(lineNumber);
    }

    setValue([...next].sort((first, second) => first - second));
  };

  return (
    <Field className="gap-2">
      <ControlFieldLabel>{name}</ControlFieldLabel>
      <p className="text-xs text-[color:var(--muted-foreground)]">
        Star one or more lines to render them as large pull-quotes.
      </p>
      <div className="flex flex-col gap-1">
        {blocks.map((block, index) => {
          const lineNumber = index + 1;
          const isSelected = selected.has(lineNumber);
          const original = blockText(block);
          const override = overrides[index];
          // A correction recorded against different wording (a re-uploaded
          // SRT) is stale: show and edit the pristine line instead.
          const text = override && override.from === original ? override.to : original;

          return (
            <div
              className={
                isSelected
                  ? "flex items-center gap-1 rounded-md border border-[color:var(--primary)] bg-[color:color-mix(in_oklab,var(--primary)_8%,transparent)] px-1.5 py-1"
                  : "flex items-center gap-1 rounded-md border border-transparent px-1.5 py-1"
              }
              data-selected={isSelected}
              key={index}
            >
              <Button
                aria-label={
                  isSelected
                    ? `Remove line ${lineNumber} from highlights`
                    : `Add line ${lineNumber} to highlights`
                }
                aria-pressed={isSelected}
                onClick={() => toggleLine(lineNumber)}
                size="icon-sm"
                type="button"
                variant={isSelected ? "default" : "ghost"}
              >
                <StarIcon weight={isSelected ? "fill" : "regular"} />
              </Button>
              <div className="min-w-0 flex-1">
                <TextInput
                  name={block.speaker || `Line ${lineNumber}`}
                  // Forward TextInput's live-typing history meta so one typing
                  // burst merges into one undo entry instead of one per keystroke.
                  onValueChange={(nextText, meta) => {
                    dispatch({
                      history: meta?.history,
                      historyGroup: meta?.historyGroup,
                      target: "audiogram.blockOverrides",
                      type: "controls.setValue",
                      value: { ...overrides, [index]: { from: original, to: nextText } },
                    });
                  }}
                  showLabel={false}
                  value={text}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Field>
  );
};
