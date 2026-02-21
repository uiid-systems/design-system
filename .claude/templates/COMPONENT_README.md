# {ComponentName}

> Brief description of what this component does. Mention the [Base UI primitive](https://base-ui.com/react/components/{base-component}) if applicable.

## Quick Reference

```tsx
import { {ComponentName} } from "@uiid/{package}";

// Core props
<{ComponentName} value="value" onValueChange={setValue} />

// Common variants
<{ComponentName} size="small" variant="secondary" />

// State props
<{ComponentName} disabled loading />

// Render a custom element (if applicable)
<{ComponentName} render={<button />} />
```

## Props

| Prop            | Type                                      | Default   | Description                    |
| --------------- | ----------------------------------------- | --------- | ------------------------------ |
| `value`         | `string`                                  | —         | Controlled value               |
| `onValueChange` | `(value: string) => void`                 | —         | Callback when value changes    |
| `size`          | `"small" \| "medium" \| "large"`          | `"medium"`| Component size                 |
| `variant`       | `"primary" \| "secondary"`                | `"primary"`| Visual variant                |
| `disabled`      | `boolean`                                 | `false`   | Disables the component         |
| `className`     | `string`                                  | —         | Additional CSS classes         |

## Anatomy

For compound components, show the structure:

```tsx
<{ComponentName}Root>
  <{ComponentName}Label />
  <{ComponentName}Control />
</{ComponentName}Root>
```

## Subcomponents

If the component exposes subcomponents for advanced usage:

| Component              | Description                  |
| ---------------------- | ---------------------------- |
| `{ComponentName}Root`  | Container and context provider |
| `{ComponentName}Label` | Label element                |

## Data Slots

| Slot               | Element      |
| ------------------ | ------------ |
| `{component-name}` | Root element |

## Accessibility

- Built on Base UI which handles ARIA attributes
- Keyboard navigation: [describe if relevant]

## See Also

- [{RelatedComponent}](../{related-component}/README.md) - Brief description
- [Base UI {Component}](https://base-ui.com/react/components/{base-component}) - Underlying primitive

---

<!--
TEMPLATE INSTRUCTIONS (delete this section when using)

Placeholders:
- {ComponentName} → PascalCase (e.g., "Checkbox")
- {component-name} → kebab-case (e.g., "checkbox")
- {package} → package name (e.g., "forms", "buttons")
- {base-component} → Base UI component name if applicable

Quick Reference guidelines:
- Group props by category (core, variants, state, render)
- Show the API, not usage in context
- No children content in examples
- Keep it scannable

Props table guidelines:
- Types MUST come from the component's .types.ts file
- Use exact union types, not simplified versions (e.g., `"small" | "medium" | "large"` not `string`)
- For shared types (SpacingValue, LayoutProps), reference the type name and add a note below the table
- Example note: `> `SpacingValue` = `0 | 1 | 2 | 3 | 4 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 56 | 64``
- Never use Storybook as the source of truth for types

Sections to include/exclude:
- Anatomy: Only for compound components with exposed parts
- Subcomponents: Only if subcomponents are exported
- Accessibility: Only if component has specific a11y features
- See Also: Always include, link to related components

Keep it concise:
- Props table should only include component-specific props
- Skip CSS variables (use Storybook for token reference)
- No usage examples - Quick Reference teaches the API
-->
