Round play/pause control in harvest yellow, deepening to terracotta on hover.

```jsx
const [p, setP] = React.useState(false);
<PlayButton playing={p} onClick={() => setP(!p)} size={64} />
```
