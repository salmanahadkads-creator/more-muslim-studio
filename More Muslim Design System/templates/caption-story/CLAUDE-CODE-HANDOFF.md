# Caption Story → MP4 Render Pipeline (Claude Code handoff)

This package turns the **More Muslim "Caption Story" audiogram template** (designed and
approved in Claude Design) into a **repeatable 4K / 60fps MP4 renderer** for Instagram.

Input: an `audio.mp3` (any length).
Output: `out/<name>.mp4` — 2160×3840, 60fps, word-by-word captions on the brand ground,
speaker colourways, and a "Now Streaming" outro. Ready to post to Reels/Stories.

---

## 1. What's already built (don't rebuild — port it)

In Claude Design we built and approved the **visual + motion source of truth**:

- `templates/caption-story/CaptionStory.dc.html` — the live, audio-synced template. This is
  the canonical look: layout, type scale, colourways, speaker switching, outro, cover frames,
  drift, tint, safe areas. **Treat its `renderVals()` as the rendering spec** — every frame is
  a pure function of `(currentTime, props)`, which is exactly what Remotion needs.
- `templates/caption-story/captions.js` — **pure, framework-free** SRT→words→blocks logic plus
  the `WAYS` colourway map. **Lift this file verbatim** into the Remotion project; the live
  template and the renderer must share it so they never drift.

The design decisions locked with the client (carry these into the renderer's defaults):

| Decision | Value |
|---|---|
| Format | 9:16 vertical, **2160×3840**, **60fps** |
| Captions | Word-by-word, **building blocks** that clear at sentence end (`. ! ?`) |
| Caption type | ABC Marist, **left-aligned**, slightly above optical center |
| Caption size | `auto` / `L` (77px@1080 → 154px@2160) / `M` (56→112) |
| Word motion | `fade` (0.18s fade+rise) or `cut` |
| Speakers | Two-ground mode: **host = Beige, guest = Oak** (or single ground; label optional) |
| Speaker label | First name, caps, 0.165em tracking |
| Disfluencies | **Verbatim** (keep "um", repeats) |
| Punctuation | **As transcribed** |
| Grounds | beige · oak · night · mist · black · therapy(img) · cover(img); illustrations get optional tint + zoom/crop |
| Bg motion | gentle drift / parallax |
| Outro (5s) | "EPISODE 7 / NOW STREAMING" + listen line + podcast line + symbol; audio fades out over last 1s |
| Cover frame | optional, from a social template (cover / synopsis) |
| IG safe areas | top 120 / bottom 250 / right 130 (px@1080) kept clear |

---

## 2. Pipeline stages

```
audio.mp3
  └─(a) transcribe + diarize ─→ transcript.srt   (Whisper + diarization)
  └─(b) optional waveform     ─→ (N/A — client chose no waveform)
        │
        ▼
  transcript.srt ──(c) captions.js: parseSRT → toWords → buildBlocks → speakerOrder
        │
        ▼
  Remotion <CaptionStory> composition (port of renderVals)
        │
        └─(d) remotion render ─→ out/<name>.mp4   (2160×3840 @60fps, h264, yuv420p)
```

### (a) Transcribe + auto-diarize — REQUIRED (client picked "audio only")

The client will provide **audio only**; the pipeline must produce words, timing, AND speaker
labels. Whisper gives words+timing but **not** speakers, so add diarization:

- **Recommended:** [`whisperX`](https://github.com/m-bain/whisperX) — Whisper + word-level
  alignment + `pyannote` diarization in one pass, emits per-word speaker tags. Best quality and
  it gives true word timing (better than our length-interpolation fallback).
- Alt: `faster-whisper` for transcription + `pyannote/speaker-diarization-3.1` separately, then
  assign each word to the overlapping speaker turn.

Diarization yields `SPEAKER_00 / SPEAKER_01`, not names. Map them to names with a tiny config
(first speaker → host name, second → guest), since the client knows who's who per episode:

```jsonc
// episode.json
{
  "name": "in-therapy-ep7",
  "episodeEyebrow": "IN THERAPY, WITH SHEIKHAGPT",
  "speakers": { "SPEAKER_00": "Yassmin Abdel-Magied", "SPEAKER_01": "Dr. Rania Awaad" },
  "groundMode": "two", "hostWay": "beige", "guestWay": "oak",
  "outroEpisode": "EPISODE 7", "outroWay": "night", "outroDuration": 5
}
```

Emit a Descript-style SRT (speaker name prefix on the line, e.g. `Dr. Rania Awaad: ...`) so it
feeds straight into the **unchanged** `parseSRT` from `captions.js`. If whisperX gives true
per-word stamps, also emit a `words.json` and skip `toWords`'s interpolation — wire `buildBlocks`
to consume real stamps (one-line change; see §4).

> If true word timing isn't available, `captions.js#toWords` interpolates within each cue by
> token length — already good enough for the building-block reveal, and what the live template uses.

### (d) Render

Remotion composition mirrors `renderVals()`. Because each frame is `f(t, props)` with **no CSS
transitions relied on for correctness** (transitions are cosmetic; base opacity is always right),
it renders deterministically frame-accurate. Crossfades between speaker grounds should be
re-implemented as **interpolated opacity over a 0.4s window around each speaker change** (compute
from block boundaries) rather than CSS `transition`, so they're frame-exact.

---

## 3. Project layout to scaffold

```
caption-story-renderer/
├─ package.json
├─ remotion.config.ts
├─ src/
│  ├─ Root.tsx                # registerRoot; <Composition> 2160×3840 @60fps
│  ├─ CaptionStory.tsx        # PORT of CaptionStory.dc.html renderVals()
│  ├─ captions.js             # COPIED VERBATIM from templates/caption-story/
│  ├─ ground.tsx              # PatternPanel/illustration ground (port from DS)
│  └─ fonts.ts                # ABC Marist @font-face (copy assets/fonts/*.otf)
├─ assets/                    # symbol-*.svg, illus-therapy.jpg, cover-sheikhagpt.jpg, patterns
├─ pipeline/
│  ├─ transcribe.py           # whisperX → episode.srt (+ words.json)
│  └─ render.sh               # transcribe → remotion render → out/<name>.mp4
└─ inputs/
   └─ <name>/audio.mp3 + episode.json
```

`render.sh`:
```bash
#!/usr/bin/env bash
set -euo pipefail
NAME="$1"                                  # inputs/<NAME>/
python pipeline/transcribe.py "inputs/$NAME/audio.mp3" \
  --out "inputs/$NAME/episode.srt" --diarize
npx remotion render src/Root.tsx CaptionStory \
  "out/$NAME.mp4" \
  --props="inputs/$NAME/episode.json" \
  --codec=h264 --crf=18 --pixel-format=yuv420p \
  --frames-per-second=60 --scale=1
# 2160×3840 set in the Composition; --scale keeps it native 4K.
```

Remotion `<Composition>`: `width={2160} height={3840} fps={60}`,
`durationInFrames = Math.ceil((audioDuration + outroDuration) * 60)`.
Use `<Audio src={staticFile('audio.mp3')} />` with a volume ramp to 0 over the final 60 frames.

---

## 4. Porting `renderVals()` → `CaptionStory.tsx` (the only real work)

Everything is already expressed in `CaptionStory.dc.html`. The mapping:

- `this.state.t` → `useCurrentFrame() / fps`
- `this.pick('x')` → `props.x` (defaults table is in the DC's `D = {…}` — copy it)
- `parseSRT / buildBlocks / speakerOrder / firstName` → import from `captions.js` (unchanged)
- `activeBlock()`, `capSize()`, word opacity/translate, speaker label → copy the methods as-is
- Ground drift `Math.sin(t*0.05)` → keep (deterministic in `t`)
- Speaker-ground crossfade → `interpolate(frame, [changeFrame-12, changeFrame+12], [0,1])`
- Sizes: the DC authors at the 1080×1920 ground and scales the stage; in Remotion author at
  **2160×3840** — multiply the px literals by 2 (or render the 1080 tree inside an
  `AbsoluteFill` with `transform: scale(2)` and `transformOrigin: 0 0`, the cleaner port).
- Outro: same markup; drive `oProg` from `frame` over the last `outroDuration*fps` frames.

> **Single source of truth rule:** never re-implement caption segmentation or the colourway map
> in the renderer. If logic must change, change `captions.js` in the Design project and re-copy.
> Keep the `.dc.html` and the Remotion port visually identical so the client can keep previewing
> and tweaking in Design.

---

## 5. Why this split (Design vs Code)

- **Claude Design** owns the *look*: live preview, on-brand components (PatternPanel, ABC Marist,
  approved WAYS), instant tweaking of grounds/motion/copy, client review. It **cannot** transcribe
  audio or emit an MP4.
- **Claude Code** owns the *pipeline*: Whisper/whisperX, diarization, and frame-accurate 4K/60fps
  MP4 rendering via Remotion — deterministic, batchable across episodes, CI-able.

Design the look in Design, render the file in Code, sharing `captions.js` so they never drift.

---

## 6. Quick start for the Code agent

1. Scaffold the layout in §3; `npm i remotion @remotion/cli @remotion/media-utils`.
2. Copy from this project: `templates/caption-story/captions.js`, `assets/fonts/ABCMarist-*.otf`,
   `assets/logos/symbol-*.svg`, `assets/imagery/illus-therapy.jpg`, `assets/imagery/cover-sheikhagpt.jpg`,
   and the pattern tiles referenced by `WAYS` (tiles 6A/6B/5C/2B — see `components/media/PatternPanel.jsx`).
3. Port `renderVals()` → `CaptionStory.tsx` per §4.
4. Write `pipeline/transcribe.py` (whisperX, `--diarize`, SRT + words.json out).
5. `bash pipeline/render.sh in-therapy-ep7` → `out/in-therapy-ep7.mp4`.
6. Verify against the Design preview at matching timestamps (22.5s = Rania/oak, ~71s = outro).
