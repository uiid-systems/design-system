# ConditionalRender

> A utility component for conditionally wrapping children in a container element.

## Quick Reference

```tsx
import { ConditionalRender } from "@uiid/layout";

// Wrap in link only if href exists
<ConditionalRender
  condition={!!href}
  render={<a href={href} />}
>
  Click me
</ConditionalRender>
```

## Examples

### Conditional Link Wrapper

```tsx
const href = "/page"; // or undefined

<ConditionalRender
  condition={!!href}
  render={<a href={href} />}
>
  <span>Link text</span>
</ConditionalRender>

// If href exists: <a href="/page"><span>Link text</span></a>
// If href is undefined: <span>Link text</span>
```

### Conditional Tooltip Wrapper

```tsx
<ConditionalRender
  condition={showTooltip}
  render={<TooltipTrigger />}
>
  <button>Hover me</button>
</ConditionalRender>
```

### Feature Flag Wrapper

```tsx
<ConditionalRender
  condition={featureEnabled}
  render={<div className="new-feature-styles" />}
>
  <FeatureContent />
</ConditionalRender>
```

### Conditional Container

```tsx
<ConditionalRender
  condition={isCard}
  render={<div className="card" />}
>
  <h2>Title</h2>
  <p>Content</p>
</ConditionalRender>
```

## How It Works

- When `condition` is `true`: children are cloned into the `render` element
- When `condition` is `false`: children are rendered directly without wrapper
- When `render` is `undefined`: children are rendered directly

```tsx
// condition=true, render provided
<ConditionalRender condition={true} render={<div className="wrapper" />}>
  <span>Content</span>
</ConditionalRender>
// Output: <div className="wrapper"><span>Content</span></div>

// condition=false
<ConditionalRender condition={false} render={<div className="wrapper" />}>
  <span>Content</span>
</ConditionalRender>
// Output: <span>Content</span>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `condition` | `boolean` | — | Whether to wrap children |
| `render` | `ReactElement` | — | Element to wrap children with |
| `children` | `ReactNode` | — | Content to conditionally wrap |

## Use Cases

- Wrapping content in a link only when URL exists
- Adding tooltip triggers conditionally
- Feature flag-based layout changes
- Progressive enhancement patterns

## See Also

- [SwitchRender](../switch-render/README.md) - Choose between two wrappers
