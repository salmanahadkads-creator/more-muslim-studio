Podcast player bar: play/pause, a harvest progress scrubber, and timecodes. Progress is controlled (0–1) — wire `onToggle`/`onSeek` for interactivity.

```jsx
<AudioBar episode="S1 · E7" title="In Therapy, with SheikhAGPT"
  progress={0.42} duration={2460} playing onToggle={...} onSeek={...} />
```
