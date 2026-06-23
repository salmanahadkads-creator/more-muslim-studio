The More Muslim brand symbol (8-point star), as inline SVG that inherits `currentColor`. Use as a sign-off mark, a bullet, or a centred accent — never redraw it by hand.

```jsx
<Symbol size={48} style={{ color: "var(--accent)" }} />
<p style={{ color: "var(--text-primary)" }}>
  <Symbol size={16} /> a bulleted line
</p>
```

Props: `size` (px, default 32), `color`, `title` (set for non-decorative use). Pair it with the wordmark image for a full lockup, or use the `assets/logos/logo-horizontal-*.svg` files directly.
