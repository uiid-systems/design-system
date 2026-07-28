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
| Separator | N/A | Content |
| Button | N/A | Content |
| ToggleButton | `icon` | Content |
| Form | N/A | Content |
| Input | `placeholder`, `label`, `description` | N/A (no children) |
| NumberField | `placeholder`, `label`, `description` | N/A (no children) |
| Textarea | `placeholder`, `label`, `description` | N/A (no children) |
| Checkbox | `label`, `description` | N/A (no children) |
| CheckboxGroup | `items`, `label`, `description` | N/A (no children) |
| Radio | `label`, `description` | N/A (no children) |
| RadioGroup | `items`, `label`, `description` | N/A (no children) |
| Select | `placeholder`, `items`, `label`, `description` | N/A (no children) |
| Slider | `label`, `description` | N/A (no children) |
| Switch | `label`, `description` | N/A (no children) |
| Text | N/A | Content |
| Card | `title`, `description`, `action`, `footer`, `icon` | Custom body content |
| Accordion | `items` | N/A (no children) |
| Collapsible | N/A | Content |
| Drawer | `title` | Custom body content |
| Modal | `title`, `description`, `action`, `icon`, `footer` | Custom body content |
| Popover | `title`, `description`, `action`, `icon`, `footer` | Custom body content |
| Sheet | `title`, `description`, `action`, `icon`, `footer` | Custom body content |
| Tooltip | N/A | Content |
| Alert | `title`, `description`, `action`, `footer`, `icon` | Custom body content |
| Avatar | `description` | N/A (no children) |
| Badge | N/A | Content |
| Kbd | N/A | Content |
| Status | N/A | Content |
| Timeline | `items` | Content |
| Breadcrumbs | `items` | N/A (no children) |

### Layout

#### Box

Generic flex container with layout and spacing props

Supports children.

Also supports layout props: `gap`, `p`, `ax`, `ay`, `fullwidth`, `fullheight`, `evenly`, plus all spacing (`px`, `py`, `pt`...), margin (`mx`, `my`, `mt`...), border (`b`, `bx`, `by`...), and sizing (`w`, `minw`, `maxw`, `h`, `minh`, `maxh`) props.

#### Stack

A vertical layout component built on flexbox. Foundational building block for both complex and simple layouts.

Use Stack for vertical layouts. Children flow top-to-bottom. ax controls vertical alignment, ay horizontal.

Supports children.

Also supports layout props: `gap`, `p`, `ax`, `ay`, `fullwidth`, `fullheight`, `evenly`, plus all spacing (`px`, `py`, `pt`...), margin (`mx`, `my`, `mt`...), border (`b`, `bx`, `by`...), and sizing (`w`, `minw`, `maxw`, `h`, `minh`, `maxh`) props.

#### Group

Horizontal flex layout (row). ax controls horizontal alignment, ay controls vertical

Use Group for horizontal layouts. Children flow left-to-right. ax controls horizontal alignment, ay vertical.

Supports children.

Also supports layout props: `gap`, `p`, `ax`, `ay`, `fullwidth`, `fullheight`, `evenly`, plus all spacing (`px`, `py`, `pt`...), margin (`mx`, `my`, `mt`...), border (`b`, `bx`, `by`...), and sizing (`w`, `minw`, `maxw`, `h`, `minh`, `maxh`) props.

#### Layer

Positioned layer with offset support for overlays and positioned content

Supports children.

| Prop | Type | Description |
| --- | --- | --- |
| `offset` | object |  |

Also supports layout props: `gap`, `p`, `ax`, `ay`, `fullwidth`, `fullheight`, `evenly`, plus all spacing (`px`, `py`, `pt`...), margin (`mx`, `my`, `mt`...), border (`b`, `bx`, `by`...), and sizing (`w`, `minw`, `maxw`, `h`, `minh`, `maxh`) props.

#### Separator

Visual divider line with horizontal or vertical orientation

Use without children for a simple line divider. Pass children (typically Text) to create a labeled divider like 'or continue with email'.

Supports children.

| Prop | Type | Description |
| --- | --- | --- |
| `children` | string |  |
| `orientation` | "horizontal" | "vertical" |  (default: `"horizontal"`) |
| `shade` | "background" | "surface" | "accent" | "halftone" | "muted" | "foreground" |  |

Also supports spacing props: `p`, `px`, `py`, `m`, `mx`, `my`, etc.

---

### Typography

#### Text

Typography component with size scale, weight, color shades, and text decorations

Supports children.

| Prop | Type | Description |
| --- | --- | --- |
| `children` | string |  |
| `size` | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 |  |
| `weight` | "thin" | "light" | "normal" | "bold" |  |
| `shade` | "background" | "surface" | "accent" | "halftone" | "muted" | "foreground" |  |
| `color` | "red" | "orange" | "yellow" | "green" | "blue" | "indigo" | "purple" | "neutral" |  |
| `align` | "left" | "center" | "right" | "justify" |  |
| `underline` | boolean |  |
| `strikethrough` | boolean |  |
| `balance` | boolean |  |
| `mono` | boolean |  |

Also supports spacing props: `p`, `px`, `py`, `m`, `mx`, `my`, etc.

---

### Buttons

#### Button

Primary action button with multiple size and variant options.

Use Button for primary actions. Set variant for visual weight, use variant="ghost" for minimal chrome.

Supports children.

| Prop | Type | Description |
| --- | --- | --- |
| `children` | string |  |
| `size` | "xsmall" | "small" | "medium" | "large" |  (default: `"medium"`) |
| `variant` | "subtle" | "ghost" |  |
| `disabled` | boolean |  |
| `loading` | boolean |  |
| `fullwidth` | boolean |  |
| `shape` | "pill" | "square" | "circle" |  |
| `tooltip` | string |  |

#### ToggleButton

Toggle button with pressed/unpressed states and optional dynamic icon/text

Supports children.

| Prop | Type | Description |
| --- | --- | --- |
| `children` | string |  |
| `size` | "xsmall" | "small" | "medium" | "large" |  (default: `"medium"`) |
| `variant` | "subtle" | "ghost" |  |
| `disabled` | boolean |  |
| `loading` | boolean |  |
| `fullwidth` | boolean |  |
| `shape` | "pill" | "square" | "circle" |  |
| `tooltip` | string |  |
| `pressed` | boolean |  |
| `defaultPressed` | boolean |  |
| `icon` | object |  |
| `text` | object |  |

---

### Cards

#### Card

Container card with title, description, icon, action, and footer slots

Use Card as a content container. Pass title/description as props, children as body.

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
| `variant` | "ghost" |  |
| `color` | "red" | "orange" | "yellow" | "green" | "blue" | "indigo" | "purple" | "neutral" |  |

Also supports layout props: `gap`, `p`, `ax`, `ay`, `fullwidth`, `fullheight`, `evenly`, plus all spacing (`px`, `py`, `pt`...), margin (`mx`, `my`, `mt`...), border (`b`, `bx`, `by`...), and sizing (`w`, `minw`, `maxw`, `h`, `minh`, `maxh`) props.

**Subcomponent Props (customization escape hatches):**

- `ContainerProps`: Props forwarded to Container
- `HeaderProps`: Props forwarded to Header
- `TitleProps`: Props forwarded to Title
- `DescriptionProps`: Props forwarded to Description
- `IconProps`: Props forwarded to Icon
- `ActionProps`: Props forwarded to Action
- `FooterProps`: Props forwarded to Footer

---

### Forms

#### Form

Form container with built-in validation support.

Form has no visual presence (display:contents). Wrap a Stack inside it for spacing between fields.

Supports children.

#### Input

Text input field with label and description support

| Prop | Type | Description |
| --- | --- | --- |
| `value` | string |  |
| `defaultValue` | string |  |
| `placeholder` | string |  |
| `type` | string |  |
| `size` | "small" | "medium" | "large" |  (default: `"medium"`) |
| `label` | string |  |
| `description` | string |  |
| `disabled` | boolean |  |
| `required` | boolean |  |
| `fullwidth` | boolean |  |
| `ghost` | boolean |  |

#### NumberField

Numeric input with increment/decrement buttons and optional label

Use for numeric input with built-in increment/decrement controls. Supports min, max, and step constraints.

| Prop | Type | Description |
| --- | --- | --- |
| `value` | number |  |
| `defaultValue` | number |  |
| `min` | number |  |
| `max` | number |  |
| `step` | number |  |
| `placeholder` | string |  |
| `label` | string |  |
| `description` | string |  |
| `disabled` | boolean |  |
| `required` | boolean |  |
| `name` | string |  |

#### Textarea

Multi-line text input with label and description support

| Prop | Type | Description |
| --- | --- | --- |
| `value` | string |  |
| `defaultValue` | string |  |
| `placeholder` | string |  |
| `rows` | number |  (default: `3`) |
| `resize` | "none" | "vertical" | "horizontal" | "both" |  (default: `"vertical"`) |
| `size` | "small" | "medium" | "large" |  (default: `"medium"`) |
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

#### CheckboxGroup

Group of checkboxes for multi-select options with label and description

Use for multi-select choice lists. Pass items array with label/value pairs. Value is an array of selected values.

| Prop | Type | Description |
| --- | --- | --- |
| `value` | string[] |  |
| `defaultValue` | string[] |  |
| `items` | object[] |  |
| `label` | string |  |
| `description` | string |  |
| `direction` | "horizontal" | "vertical" |  (default: `"vertical"`) |
| `disabled` | boolean |  |
| `required` | boolean |  |
| `reversed` | boolean |  |
| `bordered` | boolean |  |
| `hideIndicators` | boolean |  |
| `name` | string |  |

#### Radio

Radio button input with label and description support

Use Radio within a RadioGroup for single-select options. For standalone usage, wrap in RadioGroup.Root.

| Prop | Type | Description |
| --- | --- | --- |
| `value` | string |  |
| `label` | string |  |
| `description` | string |  |
| `disabled` | boolean |  |
| `required` | boolean |  |
| `reversed` | boolean |  |
| `bordered` | boolean |  |
| `hideIndicator` | boolean |  |

#### RadioGroup

Group of radio buttons for single-select options with label and description

Use for single-select choice lists. Pass items array with label/value pairs.

| Prop | Type | Description |
| --- | --- | --- |
| `value` | string |  |
| `defaultValue` | string |  |
| `items` | object[] |  |
| `label` | string |  |
| `description` | string |  |
| `direction` | "horizontal" | "vertical" |  (default: `"vertical"`) |
| `disabled` | boolean |  |
| `required` | boolean |  |
| `reversed` | boolean |  |
| `bordered` | boolean |  |
| `hideIndicators` | boolean |  |
| `name` | string |  |

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
| `size` | "small" | "medium" | "large" |  (default: `"medium"`) |
| `disabled` | boolean |  |
| `required` | boolean |  |
| `fullwidth` | boolean |  |
| `ghost` | boolean |  |

#### Slider

Range slider input with optional label and description

Use for selecting numeric values within a range. Supports single value or range (array of two values).

| Prop | Type | Description |
| --- | --- | --- |
| `value` | number | number[] |  |
| `defaultValue` | number | number[] |  |
| `min` | number |  (default: `0`) |
| `max` | number |  (default: `100`) |
| `step` | number |  (default: `1`) |
| `label` | string |  |
| `description` | string |  |
| `disabled` | boolean |  |
| `ghost` | boolean |  |
| `fullwidth` | boolean |  |

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

### Indicators

#### Alert

Semantic alert component for displaying important messages with optional title and actions

Use Alert for important messages with optional title and actions.

Supports children.

**Slots (use as props):**
- `title`: Alert heading
- `description`: Alert message text
- `action`: Action buttons
- `footer`: Footer content
- `icon`: Alert icon

| Prop | Type | Description |
| --- | --- | --- |
| `children` | string |  |
| `title` | string |  |
| `description` | string |  |
| `action` | string |  |
| `footer` | string |  |
| `icon` | string |  |

#### Avatar

User avatar with initials fallback, name, and optional description

Use Avatar for user profiles. Pass initials as fallback, name for display. Use orientation for layout direction.

| Prop | Type | Description |
| --- | --- | --- |
| `initials` | string |  |
| `name` | string |  |
| `description` | string |  |
| `color` | "red" | "orange" | "yellow" | "green" | "blue" | "indigo" | "purple" | "neutral" |  |
| `orientation` | "horizontal" | "vertical" |  (default: `"horizontal"`) |

**Subcomponent Props (customization escape hatches):**

- `ContainerProps`: Props forwarded to Container
- `ImageProps`: Props forwarded to Image
- `InitialsProps`: Props forwarded to Initials
- `NameProps`: Props forwarded to Name
- `DescriptionProps`: Props forwarded to Description

#### Badge

Status badge for labels, counts, or tags

Use Badge for status labels, counts, or tags.

Supports children.

| Prop | Type | Description |
| --- | --- | --- |
| `children` | string |  |
| `size` | "small" | "medium" | "large" |  (default: `"medium"`) |
| `color` | "red" | "orange" | "yellow" | "green" | "blue" | "indigo" | "purple" | "neutral" |  |

#### Kbd

Keyboard key indicator for displaying keyboard shortcuts

Use Kbd to display keyboard shortcuts. Wrap each key separately for multi-key combinations.

Supports children.

| Prop | Type | Description |
| --- | --- | --- |
| `children` | string |  |

#### Progress

Progress bar indicator for showing completion status

Use to show progress of an operation. Pass null for indeterminate state.

| Prop | Type | Description |
| --- | --- | --- |
| `value` | number | null |  |

#### Status

Status dot indicator with optional label and pulsing animation

Use Status for online/offline indicators or activity states. Set pulse for live activity.

Supports children.

| Prop | Type | Description |
| --- | --- | --- |
| `children` | string |  |
| `pulse` | boolean |  |
| `inverted` | boolean |  |
| `color` | "red" | "orange" | "yellow" | "green" | "blue" | "indigo" | "purple" | "neutral" |  |

#### Timeline

Vertical timeline for chronological events with a marker rail and active-step tracking

Use Timeline for chronological events. Pass an `items` array for simple usage, or compose `TimelineItem`s as children. Every item renders its content in a Card — `title`/`time` fill the card header and `content`/children fill the body; pass `CardProps={{ variant: "ghost" }}` (root or per item) for flat rows. For steppers, set `activeIndex` to mark the current step (earlier items render as completed). For feeds of past events, set `defaultStatus="completed"` instead. Pass a `marker` node (small icon) to render inside the rail dot, or a `media` node (icon or Avatar) for a prominent leading column left of the rail. Use `gap` to control the space between items.

Supports children.

| Prop | Type | Description |
| --- | --- | --- |
| `children` | string |  |
| `items` | object[] |  |
| `dir` | "ltr" | "rtl" |  |
| `activeIndex` | number |  |
| `defaultStatus` | "completed" | "active" | "pending" |  |
| `gap` | number |  |
| `color` | "red" | "orange" | "yellow" | "green" | "blue" | "indigo" | "purple" | "neutral" |  |

**Subcomponent Props (customization escape hatches):**

- `ItemProps`: Props forwarded to Item
- `MediaProps`: Props forwarded to Media
- `MarkerProps`: Props forwarded to Marker
- `ConnectorProps`: Props forwarded to Connector
- `CardProps`: Props forwarded to Card
- `TitleProps`: Props forwarded to Title
- `TimeProps`: Props forwarded to Time
- `DescriptionProps`: Props forwarded to Description
- `HeadingProps`: Props forwarded to Heading

---

### Interactive

#### Accordion

Collapsible accordion panels for organizing content

Use for collapsible content sections. Set multiple=true to allow multiple panels open simultaneously.

| Prop | Type | Description |
| --- | --- | --- |
| `items` | object[] |  |
| `value` | string | string[] |  |
| `defaultValue` | string | string[] |  |
| `multiple` | boolean |  |
| `disabled` | boolean |  |
| `orientation` | "horizontal" | "vertical" |  (default: `"vertical"`) |
| `fullwidth` | boolean |  |

#### Collapsible

Expandable content panel that can be toggled open or closed via a trigger element

Use Collapsible to hide/show content. Pass the toggle element as trigger, content as children.

Supports children.

| Prop | Type | Description |
| --- | --- | --- |
| `children` | string |  |
| `trigger` | string |  |
| `instant` | boolean |  (default: `false`) |
| `open` | boolean |  |
| `defaultOpen` | boolean |  |
| `onOpenChange` | function |  |

**Subcomponent Props (customization escape hatches):**

- `PanelProps`: Props forwarded to Panel

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
| `direction` | "top" | "right" | "bottom" | "left" |  (default: `"bottom"`) |
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
| `size` | "small" | "medium" | "large" | "xlarge" |  (default: `"medium"`) |
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
| `side` | "top" | "right" | "bottom" | "left" |  (default: `"right"`) |
| `open` | boolean |  |
| `onOpenChange` | function |  |

#### Toaster

Container for toast notifications

| Prop | Type | Description |
| --- | --- | --- |
| `position` | "top" | "bottom" |  (default: `"bottom"`) |

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

### Navigation

#### Breadcrumbs

Breadcrumb navigation showing page hierarchy

Use to show navigation hierarchy. Last item is typically the current page.

| Prop | Type | Description |
| --- | --- | --- |
| `items` | object[] |  |

---

### All Component Types

Valid types: Box, Stack, Group, Layer, Separator, Button, ToggleButton, Form, Input, NumberField, Textarea, Checkbox, CheckboxGroup, Radio, RadioGroup, Select, Slider, Switch, Text, Card, Accordion, Collapsible, Drawer, Modal, Popover, Sheet, Toaster, Tooltip, Alert, Avatar, Badge, Kbd, Progress, Status, Timeline, Breadcrumbs

