# LLM Guidelines for UIID Component Tree Generation

This document provides rules for AI models generating UI trees using the UIID component library with json-render.

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

**This pattern applies to most UIID components:**

| Component | Use props for...                         | Use children for... |
| --------- | ---------------------------------------- | ------------------- |
| Card      | `title`, `description`, `icon`, `footer` | Custom body content |
| Input     | `label`, `description`, `placeholder`    | N/A (no children)   |
| Checkbox  | `label`, `description`                   | N/A (no children)   |
| Select    | `label`, `description`, `items`          | N/A (no children)   |
| Button    | N/A                                      | Button label text   |

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
| `justifyContent: "center"` | `ax: "center"` (Stack) or `ax: "center"` (Group) |
| `alignItems: "center"`     | `ay: "center"` (Stack) or `ay: "center"` (Group) |
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

## Available Components

### Layout Components

Use these to structure and position content.

#### Stack

Vertical flex layout (column direction).

```json
{
  "type": "Stack",
  "props": {
    "gap": 4,
    "p": 4,
    "ax": "center",
    "ay": "start"
  },
  "children": ["child-1", "child-2"]
}
```

| Prop                                    | Type    | Description                                                              |
| --------------------------------------- | ------- | ------------------------------------------------------------------------ |
| `gap`                                   | number  | Space between children (0,1,2,3,4,6,8,10,12,16,20,24,32,40,48,56,64)     |
| `p`, `px`, `py`, `pt`, `pb`, `pl`, `pr` | number  | Padding (same scale as gap)                                              |
| `m`, `mx`, `my`, `mt`, `mb`, `ml`, `mr` | number  | Margin (same scale as gap)                                               |
| `ax`                                    | string  | Vertical alignment: `start`, `center`, `end`, `space-between`, `stretch` |
| `ay`                                    | string  | Horizontal alignment: `start`, `center`, `end`, `baseline`, `stretch`    |
| `fullwidth`                             | boolean | Set width to 100%                                                        |
| `fullheight`                            | boolean | Set height to 100%                                                       |

#### Group

Horizontal flex layout (row direction).

```json
{
  "type": "Group",
  "props": {
    "gap": 2,
    "ax": "space-between",
    "ay": "center"
  },
  "children": ["left-content", "right-content"]
}
```

Same props as Stack, but `ax` controls horizontal and `ay` controls vertical alignment.

#### Box

Generic flex container. Use when you need explicit direction control.

```json
{
  "type": "Box",
  "props": {
    "direction": "column",
    "gap": 4
  }
}
```

Additional prop: `direction` - `row` or `column`

#### Separator

Visual divider line.

```json
{
  "type": "Separator",
  "props": {
    "orientation": "horizontal",
    "shade": "muted"
  }
}
```

| Prop          | Type   | Description                                                                 |
| ------------- | ------ | --------------------------------------------------------------------------- |
| `orientation` | string | `horizontal` or `vertical`                                                  |
| `shade`       | string | Color: `background`, `surface`, `muted`, `halftone`, `accent`, `foreground` |

---

### Typography

#### Text

All text content must use the Text component.

```json
{
  "type": "Text",
  "props": {
    "size": 2,
    "weight": "bold",
    "shade": "muted",
    "children": "Your text content here"
  }
}
```

| Prop            | Type    | Description                                                          |
| --------------- | ------- | -------------------------------------------------------------------- |
| `children`      | string  | **Required.** The text content                                       |
| `size`          | number  | Font size: -1, 0, 1, 2, 3, 4, 5, 6, 7, 8 (larger = bigger)           |
| `weight`        | string  | `thin`, `light`, `normal`, `bold`                                    |
| `shade`         | string  | `background`, `surface`, `muted`, `halftone`, `accent`, `foreground` |
| `tone`          | string  | Semantic color: `positive`, `negative`, `warning`, `info`            |
| `align`         | string  | `left`, `center`, `right`, `justify`                                 |
| `underline`     | boolean | Add underline                                                        |
| `strikethrough` | boolean | Add strikethrough                                                    |
| `mono`          | boolean | Use monospace font                                                   |

**Text Size Guide:**

- `-1`, `0`: Small/caption text
- `1`, `2`: Body text (default)
- `3`, `4`: Subheadings
- `5`, `6`: Headings
- `7`, `8`: Large display text

---

### Buttons

#### Button

Primary action button.

```json
{
  "type": "Button",
  "props": {
    "children": "Submit",
    "size": "medium",
    "variant": "subtle",
    "tone": "positive"
  }
}
```

| Prop        | Type    | Description                               |
| ----------- | ------- | ----------------------------------------- |
| `children`  | string  | **Required.** Button label                |
| `size`      | string  | `xsmall`, `small`, `medium`, `large`      |
| `variant`   | string  | `subtle`, `inverted` (omit for default)   |
| `tone`      | string  | `positive`, `negative`, `warning`, `info` |
| `disabled`  | boolean | Disable the button                        |
| `loading`   | boolean | Show loading spinner                      |
| `fullwidth` | boolean | Full width button                         |
| `ghost`     | boolean | Transparent background                    |
| `pill`      | boolean | Fully rounded corners                     |

#### ToggleButton

Button with pressed/unpressed state.

```json
{
  "type": "ToggleButton",
  "props": {
    "children": "Toggle",
    "pressed": false
  }
}
```

Same props as Button, plus:

- `pressed`: boolean - Current pressed state
- `defaultPressed`: boolean - Initial state (uncontrolled)

---

### Form Components

#### Input

Text input field.

```json
{
  "type": "Input",
  "props": {
    "label": "Email",
    "placeholder": "Enter your email...",
    "type": "email",
    "required": true
  }
}
```

| Prop          | Type    | Description                                             |
| ------------- | ------- | ------------------------------------------------------- |
| `label`       | string  | Field label                                             |
| `description` | string  | Helper text below the input                             |
| `placeholder` | string  | Placeholder text                                        |
| `type`        | string  | Input type: `text`, `email`, `password`, `number`, etc. |
| `size`        | string  | `small`, `medium`, `large`                              |
| `disabled`    | boolean | Disable the input                                       |
| `required`    | boolean | Mark as required                                        |
| `fullwidth`   | boolean | Full width input                                        |

#### Checkbox

Checkbox with label.

```json
{
  "type": "Checkbox",
  "props": {
    "label": "I agree to the terms",
    "description": "You must agree to continue",
    "required": true
  }
}
```

| Prop             | Type    | Description                  |
| ---------------- | ------- | ---------------------------- |
| `label`          | string  | Checkbox label               |
| `description`    | string  | Helper text                  |
| `checked`        | boolean | Controlled checked state     |
| `defaultChecked` | boolean | Initial state (uncontrolled) |
| `indeterminate`  | boolean | Indeterminate state          |
| `disabled`       | boolean | Disable the checkbox         |
| `reversed`       | boolean | Label before checkbox        |
| `bordered`       | boolean | Add border around field      |

#### Switch

Toggle switch.

```json
{
  "type": "Switch",
  "props": {
    "label": "Enable notifications",
    "description": "Receive email updates"
  }
}
```

Same props as Checkbox.

#### Select

Dropdown select.

```json
{
  "type": "Select",
  "props": {
    "label": "Country",
    "placeholder": "Select a country",
    "items": [
      { "label": "United States", "value": "us" },
      { "label": "Canada", "value": "ca" },
      { "label": "Mexico", "value": "mx" }
    ]
  }
}
```

| Prop          | Type    | Description                                          |
| ------------- | ------- | ---------------------------------------------------- |
| `label`       | string  | Field label                                          |
| `description` | string  | Helper text                                          |
| `placeholder` | string  | Placeholder when no selection                        |
| `items`       | array   | Options: `{ label, value, description?, disabled? }` |
| `size`        | string  | `small`, `medium`, `large`                           |
| `disabled`    | boolean | Disable the select                                   |
| `fullwidth`   | boolean | Full width select                                    |

---

### Cards

#### Card

Container card with optional title, description, icon, and footer. **Use props for metadata, children for custom body content only.**

```json
{
  "type": "Card",
  "props": {
    "title": "Card Title",
    "description": "Card description text",
    "tone": "info"
  }
}
```

| Prop          | Type    | Description                                   |
| ------------- | ------- | --------------------------------------------- |
| `title`       | string  | Card title (rendered automatically in header) |
| `description` | string  | Card description (rendered below header)      |
| `footer`      | string  | Footer content                                |
| `tone`        | string  | `positive`, `negative`, `warning`, `info`     |
| `inverted`    | boolean | Inverted color scheme                         |
| `ghost`       | boolean | Minimal borders                               |
| `transparent` | boolean | Transparent background                        |

**Card with custom body content:**

```json
{
  "type": "Card",
  "props": { "title": "Settings" },
  "children": ["form-fields"]
}
```

The `children` will render inside the card body, after the description.

---

## Layout Patterns

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
- [ ] Component types match the registry: `Stack`, `Group`, `Box`, `Text`, `Button`, `Input`, `Checkbox`, `Switch`, `Select`, `Card`, `Separator`, `Layer`, `ToggleButton`
- [ ] **No `style` prop anywhere** - use layout props instead
- [ ] **Precomposed props used** - Card uses `title`/`description`, Input uses `label`, etc.
- [ ] **Minimal element count** - don't create unnecessary wrapper elements
