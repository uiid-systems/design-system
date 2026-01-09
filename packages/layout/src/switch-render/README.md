# SwitchRender

> A utility component for switching between two wrapper elements based on a condition.

## Quick Reference

```tsx
import { SwitchRender } from "@uiid/layout";

// Switch between link and span
<SwitchRender
  condition={!!href}
  render={{
    true: <a href={href} />,
    false: <span />,
  }}
>
  Click me
</SwitchRender>
```

## Examples

### Link or Span

```tsx
const href = "/page"; // or undefined

<SwitchRender
  condition={!!href}
  render={{
    true: <a href={href} className="link" />,
    false: <span className="text" />,
  }}
>
  Navigation text
</SwitchRender>

// If href exists: <a href="/page" className="link">Navigation text</a>
// If undefined: <span className="text">Navigation text</span>
```

### Button or Div

```tsx
<SwitchRender
  condition={isInteractive}
  render={{
    true: <button onClick={handleClick} />,
    false: <div />,
  }}
>
  Content
</SwitchRender>
```

### Enabled or Disabled Styles

```tsx
<SwitchRender
  condition={isEnabled}
  render={{
    true: <div className="enabled" />,
    false: <div className="disabled" />,
  }}
>
  Feature content
</SwitchRender>
```

### External or Internal Link

```tsx
<SwitchRender
  condition={isExternal}
  render={{
    true: <a href={url} target="_blank" rel="noopener" />,
    false: <Link to={url} />,
  }}
>
  {linkText}
</SwitchRender>
```

### Card Variants

```tsx
<SwitchRender
  condition={isClickable}
  render={{
    true: <button className="card card--clickable" />,
    false: <div className="card" />,
  }}
>
  <h3>Card Title</h3>
  <p>Card content</p>
</SwitchRender>
```

## How It Works

- When `condition` is `true`: uses `render.true` element
- When `condition` is `false`: uses `render.false` element
- If selected wrapper is `undefined`: children render directly

```tsx
// condition=true
<SwitchRender
  condition={true}
  render={{
    true: <a href="/link" />,
    false: <span />,
  }}
>
  Text
</SwitchRender>
// Output: <a href="/link">Text</a>

// condition=false
<SwitchRender
  condition={false}
  render={{
    true: <a href="/link" />,
    false: <span />,
  }}
>
  Text
</SwitchRender>
// Output: <span>Text</span>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `condition` | `boolean` | — | Which render element to use |
| `render.true` | `ReactElement` | — | Element when condition is true |
| `render.false` | `ReactElement` | — | Element when condition is false |
| `children` | `ReactNode` | — | Content to wrap |

## Use Cases

- Rendering as link vs text based on URL presence
- Interactive vs static element switching
- Different styling based on state
- External vs internal link handling

## See Also

- [ConditionalRender](../conditional-render/README.md) - Wrap or don't wrap (simpler)
