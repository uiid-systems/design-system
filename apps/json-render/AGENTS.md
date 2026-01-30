# LLM Guidelines for UIID Component Tree Generation

This document provides rules for AI models generating UI trees using the UIID component library with json-render.

> **Note:** The "Available Components" section below is generated from `@uiid/registry` via `generateComponentReference()`. Do not edit it manually — update the registry entries instead.

---

## Critical Concepts

### Precomposed Components (Preferred for LLMs)

UIID components are **precomposed** - they handle their own internal structure. You do NOT need to build up components from subparts.

**WRONG - Building Card from parts:**

```json
{
  "root": "card",
  "elements": {
    "card": { "type": "Card", "children": ["card-header", "card-body"] },
    "card-header": { "type": "CardHeader", "children": ["card-title"] },
    "card-title": { "type": "CardTitle", "props": { "children": "Title" } },
    "card-body": { "type": "CardBody", "children": ["content"] }
  }
}
```

**CORRECT - Use props directly:**

```json
{
  "root": "card",
  "elements": {
    "card": {
      "key": "card",
      "type": "Card",
      "props": {
        "title": "Title",
        "description": "Description text"
      },
      "children": ["content"]
    },
    "content": {
      "key": "content",
      "type": "Text",
      "props": { "children": "Card body content here" },
      "parentKey": "card"
    }
  }
}
```

The Card component automatically renders its title, description, icon, and footer from props. Only use `children` for custom body content.

### No Inline Styles

**Never use `style={{}}` objects.** Always use component props instead.

**WRONG:**

```json
{
  "type": "Group",
  "props": {
    "style": { "flex": 1, "width": "100%", "alignItems": "flex-start" }
  }
}
```

**CORRECT:**

```json
{
  "type": "Group",
  "props": {
    "evenly": true,
    "fullwidth": true,
    "ay": "start"
  }
}
```

**Available layout props instead of inline styles:**

| Instead of `style`         | Use prop                                         |
| -------------------------- | ------------------------------------------------ |
| `flex: 1`                  | `evenly`                                         |
| `width: "100%"`            | `fullwidth`                                      |
| `height: "100%"`           | `fullheight`                                     |
| `justifyContent: "center"` | `ay: "center"` (Stack) or `ax: "center"` (Group) |
| `alignItems: "center"`     | `ax: "center"` (Stack) or `ay: "center"` (Group) |
| `gap: "16px"`              | `gap: 4`                                         |
| `padding: "16px"`          | `p: 4`                                           |
| `margin: "8px"`            | `m: 2`                                           |

---

## Tree Structure Format

UIID uses a **flat tree structure** optimized for streaming. Never use nested children objects.

### Correct Format

```json
{
  "root": "root-key",
  "elements": {
    "root-key": {
      "key": "root-key",
      "type": "Stack",
      "props": { "gap": 4 },
      "children": ["child-1", "child-2"]
    },
    "child-1": {
      "key": "child-1",
      "type": "Text",
      "props": { "children": "Hello World" },
      "parentKey": "root-key"
    },
    "child-2": {
      "key": "child-2",
      "type": "Button",
      "props": { "children": "Click Me" },
      "parentKey": "root-key"
    }
  }
}
```

### Element Properties

| Property    | Type     | Required | Description                                            |
| ----------- | -------- | -------- | ------------------------------------------------------ |
| `key`       | string   | Yes      | Unique identifier for the element                      |
| `type`      | string   | Yes      | Component type from the registry                       |
| `props`     | object   | Yes      | Component props (can be empty `{}`)                    |
| `children`  | string[] | No       | Array of child element keys (for container components) |
| `parentKey` | string   | No       | Key of parent element (null for root)                  |

### Key Naming Rules

1. Use descriptive, kebab-case keys: `login-form`, `submit-button`, `email-input`
2. Keys must be unique within the tree
3. Root element key must match the `root` field
4. Use semantic names that describe the element's purpose

---

<!-- BEGIN GENERATED COMPONENT REFERENCE — do not edit below this line -->
<!-- Source: @uiid/registry generateComponentReference() -->

## Available Components

### Precomposed Components

UIID components are **precomposed** — they handle their own internal structure. Use props for metadata, children for custom content only.

| Component | Use props for... | Use children for... |
| --- | --- | --- |
| Box | N/A | Content |
| Stack | N/A | Content |
| Group | N/A | Content |
| Layer | N/A | Content |
| Button | N/A | Content |
| ToggleButton | `icon` | Content |
| Form | N/A | Content |
| Input | `placeholder`, `label`, `description` | N/A (no children) |
| Textarea | `placeholder`, `label`, `description` | N/A (no children) |
| Checkbox | `label`, `description` | N/A (no children) |
| Select | `placeholder`, `items`, `label`, `description` | N/A (no children) |
| Switch | `label`, `description` | N/A (no children) |
| Text | N/A | Content |
| Card | `title`, `description`, `action`, `footer`, `icon` | Custom body content |
| Drawer | `title` | Custom body content |
| Modal | `title`, `description`, `action`, `icon`, `footer` | Custom body content |
| Popover | `title`, `description`, `action`, `icon`, `footer` | Custom body content |
| Sheet | `title`, `description`, `action`, `icon`, `footer` | Custom body content |
| Tooltip | N/A | Content |

### Layout Components

#### Box

Generic flex container with layout and spacing props

Supports children.

Also supports layout props: `gap`, `p`, `ax`, `ay`, `fullwidth`, `fullheight`, `evenly`, plus all spacing (`px`, `py`, `pt`...), margin (`mx`, `my`, `mt`...), and border (`b`, `bx`, `by`...) props.

#### Stack

Vertical flex layout (column). ax controls vertical alignment, ay controls horizontal

Use Stack for vertical layouts. Children flow top-to-bottom. ax controls vertical alignment, ay horizontal.

Supports children.

Also supports layout props: `gap`, `p`, `ax`, `ay`, `fullwidth`, `fullheight`, `evenly`, plus all spacing (`px`, `py`, `pt`...), margin (`mx`, `my`, `mt`...), and border (`b`, `bx`, `by`...) props.

#### Group

Horizontal flex layout (row). ax controls horizontal alignment, ay controls vertical

Use Group for horizontal layouts. Children flow left-to-right. ax controls horizontal alignment, ay vertical.

Supports children.

Also supports layout props: `gap`, `p`, `ax`, `ay`, `fullwidth`, `fullheight`, `evenly`, plus all spacing (`px`, `py`, `pt`...), margin (`mx`, `my`, `mt`...), and border (`b`, `bx`, `by`...) props.

#### Layer

Positioned layer with offset support for overlays and positioned content

Supports children.

| Prop | Type | Description |
| --- | --- | --- |
| `offset` | object |  |

Also supports layout props: `gap`, `p`, `ax`, `ay`, `fullwidth`, `fullheight`, `evenly`, plus all spacing (`px`, `py`, `pt`...), margin (`mx`, `my`, `mt`...), and border (`b`, `bx`, `by`...) props.

#### Separator

Visual divider line with horizontal or vertical orientation

| Prop | Type | Description |
| --- | --- | --- |
| `orientation` | "horizontal" \| "vertical" |  (default: `"horizontal"`) |
| `shade` | "background" \| "surface" \| "accent" \| "halftone" \| "muted" \| "foreground" |  |

Also supports spacing props: `p`, `px`, `py`, `m`, `mx`, `my`, etc.

---

### Typography

#### Text

Typography component with size scale, weight, color shades, and text decorations

Supports children.

| Prop | Type | Description |
| --- | --- | --- |
| `children` | string |  |
| `size` | -1 \| 0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8 |  |
| `weight` | "thin" \| "light" \| "normal" \| "bold" |  |
| `shade` | "background" \| "surface" \| "accent" \| "halftone" \| "muted" \| "foreground" |  |
| `tone` | "positive" \| "critical" \| "warning" \| "info" |  |
| `align` | "left" \| "center" \| "right" \| "justify" |  |
| `underline` | boolean |  |
| `strikethrough` | boolean |  |
| `balance` | boolean |  |
| `mono` | boolean |  |

Also supports spacing props: `p`, `px`, `py`, `m`, `mx`, `my`, etc.

---

### Buttons

#### Button

Primary action button with multiple size, variant, and tone options

Use Button for primary actions. Set tone for semantic meaning, variant for visual weight, ghost for minimal chrome.

Supports children.

| Prop | Type | Description |
| --- | --- | --- |
| `children` | string |  |
| `size` | "xsmall" \| "small" \| "medium" \| "large" |  (default: `"medium"`) |
| `variant` | "subtle" \| "inverted" |  |
| `tone` | "positive" \| "critical" \| "warning" \| "info" |  |
| `disabled` | boolean |  |
| `loading` | boolean |  |
| `fullwidth` | boolean |  |
| `ghost` | boolean |  |
| `pill` | boolean |  |
| `square` | boolean |  |
| `grows` | boolean |  (default: `true`) |
| `circle` | boolean |  |
| `tooltip` | string |  |

#### ToggleButton

Toggle button with pressed/unpressed states and optional dynamic icon/text

Supports children.

| Prop | Type | Description |
| --- | --- | --- |
| `children` | string |  |
| `size` | "xsmall" \| "small" \| "medium" \| "large" |  (default: `"medium"`) |
| `variant` | "subtle" \| "inverted" |  |
| `tone` | "positive" \| "critical" \| "warning" \| "info" |  |
| `disabled` | boolean |  |
| `loading` | boolean |  |
| `fullwidth` | boolean |  |
| `ghost` | boolean |  |
| `pill` | boolean |  |
| `square` | boolean |  |
| `grows` | boolean |  |
| `circle` | boolean |  |
| `tooltip` | string |  |
| `pressed` | boolean |  |
| `defaultPressed` | boolean |  |
| `icon` | object |  |
| `text` | object |  |

---

### Form Components

#### Form

Form container with built-in validation support. Fields with required/pattern attributes validate on submit.

Supports children.

| Prop | Type | Description |
| --- | --- | --- |
| `gap` | number |  (default: `4`) |
| `fullwidth` | boolean |  |

#### Input

Text input field with label and description support

| Prop | Type | Description |
| --- | --- | --- |
| `value` | string |  |
| `defaultValue` | string |  |
| `placeholder` | string |  |
| `type` | string |  |
| `size` | "small" \| "medium" \| "large" |  (default: `"medium"`) |
| `label` | string |  |
| `description` | string |  |
| `disabled` | boolean |  |
| `required` | boolean |  |
| `fullwidth` | boolean |  |
| `ghost` | boolean |  |

#### Textarea

Multi-line text input with label and description support

| Prop | Type | Description |
| --- | --- | --- |
| `value` | string |  |
| `defaultValue` | string |  |
| `placeholder` | string |  |
| `rows` | number |  (default: `3`) |
| `resize` | "none" \| "vertical" \| "horizontal" \| "both" |  (default: `"vertical"`) |
| `size` | "small" \| "medium" \| "large" |  (default: `"medium"`) |
| `label` | string |  |
| `description` | string |  |
| `disabled` | boolean |  |
| `required` | boolean |  |
| `fullwidth` | boolean |  |
| `ghost` | boolean |  |

#### Checkbox

Checkbox input with label, description, and indeterminate state support

| Prop | Type | Description |
| --- | --- | --- |
| `checked` | boolean |  |
| `defaultChecked` | boolean |  |
| `indeterminate` | boolean |  |
| `label` | string |  |
| `description` | string |  |
| `disabled` | boolean |  |
| `required` | boolean |  |
| `name` | string |  |
| `reversed` | boolean |  |
| `bordered` | boolean |  |

#### Select

Dropdown select with customizable options, label, and description

| Prop | Type | Description |
| --- | --- | --- |
| `value` | string |  |
| `defaultValue` | string |  |
| `placeholder` | string |  |
| `items` | object[] |  |
| `label` | string |  |
| `description` | string |  |
| `size` | "small" \| "medium" \| "large" |  (default: `"medium"`) |
| `disabled` | boolean |  |
| `required` | boolean |  |
| `fullwidth` | boolean |  |
| `ghost` | boolean |  |

#### Switch

Toggle switch with label and description support

| Prop | Type | Description |
| --- | --- | --- |
| `checked` | boolean |  |
| `defaultChecked` | boolean |  |
| `label` | string |  |
| `description` | string |  |
| `disabled` | boolean |  |
| `required` | boolean |  |
| `name` | string |  |
| `reversed` | boolean |  |
| `bordered` | boolean |  |

---

### Cards

#### Card

Container card with title, description, icon, action, and footer slots

Use Card as a content container. Pass title/description as props, children as body. Use tone for semantic color.

Supports children.

**Slots (use as props):**
- `title`: Card heading, rendered above the body
- `description`: Subheading beneath the title
- `action`: Action buttons, typically top-right
- `footer`: Footer content at the bottom of the card
- `icon`: Icon displayed in the card header

| Prop | Type | Description |
| --- | --- | --- |
| `children` | string |  |
| `title` | string |  |
| `description` | string |  |
| `action` | string |  |
| `footer` | string |  |
| `icon` | string |  |
| `tone` | "positive" \| "critical" \| "warning" \| "info" |  |
| `inverted` | boolean |  |
| `trimmed` | boolean |  |
| `transparent` | boolean |  |
| `ghost` | boolean |  |

Also supports layout props: `gap`, `p`, `ax`, `ay`, `fullwidth`, `fullheight`, `evenly`, plus all spacing (`px`, `py`, `pt`...), margin (`mx`, `my`, `mt`...), and border (`b`, `bx`, `by`...) props.

---

### Overlays

#### Drawer

Bottom sheet with drag-to-close interaction

Supports children.

| Prop | Type | Description |
| --- | --- | --- |
| `children` | string |  |
| `trigger` | string |  |
| `title` | string |  |
| `direction` | "top" \| "right" \| "bottom" \| "left" |  (default: `"bottom"`) |
| `open` | boolean |  |
| `defaultOpen` | boolean |  |
| `onOpenChange` | function |  |

#### Modal

Dialog overlay with Card-like content structure

Supports children.

| Prop | Type | Description |
| --- | --- | --- |
| `children` | string |  |
| `trigger` | string |  |
| `title` | string |  |
| `description` | string |  |
| `action` | string |  |
| `icon` | string |  |
| `footer` | string |  |
| `size` | "small" \| "medium" \| "large" \| "xlarge" |  (default: `"medium"`) |
| `open` | boolean |  |
| `onOpenChange` | function |  |

#### Popover

Floating card attached to a trigger element

Supports children.

| Prop | Type | Description |
| --- | --- | --- |
| `children` | string |  |
| `trigger` | string |  |
| `title` | string |  |
| `description` | string |  |
| `action` | string |  |
| `icon` | string |  |
| `footer` | string |  |
| `open` | boolean |  |
| `onOpenChange` | function |  |

#### Sheet

Slide-in panel overlay from any edge of the screen

Supports children.

| Prop | Type | Description |
| --- | --- | --- |
| `children` | string |  |
| `trigger` | string |  |
| `title` | string |  |
| `description` | string |  |
| `action` | string |  |
| `icon` | string |  |
| `footer` | string |  |
| `side` | "top" \| "right" \| "bottom" \| "left" |  (default: `"right"`) |
| `open` | boolean |  |
| `onOpenChange` | function |  |

#### Toaster

Container for toast notifications

| Prop | Type | Description |
| --- | --- | --- |
| `position` | "top" \| "bottom" |  (default: `"bottom"`) |

#### Tooltip

Informational popup shown on hover or focus

Supports children.

| Prop | Type | Description |
| --- | --- | --- |
| `children` | string |  |
| `trigger` | string |  |
| `delay` | number |  |
| `open` | boolean |  |
| `onOpenChange` | function |  |

---

### All Component Types

Valid types: Box, Stack, Group, Layer, Separator, Button, ToggleButton, Form, Input, Textarea, Checkbox, Select, Switch, Text, Card, Drawer, Modal, Popover, Sheet, Toaster, Tooltip

<!-- END GENERATED COMPONENT REFERENCE -->

---

## Layout Patterns

### Full-Width Stacked Children

Use `ax: "stretch"` on a Stack to make all children full-width. This is the standard pattern for forms, input groups, and any vertical layout where children should fill the container. Group children inside a stretched Stack also become full-width automatically — no need to set `fullwidth` on each one.

```json
{
  "root": "form-fields",
  "elements": {
    "form-fields": {
      "key": "form-fields",
      "type": "Stack",
      "props": { "ax": "stretch", "gap": 3 },
      "children": ["name-input", "name-row"]
    },
    "name-input": {
      "key": "name-input",
      "type": "Input",
      "props": { "label": "Email" },
      "parentKey": "form-fields"
    },
    "name-row": {
      "key": "name-row",
      "type": "Group",
      "props": { "gap": 2 },
      "children": ["first-name", "last-name"],
      "parentKey": "form-fields"
    },
    "first-name": {
      "key": "first-name",
      "type": "Input",
      "props": { "label": "First name" },
      "parentKey": "name-row"
    },
    "last-name": {
      "key": "last-name",
      "type": "Input",
      "props": { "label": "Last name" },
      "parentKey": "name-row"
    }
  }
}
```

### Equal-Width Children in a Row

Use `evenly` on a Group to give all children equal width (`flex: 1`), instead of setting styles on each child.

```json
{
  "type": "Group",
  "props": { "evenly": true, "gap": 2 },
  "children": ["btn-save", "btn-cancel"]
}
```

### Form Layout

```json
{
  "root": "form",
  "elements": {
    "form": {
      "key": "form",
      "type": "Stack",
      "props": { "gap": 4 },
      "children": ["email", "password", "actions"]
    },
    "email": {
      "key": "email",
      "type": "Input",
      "props": { "label": "Email", "type": "email", "required": true },
      "parentKey": "form"
    },
    "password": {
      "key": "password",
      "type": "Input",
      "props": { "label": "Password", "type": "password", "required": true },
      "parentKey": "form"
    },
    "actions": {
      "key": "actions",
      "type": "Group",
      "props": { "gap": 2, "ax": "end" },
      "children": ["cancel", "submit"],
      "parentKey": "form"
    },
    "cancel": {
      "key": "cancel",
      "type": "Button",
      "props": { "variant": "subtle", "children": "Cancel" },
      "parentKey": "actions"
    },
    "submit": {
      "key": "submit",
      "type": "Button",
      "props": { "children": "Sign In" },
      "parentKey": "actions"
    }
  }
}
```

### Card Grid

```json
{
  "root": "grid",
  "elements": {
    "grid": {
      "key": "grid",
      "type": "Group",
      "props": { "gap": 4, "evenly": true },
      "children": ["card-1", "card-2", "card-3"]
    },
    "card-1": {
      "key": "card-1",
      "type": "Card",
      "props": { "title": "Feature 1", "description": "Description" },
      "parentKey": "grid"
    }
  }
}
```

---

## Best Practices

### DO

1. **Always use Stack for vertical layouts, Group for horizontal**
2. **Use semantic keys** that describe the element's purpose
3. **Include labels** on all form inputs for accessibility
4. **Use appropriate text sizes** - headings should be larger than body text
5. **Apply consistent spacing** - use gap values from the scale (2, 4, 6, 8...)
6. **Group related actions** in a Group with `ax: "end"` for right-alignment

### DON'T

1. **Don't nest children objects** - use the flat structure with keys
2. **Don't use arbitrary spacing values** - stick to the defined scale
3. **Don't skip the `key` property** - every element needs a unique key
4. **Don't forget `parentKey`** - all non-root elements need this
5. **Don't use raw strings** - all text must be in a Text component
6. **Don't use `style={{}}` objects** - use component props (`evenly`, `fullwidth`, `gap`, etc.)
7. **Don't build components from subparts** - use precomposed props (`title`, `description`, `label`)
8. **Don't create wrapper elements unnecessarily** - Card handles its own header/body/footer

### Spacing Scale Reference

```
0  = 0px
1  = 4px
2  = 8px
3  = 12px
4  = 16px
6  = 24px
8  = 32px
10 = 40px
12 = 48px
16 = 64px
20 = 80px
24 = 96px
```

Common patterns:

- `gap: 2` - Tight spacing (buttons in a row)
- `gap: 3` - Form field spacing
- `gap: 4` - Standard section spacing
- `gap: 6` - Large section spacing
- `p: 4` - Standard padding
- `p: 6` - Card/container padding

---

## Validation Checklist

Before outputting a tree, verify:

- [ ] `root` field matches the key of the root element
- [ ] Every element has a unique `key`
- [ ] Every element has `type` and `props`
- [ ] All non-root elements have `parentKey`
- [ ] All `children` arrays contain valid keys that exist in `elements`
- [ ] Text content is in `props.children`, not as structural children
- [ ] **No `style` prop anywhere** - use layout props instead
- [ ] **Precomposed props used** - Card uses `title`/`description`, Input uses `label`, etc.
- [ ] **Minimal element count** - don't create unnecessary wrapper elements
