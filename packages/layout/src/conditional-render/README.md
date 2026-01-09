# ConditionalRender

> A utility component for conditionally wrapping children in a container element.

## Quick Reference

```tsx
import { ConditionalRender } from "@uiid/layout";

// Wrap children when condition is true
<ConditionalRender condition={true} render={<a href="/link" />}>
  Click me
</ConditionalRender>

// Render children directly when condition is false
<ConditionalRender condition={false} render={<a href="/link" />}>
  Just text
</ConditionalRender>

// Render children directly when render is undefined
<ConditionalRender condition={true} render={undefined}>
  Just text
</ConditionalRender>
```

## Props

| Prop        | Type                     | Default | Description                   |
| ----------- | ------------------------ | ------- | ----------------------------- |
| `condition` | `boolean`                | —       | Whether to wrap children      |
| `render`    | `ReactElement<unknown>`  | —       | Element to wrap children with |
| `children`  | `ReactNode`              | —       | Content to conditionally wrap |

## See Also

- [SwitchRender](../switch-render/README.md) - Choose between two wrappers
