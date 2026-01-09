# SwitchRender

> A utility component for switching between two wrapper elements based on a condition.

## Quick Reference

```tsx
import { SwitchRender } from "@uiid/layout";

// Use render.true when condition is true
<SwitchRender
  condition={true}
  render={{
    true: <a href="/link" />,
    false: <span />,
  }}
>
  Content
</SwitchRender>

// Use render.false when condition is false
<SwitchRender
  condition={false}
  render={{
    true: <a href="/link" />,
    false: <span />,
  }}
>
  Content
</SwitchRender>

// Render children directly when selected wrapper is undefined
<SwitchRender
  condition={true}
  render={{
    true: undefined,
    false: <span />,
  }}
>
  Content
</SwitchRender>
```

## Props

| Prop           | Type           | Default | Description                      |
| -------------- | -------------- | ------- | -------------------------------- |
| `condition`    | `boolean`      | —       | Which render element to use      |
| `render.true`  | `ReactElement` | —       | Element when condition is true   |
| `render.false` | `ReactElement` | —       | Element when condition is false  |
| `children`     | `ReactNode`    | —       | Content to wrap                  |

## See Also

- [ConditionalRender](../conditional-render/README.md) - Wrap or don't wrap (simpler)
