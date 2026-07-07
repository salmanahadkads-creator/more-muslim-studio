import type { ToolcraftCanvasSize } from "./types";

export type ToolcraftCanvasAspectRatioPresetValue = "4:5" | "9:16";

export type ToolcraftCanvasAspectRatioPreset = {
  height: number;
  label: string;
  ratioHeight: number;
  ratioWidth: number;
  value: ToolcraftCanvasAspectRatioPresetValue;
  width: number;
};

/* More Muslim ships exactly two Instagram output formats: the 4:5 feed post and
   the 9:16 story. */
export const toolcraftCanvasAspectRatioPresets = [
  { height: 1350, label: "Post (4:5)", ratioHeight: 5, ratioWidth: 4, value: "4:5", width: 1080 },
  { height: 1920, label: "Story (9:16)", ratioHeight: 16, ratioWidth: 9, value: "9:16", width: 1080 },
] as const satisfies readonly ToolcraftCanvasAspectRatioPreset[];

export const toolcraftCanvasAspectRatioPresetValues = new Set<string>(
  toolcraftCanvasAspectRatioPresets.map((preset) => preset.value),
);

export function getToolcraftCanvasAspectRatioPreset(
  value: string,
): ToolcraftCanvasAspectRatioPreset | null {
  return (
    toolcraftCanvasAspectRatioPresets.find((preset) => preset.value === value) ?? null
  );
}

export function getToolcraftCanvasAspectRatioPresetBySize(
  size: ToolcraftCanvasSize,
): ToolcraftCanvasAspectRatioPreset | null {
  return (
    toolcraftCanvasAspectRatioPresets.find(
      (preset) => preset.width === size.width && preset.height === size.height,
    ) ?? null
  );
}
