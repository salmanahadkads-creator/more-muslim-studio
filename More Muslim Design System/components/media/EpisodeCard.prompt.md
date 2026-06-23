Episode list/grid card — square cover, metadata tag, title, two-line blurb, play button. Flat with a hairline border that strengthens on hover.

```jsx
<EpisodeCard number={7} duration="41 min" image="/covers/e7.jpg"
  title="In Therapy, with SheikhAGPT"
  description="When Yassmin's friend says she's been using ChatGPT as a therapist…"
  onPlay={() => {}} />
```

Omit `image` for a text-only row. Composes `Tag` + `PlayButton`.
