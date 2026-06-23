// Caption-story shared logic — used by the live template here AND meant to be
// lifted verbatim into the Claude Code (Remotion) render pipeline.
// Pure functions, no DOM, no DS imports.

// ---- Brand colourways (mirrors ui_kits/social WAYS) + illustration grounds ----
export const WAYS = {
  beige:   { bg: "#FBF2E9", tile: "6A",  ink: "#511C14", logo: "oak",   grain: 0.06, tileOpacity: 0.10 },
  oak:     { bg: "#511C14", tile: "6B",  ink: "#F6E1C6", logo: "beige", grain: 0.10, tileOpacity: 0.15 },
  night:   { bg: "#192136", tile: "5C",  ink: "#F6E1C6", logo: "beige", grain: 0.10, tileOpacity: 0.15 },
  mist:    { bg: "#9FBCCC", tile: "2B",  ink: "#192136", logo: "night", grain: 0.07, tileOpacity: 0.10 },
  black:   { bg: "#000000", tile: null,  ink: "#FBF2E9", logo: "beige", grain: 0.14, tileOpacity: 0    },
  therapy: { bg: "#192136", isImage: true, image: "../../assets/imagery/illus-therapy.jpg",   ink: "#F6E1C6", logo: "beige" },
  cover:   { bg: "#511C14", isImage: true, image: "../../assets/imagery/cover-sheikhagpt.jpg", ink: "#F6E1C6", logo: "beige" },
};

// ---- The episode transcript (Descript SRT export) ----
export const DEFAULT_SRT = `1
00:00:00,000 --> 00:00:01,650
Yassmin Abdel-Magied: Do you remember
the first time you heard about

2
00:00:01,650 --> 00:00:03,590
people using chatbots as therapists?

3
00:00:03,770 --> 00:00:04,380
Dr. Rania Awaad: I do.

4
00:00:04,410 --> 00:00:05,699
Yeah, it was actually a patient of mine.

5
00:00:05,760 --> 00:00:08,580
And she said, in between our
sessions, um, I talked to a

6
00:00:08,590 --> 00:00:10,290
chatbot and I said, come again?

7
00:00:10,540 --> 00:00:11,389
Like what, what's going on?

8
00:00:12,410 --> 00:00:15,779
Yassmin Abdel-Magied: Dr. Rania Awad
runs the Muslim mental health and

9
00:00:15,780 --> 00:00:17,549
Islamic psychology lab at Stanford.

10
00:00:17,859 --> 00:00:19,709
And she's the president of Maristan.

11
00:00:19,740 --> 00:00:23,380
Dr. Rania Awaad: Which is a nonprofit
organization dedicated to educating

12
00:00:23,450 --> 00:00:27,190
and clinically serving the Muslim
mental health needs of our communities.

13
00:00:27,630 --> 00:00:30,450
Yassmin Abdel-Magied: And one day, when a
patient of hers walks in and says they've

14
00:00:30,450 --> 00:00:33,580
been using an AI chatbot for therapy.

15
00:00:33,580 --> 00:00:36,055
Dr. Rania Awaad: I started wondering:
is this going to be the end of us?

16
00:00:37,095 --> 00:00:39,025
Psychiatrists and psychologists?

17
00:00:39,905 --> 00:00:40,225
No!

18
00:00:40,574 --> 00:00:44,364
Like, what is the point of all of
these years of training and, you

19
00:00:44,364 --> 00:00:47,635
know, learning how to have that
therapeutic ear and actually help?

20
00:00:47,815 --> 00:00:50,705
13 years of school…
to be replaced by an AI?

21
00:00:50,715 --> 00:00:50,885
No!

22
00:00:54,425 --> 00:00:57,765
Yassmin Abdel-Magied: But then something
made Rania begin to see a world in which

23
00:00:57,965 --> 00:01:03,595
AI and Islamic understandings of mental
health might be able to come together?
`;

// ---- Parse SRT into cues with speaker carry + prefix stripping ----
export function parseSRT(text) {
  const norm = String(text).replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
  const chunks = norm.split(/\n\s*\n/);
  const cues = [];
  for (const ch of chunks) {
    const lines = ch.split("\n").filter((l) => l.trim() !== "");
    if (lines.length < 2) continue;
    const ti = lines.findIndex((l) => /-->/.test(l));
    if (ti < 0) continue;
    const tm = lines[ti].match(
      /(\d{2}):(\d{2}):(\d{2})[,.](\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})[,.](\d{3})/
    );
    if (!tm) continue;
    const start = +tm[1] * 3600 + +tm[2] * 60 + +tm[3] + +tm[4] / 1000;
    const end = +tm[5] * 3600 + +tm[6] * 60 + +tm[7] + +tm[8] / 1000;
    let txt = lines.slice(ti + 1).join(" ").replace(/\s+/g, " ").trim();
    let speaker = null;
    const sm = txt.match(/^([^:]{1,40}):\s+/);
    if (sm) {
      const cand = sm[1].trim();
      const words = cand.split(/\s+/);
      const looksName = words.length <= 4 && words.every((w) => /^[A-Z]/.test(w));
      if (looksName) {
        speaker = cand;
        txt = txt.slice(sm[0].length);
      }
    }
    cues.push({ start, end, text: txt, speaker });
  }
  return cues;
}

// ---- First name for the speaker label (strip titles) ----
export function firstName(s) {
  if (!s) return "";
  const n = s.replace(/^(dr|mr|mrs|ms|prof|sheikh|sheikha|imam)\.?\s+/i, "");
  return (n.trim().split(/\s+/)[0] || "").replace(/[^\w'-].*$/, "");
}

// ---- Word-level timing (interpolate within each cue by token length) ----
export function toWords(cues) {
  let speaker = null;
  const words = [];
  for (const c of cues) {
    if (c.speaker) speaker = c.speaker;
    const toks = c.text.split(/\s+/).filter(Boolean);
    if (!toks.length) continue;
    const weights = toks.map((t) => t.length + 1);
    const total = weights.reduce((a, b) => a + b, 0) || 1;
    let acc = 0;
    for (let i = 0; i < toks.length; i++) {
      const s = c.start + (acc / total) * (c.end - c.start);
      acc += weights[i];
      const e = c.start + (acc / total) * (c.end - c.start);
      words.push({ text: toks[i], start: s, end: e, speaker });
    }
  }
  return words;
}

// ---- Segment words into blocks: clear at sentence-end (. ! ?) or speaker change ----
export function buildBlocks(cues) {
  const words = toWords(cues);
  const blocks = [];
  let cur = null;
  for (const w of words) {
    if (!cur || cur.speaker !== w.speaker) {
      cur = { speaker: w.speaker, words: [], start: w.start, end: w.end };
      blocks.push(cur);
    }
    cur.words.push({ text: w.text, start: w.start });
    cur.end = w.end;
    // Sentence end on . ! ? (NOT the ellipsis char "…"); allow trailing quotes.
    if (/[.!?]["')\]]*$/.test(w.text)) cur = null;
  }
  return blocks;
}

// ---- Ordered unique speakers (first appearance = host, second = guest) ----
export function speakerOrder(blocks) {
  const seen = [];
  for (const b of blocks) if (b.speaker && !seen.includes(b.speaker)) seen.push(b.speaker);
  return seen;
}
