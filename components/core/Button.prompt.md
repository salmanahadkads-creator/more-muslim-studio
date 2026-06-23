Uppercase, wide-tracked, pill-shaped button. Hierarchy comes from fill, not weight (the brand has no bold). Use `primary` (harvest+oak) for the main CTA; hover flips to oak+ivory (pairing 2). Only approved colour pairings — no terracotta.

```jsx
<Button variant="primary" size="lg">Listen now</Button>
<Button variant="solid">Subscribe</Button>
<Button variant="outline">All episodes</Button>
<Button as="a" href="#" variant="ghost">Share</Button>
```

Variants: `primary` (harvest bg + oak text → oak bg + ivory on hover), `solid` (ivory bg + oak text), `outline` (hairline ivory), `ghost`. Sizes `sm`/`md`/`lg`. Pair with a `<Symbol>` or icon as a child for icon+label.
