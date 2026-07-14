/* One credit on the Episode credits slide. Credits are stored as structured
   {name, title} entries (target: content.credits.list) so names that contain
   hyphens or dashes ("Yassmin Abdel-Magied") can never be mis-split by a
   delimiter parser. */
export type Credit = { name: string; title: string };

function readCreditEntry(entry: unknown): Credit | null {
  if (typeof entry !== "object" || entry === null) {
    return null;
  }

  const record = entry as Record<string, unknown>;
  const name = typeof record.name === "string" ? record.name.trim() : "";
  const title = typeof record.title === "string" ? record.title.trim() : "";

  if (!name && !title) {
    return null;
  }

  return { name, title };
}

/* Legacy sessions persisted credits as "Name — Role" lines. Split on an
   em dash, colon, or pipe anywhere, or on a hyphen only when it is spaced
   (" - ") — a bare hyphen inside a name must never act as the delimiter. */
function parseLegacyCreditLine(line: string): Credit {
  const match = line.match(/^(.*?)\s*[—:|]\s*(.+)$/) ?? line.match(/^(.+?)\s+-\s+(.+)$/);

  return match
    ? { name: match[1].trim(), title: match[2].trim() }
    : { name: line, title: "" };
}

export function readCredits(value: unknown): Credit[] {
  if (Array.isArray(value)) {
    return value
      .map(readCreditEntry)
      .filter((credit): credit is Credit => credit !== null);
  }

  if (typeof value === "string") {
    return value
      .split(/\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map(parseLegacyCreditLine);
  }

  return [];
}

/* Editor-side read: same shapes as readCredits, but keeps fully-empty rows so
   a just-added credit stays visible while both boxes are blank, and does NOT
   trim — trimming per keystroke would eat the space the user just typed
   between words. The slide renderers use readCredits, which trims and drops
   empties. */
export function readCreditsDraft(value: unknown): Credit[] {
  if (Array.isArray(value)) {
    return value.map((entry) => {
      const record =
        typeof entry === "object" && entry !== null
          ? (entry as Record<string, unknown>)
          : {};

      return {
        name: typeof record.name === "string" ? record.name : "",
        title: typeof record.title === "string" ? record.title : "",
      };
    });
  }

  return readCredits(value);
}
