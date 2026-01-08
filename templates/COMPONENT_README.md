# {ComponentName}

> Brief description of what this component does. Mention the [Base UI primitive](https://base-ui.com/react/components/{base-component}) if applicable.

## Quick Reference

```tsx
import { {ComponentName} } from "@uiid/{package}";

// Basic usage
<{ComponentName} />

// With common props
<{ComponentName} label="Label" disabled />
```

## Examples

### Basic

```tsx
<{ComponentName} />
```

### With Label

```tsx
<{ComponentName} label="Field label" description="Helper text" />
```

### Controlled

```tsx
const [value, setValue] = useState("");

<{ComponentName} value={value} onValueChange={setValue} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `ReactNode` | — | Label text |
| `description` | `ReactNode` | — | Helper text below the component |
| `disabled` | `boolean` | `false` | Disables the component |
| `className` | `string` | — | Additional CSS classes |

> Props are forwarded to the underlying Base UI component.

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

| Component | Description |
|-----------|-------------|
| `{ComponentName}Root` | Container and context provider |
| `{ComponentName}Label` | Label element |

## Data Slots

Components use `data-slot` attributes for styling hooks:

| Slot | Element |
|------|---------|
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

Sections to include/exclude:
- Anatomy: Only for compound components with exposed parts
- Subcomponents: Only if subcomponents are exported
- Controlled example: Only for components with value state
- See Also: Always include, link to related components

Keep it concise:
- 2-3 examples max
- Props table should only include component-specific props
- Skip CSS variables (use Storybook for token reference)
-->
