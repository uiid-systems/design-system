# Component README Template

Use this template when creating README files for components in the design system.

---

# {ComponentName}

A brief description of what this component does and its primary use case. If built on a Base UI primitive, mention it here with a link.

## Usage

```tsx
import { {ComponentName} } from "@uiid/{package}";

<{ComponentName} />;
```

### Common Variants

Show the most common usage patterns with short code examples:

```tsx
// Example with common props
<{ComponentName} variant="primary" size="md" />
```

### With Children or Composition

If the component accepts children or composes with other components:

```tsx
<{ComponentName}>
  <ChildComponent />
</{ComponentName}>
```

## Props

| Prop        | Type                | Default | Description                |
| ----------- | ------------------- | ------- | -------------------------- |
| `prop1`     | `string`            | —       | Description of prop1       |
| `prop2`     | `"a" \| "b" \| "c"` | `"a"`   | Description of prop2       |
| `disabled`  | `boolean`           | `false` | Disables the component     |
| `className` | `string`            | —       | Additional CSS class names |

All other props are forwarded to the underlying element/component.

## Data Attributes

| Attribute    | Values               | Description                   |
| ------------ | -------------------- | ----------------------------- |
| `data-slot`  | `"{slot-name}"`      | Identifies the element        |
| `data-state` | `"open" \| "closed"` | Current state (if applicable) |

## CSS Variables

The component uses design tokens from the design system:

| Variable             | Description              |
| -------------------- | ------------------------ |
| `--{layer}-property` | Description of the token |

## Accessibility

Include any relevant accessibility notes:

- Keyboard interactions
- ARIA attributes
- Screen reader considerations

## File Structure

```
{component-name}/
├── {component-name}.tsx           # Component implementation
├── {component-name}.types.ts      # TypeScript types
├── {component-name}.constants.ts  # Default values
├── {component-name}.module.css    # Styles
├── {component-name}.stories.tsx   # Storybook stories
├── {component-name}.test.tsx      # Unit tests
└── README.md                      # Documentation
```

---

## Template Usage Notes

When using this template:

1. Replace `{ComponentName}` with the actual component name (PascalCase)
2. Replace `{component-name}` with the kebab-case version
3. Replace `{package}` with the package name (e.g., `forms`, `buttons`, `layout`)
4. Replace `{layer}` with the CSS layer (e.g., `forms`, `buttons`, `globals`)
5. Remove sections that don't apply (e.g., Accessibility if no special considerations)
6. Remove this "Template Usage Notes" section from the final README
