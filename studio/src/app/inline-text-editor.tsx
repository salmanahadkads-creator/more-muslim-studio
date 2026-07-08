/* Double-click any tagged product text on the preview to edit it in place.
   Editable text elements carry data-edit-target (the runtime value key they
   feed). Multi-part fields (synopsis paragraphs, streaming lines) also carry
   data-edit-index and data-edit-separator so the full value can be rebuilt from
   every part on commit. Renders nothing — it wires native listeners on the
   preview and writes edits back through controls.setValue. */

import * as React from "react";

import { useToolcraft } from "@/toolcraft/runtime/react";

export function InlineTextEditor(): null {
  const { dispatch } = useToolcraft();
  const dispatchRef = React.useRef(dispatch);

  dispatchRef.current = dispatch;

  React.useEffect(() => {
    const slide = document.getElementById("mm-post-slide");

    if (!slide) {
      return;
    }

    let editing: HTMLElement | null = null;

    const commit = (cancel: boolean) => {
      const element = editing;

      if (!element) {
        return;
      }

      editing = null;
      element.removeAttribute("contenteditable");
      element.style.removeProperty("outline");
      element.style.removeProperty("cursor");
      element.style.removeProperty("min-width");

      const target = element.dataset.editTarget;

      if (cancel || !target) {
        // Discard: the renderer re-paints from unchanged runtime state.
        element.textContent = element.dataset.editOriginal ?? element.textContent;
        return;
      }

      const separator = element.dataset.editSeparator;

      if (element.dataset.editIndex !== undefined && separator) {
        // Multi-part field: rebuild the whole value from every rendered part.
        const parts = [
          ...slide.querySelectorAll<HTMLElement>(`[data-edit-target="${target}"]`),
        ]
          .sort(
            (a, b) => Number(a.dataset.editIndex ?? 0) - Number(b.dataset.editIndex ?? 0),
          )
          .map((part) => (part === element ? readText(element) : readText(part)));

        dispatchRef.current({
          historyGroup: "inline-edit",
          target,
          type: "controls.setValue",
          value: parts.join(separator === "\\n\\n" ? "\n\n" : "\n"),
        });
        return;
      }

      dispatchRef.current({
        historyGroup: "inline-edit",
        target,
        type: "controls.setValue",
        value: readText(element),
      });
    };

    const onDoubleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const element = target?.closest<HTMLElement>("[data-edit-target]");

      if (!element || element === editing) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      commit(false);

      editing = element;
      element.dataset.editOriginal = element.textContent ?? "";
      element.setAttribute("contenteditable", "plaintext-only");
      element.style.outline = "2px solid var(--foreground, #fff)";
      element.style.cursor = "text";
      element.style.minWidth = "1ch";
      element.focus();

      const selection = window.getSelection();
      const range = document.createRange();

      range.selectNodeContents(element);
      selection?.removeAllRanges();
      selection?.addRange(range);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!editing) {
        return;
      }

      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        editing.blur();
      } else if (event.key === "Escape") {
        event.preventDefault();
        commit(true);
      }
    };

    const onBlur = () => commit(false);

    // The runtime captures pointerdown for canvas pan (preventDefault +
    // setPointerCapture), which would cancel the contenteditable focus/caret.
    // Stop it before the runtime's root-delegated handler for any editable
    // text so the double-click can focus and place the caret.
    const onPointerDown = (event: PointerEvent) => {
      if ((event.target as HTMLElement | null)?.closest("[data-edit-target]")) {
        event.stopPropagation();
      }
    };

    slide.addEventListener("dblclick", onDoubleClick);
    slide.addEventListener("keydown", onKeyDown);
    slide.addEventListener("blur", onBlur, true);
    slide.addEventListener("pointerdown", onPointerDown, { capture: true });

    return () => {
      slide.removeEventListener("dblclick", onDoubleClick);
      slide.removeEventListener("keydown", onKeyDown);
      slide.removeEventListener("blur", onBlur, true);
      slide.removeEventListener("pointerdown", onPointerDown, { capture: true });
    };
  }, []);

  return null;
}

function readText(element: HTMLElement): string {
  return (element.textContent ?? "").replace(/\s+/g, " ").trim();
}
