# LLM Guidelines for UIID Component Tree Generation

This document provides rules for AI models generating UI trees using the UIID component library in the blocks app.

> **Component reference:** For full prop tables and component details, read `apps/blocks/COMPONENT_REFERENCE.md`. It is generated from `@uiid/registry` via `generateComponentReference()` — do not edit it manually.

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
| `width: "200px"`           | `w: 200` (value in pixels)                        |
| `height: "120px"`          | `h: 120` (value in pixels)                        |
| `minWidth: "100px"`        | `minw: 100`                                       |
| `maxWidth: "400px"`        | `maxw: 400`                                       |
| `minHeight: "80px"`        | `minh: 80`                                        |
| `maxHeight: "300px"`       | `maxh: 300`                                       |
| `justifyContent: "center"` | `ay: "center"` (Stack) or `ax: "center"` (Group) |
| `alignItems: "center"`     | `ax: "center"` (Stack) or `ay: "center"` (Group) |
| `gap: "16px"`              | `gap: 4`                                         |
| `padding: "16px"`          | `p: 4`                                           |
| `margin: "8px"`            | `m: 2`                                           |

### Subcomponent Props (Customization Escape Hatches)

Precomposed components like Card, Modal, and Sheet have internal subcomponents (header, title, footer, etc.). When you need fine-grained control over a subcomponent, use **subcomponent props** instead of decomposing the component manually.

**Example - Customizing Card's title alignment:**

```json
{
  "type": "Card",
  "props": {
    "title": "Settings",
    "description": "Manage your preferences",
    "TitleProps": { "align": "center" },
    "DescriptionProps": { "shade": "muted" }
  }
}
```

This is cleaner than building the Card from parts. Subcomponent props let you pass any valid prop to the internal component.

**Common subcomponent props:**

| Component | Available Subcomponent Props |
| --------- | ---------------------------- |
| Card      | `ContainerProps`, `HeaderProps`, `TitleProps`, `DescriptionProps`, `IconProps`, `ActionProps`, `FooterProps` |

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

| Property    | Type     | Required | Description                                                              |
| ----------- | -------- | -------- | ------------------------------------------------------------------------ |
| `key`       | string   | Yes      | Unique identifier for the element                                        |
| `type`      | string   | Yes      | Component type from the registry                                         |
| `props`     | object   | Yes      | Component props (can be empty `{}`)                                      |
| `children`  | string[] | No       | Array of child element keys (for container components)                   |
| `parentKey` | string   | No       | Key of parent element (null for root)                                    |
| `slot`      | string   | No       | Render into a parent's named slot prop instead of as regular children    |

### Slot Rendering

Use the `slot` property to render an element into a parent's named prop slot (like `footer`, `action`, `icon`) instead of as a regular child. This is how you place rich content (not just strings) into precomposed component slots.

**Example — Card with a footer containing buttons:**

```json
{
  "root": "card",
  "elements": {
    "card": {
      "key": "card",
      "type": "Card",
      "props": { "title": "Settings", "description": "Manage your preferences" },
      "children": ["body-text", "card-footer"]
    },
    "body-text": {
      "key": "body-text",
      "type": "Text",
      "props": { "children": "Card body content" },
      "parentKey": "card"
    },
    "card-footer": {
      "key": "card-footer",
      "type": "Group",
      "props": { "gap": 2, "ax": "end", "fullwidth": true },
      "children": ["cancel-btn", "save-btn"],
      "parentKey": "card",
      "slot": "footer"
    },
    "cancel-btn": {
      "key": "cancel-btn",
      "type": "Button",
      "props": { "ghost": true, "size": "small", "children": "Cancel" },
      "parentKey": "card-footer"
    },
    "save-btn": {
      "key": "save-btn",
      "type": "Button",
      "props": { "size": "small", "children": "Save" },
      "parentKey": "card-footer"
    }
  }
}
```

Without `"slot": "footer"`, the Group would render inside Card's body. With it, the Group renders in the Card's footer area.

**Components with named slots:**

| Component | Available slots                            |
| --------- | ------------------------------------------ |
| Card      | `title`, `description`, `action`, `footer`, `icon` |
| Modal     | `title`, `description`, `action`, `footer`, `icon` |
| Sheet     | `title`, `description`, `action`, `footer`, `icon` |
| Popover   | `title`, `description`, `action`, `footer`, `icon` |
| Alert     | `title`, `description`, `action`, `footer`, `icon` |

**When to use `slot` vs string props:**

- **String value** → pass directly as prop: `"title": "My Title"`
- **Rich content** (components, multiple elements) → use `slot`: create a child element with `"slot": "footer"`

### Key Naming Rules

1. Use descriptive, kebab-case keys: `login-form`, `submit-button`, `email-input`
2. Keys must be unique within the tree
3. Root element key must match the `root` field
4. Use semantic names that describe the element's purpose

---

## Valid Component Types

Box, Stack, Group, Layer, Separator, Button, ToggleButton, Form, Input, NumberField, Textarea, Checkbox, CheckboxGroup, Radio, RadioGroup, Select, Slider, Switch, Text, Card, Accordion, Collapsible, Drawer, Modal, Popover, Sheet, Toaster, Tooltip, Alert, Avatar, Badge, Kbd, Progress, Status, Timeline, Breadcrumbs, Icon

> For full prop tables, read `apps/blocks/COMPONENT_REFERENCE.md`.

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

## State Management & Data Binding

### Two-Way Binding with `$bindState`

Use `$bindState` to bind a form element's value to the state store. The renderer resolves the expression automatically — the component receives the current value and writes back on change.

```json
{
  "type": "Input",
  "props": {
    "label": "Email",
    "value": { "$bindState": "/form/email" },
    "placeholder": "Enter your email"
  }
}
```

**Bindable props by component:**

| Component      | Prop to bind  |
| -------------- | ------------- |
| Input          | `value`       |
| Textarea       | `value`       |
| Select         | `value`       |
| RadioGroup     | `value`       |
| CheckboxGroup  | `value`       |
| NumberField    | `value`       |
| Slider         | `value`       |
| Checkbox       | `checked`     |
| Switch         | `checked`     |
| ToggleButton   | `pressed`     |

**Path format:** Always use absolute paths starting with `/`, e.g. `/form/email`, `/settings/theme`.

### `setState` Action

Write to the state store from event handlers:

```json
{
  "type": "Button",
  "props": { "children": "Reset" },
  "on": {
    "click": { "action": "setState", "params": { "path": "/form/email", "value": "" } }
  }
}
```

---

## Computed Expressions

### `$computed` — Derived Prop Values

Use `$computed` to derive a prop value from state. Useful for conditional styling, disabling buttons based on form state, showing/hiding elements, etc.

```json
{
  "type": "Button",
  "props": {
    "children": "Submit",
    "disabled": { "$computed": { "eq": [{ "$state": "/form/email" }, ""] } }
  }
}
```

**Available operators:**

| Operator | Description              | Example                                              |
| -------- | ------------------------ | ---------------------------------------------------- |
| `eq`     | Equal                    | `{ "eq": [{ "$state": "/a" }, "b"] }`                |
| `neq`    | Not equal                | `{ "neq": [{ "$state": "/a" }, ""] }`                |
| `gt`     | Greater than             | `{ "gt": [{ "$state": "/count" }, 0] }`              |
| `gte`    | Greater than or equal    | `{ "gte": [{ "$state": "/count" }, 1] }`             |
| `lt`     | Less than                | `{ "lt": [{ "$state": "/count" }, 10] }`             |
| `lte`    | Less than or equal       | `{ "lte": [{ "$state": "/count" }, 100] }`           |
| `and`    | Logical AND              | `{ "and": [{ "neq": [...] }, { "neq": [...] }] }`   |
| `or`     | Logical OR               | `{ "or": [{ "eq": [...] }, { "eq": [...] }] }`      |
| `not`    | Logical NOT              | `{ "not": { "eq": [...] } }`                         |
| `if`     | Conditional              | `{ "if": [condition, trueValue, falseValue] }`       |

### `$template` — Dynamic Strings

Interpolate state values into strings:

```json
{
  "type": "Text",
  "props": {
    "children": { "$template": "Hello, {{/form/name}}!" }
  }
}
```

---

## Form Validation

### `validateForm` Action

Trigger batch validation of all bound form fields:

```json
{
  "type": "Button",
  "props": { "children": "Submit" },
  "on": {
    "click": { "action": "validateForm" }
  }
}
```

---

## Available Actions

| Action         | Description                                   |
| -------------- | --------------------------------------------- |
| `submit`       | Submit a form                                 |
| `navigate`     | Navigate to a different page or section       |
| `toggle`       | Toggle a boolean state                        |
| `dismiss`      | Dismiss or close something                    |
| `setState`     | Set a value in the state store                |
| `validateForm` | Validate all form fields and show errors      |

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
- [ ] `$bindState` paths are absolute (start with `/`)
- [ ] `$computed` expressions use valid operators
