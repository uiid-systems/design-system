# Number

> Animated number built on [`Text`](../text/README.md) and [NumberFlow](https://number-flow.barvian.me/). When `value` changes, digits spin smoothly to the new number. Formatting is native `Intl.NumberFormat`; the animation respects `prefers-reduced-motion` and degrades to a plain formatted number.

Use Number when you want to:

- Display metrics, prices, percentages, or counters that update in place
- Format via `Intl.NumberFormat` — currency, percent, compact notation, locales
- Style the number with any `Text` prop — `size`, `weight`, `family`, `shade`, `color`, and spacing all pass through

## Usage

```tsx
import { Number } from "@uiid/typography";

<Number
  value={199.99}
  format={{ style: "currency", currency: "USD" }}
  size={4}
  weight="semibold"
/>;
```

## Notes

- Renders a `<number-flow-react>` custom element, so the `render` prop is not available — the element is fixed.
- Accessible by default: NumberFlow exposes the formatted value as a single label to screen readers.
- For word-by-word text reveals see [`Reveal`](../reveal/README.md).
