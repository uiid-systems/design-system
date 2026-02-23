# Figma File Structure

> For the agent workflow and MCP tool usage, see `.claude/guides/figma.md`. For the step-by-step construction script, see `.claude/templates/FIGMA_COMPONENT.md`.

Conventions for the UIID Figma file. Every decision here optimizes for Code Connect
generation -- Figma component names, property names, and property values must match code
exactly so that mappings are automatic, not manually maintained.

---

## Page Structure

One page per registry category, in registry order. Plus two utility pages at the top.

| Page              | Contents                                              |
| ----------------- | ----------------------------------------------------- |
| **Cover**         | File cover, version, last-updated date                |
| **Tokens**        | Color swatches, spacing scale, typography scale, shadows -- visual reference for the token system |
| **Layout**        | Box, Stack, Group, Layer, Separator                   |
| **Typography**    | Text                                                  |
| **Buttons**       | Button, ToggleButton                                  |
| **Cards**         | Card                                                  |
| **Forms**         | Form, Input, NumberField, Textarea, Checkbox, CheckboxGroup, Radio, RadioGroup, Select, Slider, Switch |
| **Indicators**    | Alert, Avatar, Badge, Kbd, Progress, Status, Timeline |
| **Interactive**   | Accordion, Collapsible                                |
| **Overlays**      | Drawer, Modal, Popover, Sheet, Toaster, Tooltip       |
| **Navigation**    | Breadcrumbs                                           |

When a new component is added to the registry, it goes on the page matching its
`category` field. When a new category is added to the registry, a new page is created
in the same position as the category's index in the `categories` array.

---

## Section Layout Within Pages

Each page is organized into sections (Figma's native section feature). Every component
gets its own section, named with the component's PascalCase name.

Within a component section, arrange content in this order:

1. **Base** -- the default component instance with no optional props set
2. **Variants** -- a row per variant axis, showing all values (e.g., size: xsmall | small | medium | large)
3. **States** -- interactive states: default, hover, focus, active, disabled, loading
4. **Compositions** -- common multi-component patterns using this component (e.g., Button inside a Card footer)

Use Figma auto-layout frames for each group. Label each group with a text node above it
using the format `{ComponentName} / {GroupName}` (e.g., "Button / Variants",
"Button / States").

**Spacing between groups:** 64px vertical. **Spacing between items within a group:** 16px.
These match the token scale (spacing 16 = 64px, spacing 4 = 16px).

---

## Component Naming

Figma component names must exactly match code component names. No exceptions.

| Rule                           | Example                                |
| ------------------------------ | -------------------------------------- |
| PascalCase, no spaces          | `Button`, `RadioGroup`, `ToggleButton` |
| Match the registry `name` field | `NumberField` (not "Number Field")     |
| No category prefix             | `Card` (not "Cards/Card")             |
| No "Component" suffix          | `Switch` (not "SwitchComponent")       |

**Subcomponents** use dot notation: `Accordion.Item`, `Breadcrumbs.Item`,
`Timeline.Item`. This matches how Code Connect resolves nested components.

**Why no slash separators:** Figma interprets slashes as hierarchy separators for
the assets panel. Dots are literal in component names and map cleanly to Code Connect's
subcomponent resolution.

---

## Property Naming

Figma component properties must exactly match code prop names. This is the most
critical convention -- mismatches here break Code Connect generation.

| Code Prop    | Figma Property Name | Figma Property Type |
| ------------ | ------------------- | ------------------- |
| `variant`    | `variant`           | Variant             |
| `size`       | `size`              | Variant             |
| `tone`       | `tone`              | Variant             |
| `shape`      | `shape`             | Variant             |
| `disabled`   | `disabled`          | Boolean             |
| `loading`    | `loading`           | Boolean             |
| `fullwidth`  | `fullwidth`         | Boolean             |
| `children`   | `children`          | Text                |
| `label`      | `label`             | Text                |
| `placeholder`| `placeholder`       | Text                |
| `description`| `description`       | Text                |

Rules:

- **Lowercase, no spaces, no hyphens.** Code props are camelCase; Figma property names
  use the same casing. `fullwidth` in code = `fullwidth` in Figma.
- **Boolean props use Figma boolean properties.** Not variant toggles, not instance swaps.
  `disabled` is a Figma boolean, not a variant with "true"/"false" values.
- **Text content uses Figma text properties.** `children`, `label`, `placeholder`,
  `description` are text properties, not hidden layers.
- **Enum props use Figma variant properties.** `size`, `variant`, `tone`, `shape` are
  variant properties with values that match the code enum exactly.

### Props that do not map to Figma

Some code props have no Figma equivalent. Do not create Figma properties for these:

- Event handlers (`onClick`, `onChange`, `onValueChange`)
- Ref forwarding (`ref`)
- Subcomponent override props (`RootProps`, `ThumbProps`, `InputProps`)
- Layout/spacing props (`gap`, `p`, `m`, `ax`, `ay`) -- these are composition concerns
- `className`, `style`
- `tooltip` (represented as a separate Tooltip component wrapping the target)

---

## Value Naming

Figma property values must exactly match code enum values. Lowercase, no transformation.

| Code Enum Value  | Figma Value  | Wrong                              |
| ---------------- | ------------ | ---------------------------------- |
| `subtle`         | `subtle`     | "Subtle", "SUBTLE", "btn-subtle"   |
| `ghost`          | `ghost`      | "Ghost", "GHOST"                   |
| `inverted`       | `inverted`   | "Inverted", "INVERTED"             |
| `xsmall`         | `xsmall`     | "XSmall", "x-small", "Extra Small" |
| `small`          | `small`      | "Small", "sm"                      |
| `medium`         | `medium`     | "Medium", "md"                     |
| `large`          | `large`      | "Large", "lg"                      |
| `positive`       | `positive`   | "Positive", "success", "green"     |
| `critical`       | `critical`   | "Critical", "error", "danger"      |
| `warning`        | `warning`    | "Warning", "warn"                  |
| `info`           | `info`       | "Info", "information"              |
| `pill`           | `pill`       | "Pill", "rounded"                  |
| `square`         | `square`     | "Square", "rect"                   |
| `circle`         | `circle`     | "Circle", "round"                  |

**Default values:** Set the Figma component's default property values to match the
code defaults. For Button, `size` defaults to `medium`, no `variant` is set (base style),
no `tone` is set.

---

## Variant Axis Strategy

Not every enum prop should become a Figma variant axis. A full cartesian product
creates an unmanageable number of variants (e.g., Button with 4 sizes × 4 variants
× 5 tones × 4 shapes = 320 variants). Instead, select variant axes deliberately.

### Deciding what becomes a variant axis

Use this priority order to decide which enum props become variant axes:

1. **Always a variant axis:** Props that change the component's structure or sizing
   (e.g., `size` — different padding, font size, height).
2. **Usually a variant axis:** Props that change the component's visual identity
   (e.g., `variant` — different bg/fg/border tokens).
3. **Variant axis when commonly varied:** Props that are frequently changed together
   with the above (e.g., `tone` — different semantic colors, used across most
   variant/size combos).
4. **Display instances only:** Props that change a single visual property and can be
   overridden on instances (e.g., `shape` — just cornerRadius and aspect-ratio).

**Target:** Keep the variant count under ~100. Beyond that, the component set becomes
unwieldy in Figma's variant grid.

### Props that should NOT be variant axes

These are always component properties, never variant axes:

- Boolean toggles (`disabled`, `loading`, `fullwidth`) → Boolean properties
- Text content (`children`, `label`, `placeholder`) → Text properties
- Override-friendly props (`shape`) → Show as display instances in the Variants section

### Display instances for non-variant props

Props that aren't variant axes are documented in the **Variants** section as display
instances — real instances of the component with manual overrides applied. For example,
`shape=pill` is shown by creating an instance and setting `cornerRadius = 99999`.
This gives designers a visual reference without bloating the variant count.

---

## Full Example: Button

The Button component in Figma demonstrates all conventions applied together.

**Component name:** `Button`

**Variant axes** (3 axes, 80 variants = 4 × 4 × 5):

| Property    | Type    | Values                                    | Default  |
| ----------- | ------- | ----------------------------------------- | -------- |
| `size`      | Variant | `xsmall`, `small`, `medium`, `large`      | `medium` |
| `variant`   | Variant | `default`, `subtle`, `ghost`, `inverted`  | `default`|
| `tone`      | Variant | `none`, `positive`, `critical`, `warning`, `info` | `none` |

**Component properties** (not variant axes):

| Property    | Type    | Default  | Notes |
| ----------- | ------- | -------- | ----- |
| `disabled`  | Boolean | false    | |
| `loading`   | Boolean | false    | |
| `fullwidth` | Boolean | false    | |
| `children`  | Text    | "Button" | Linked to text nodes via `componentPropertyReferences` |

**Display instances** (shown in Variants section, not variant axes):

| Property    | Values                                | Override method |
| ----------- | ------------------------------------- | --------------- |
| `shape`     | `default`, `pill`, `square`, `circle` | cornerRadius + resize on instances |

Note: `variant` and `tone` include a `default` / `none` value for the unset state.
In code, these props are optional (not passing them gives the base style). In Figma,
variant properties require an explicit value, so `default` / `none` represents the
unset state.

**Section layout on the Buttons page:**

```
Section: Button
  ├── Button / Base
  │   └── Single Button instance, all defaults (medium / default / none)
  ├── Button / Variants
  │   └── Row: shape (default, pill, square, circle) — display instances with overrides
  ├── Button / States
  │   └── Row: default, hover, focus, active, disabled, loading
  └── Button / Compositions
      ├── Button group (default + subtle + ghost)
      └── Tone buttons (positive + critical + warning + info)
```

---

## Registry Integration

The `ComponentEntry` type includes a `figma` field:

```ts
figma?: { nodeId: string }
```

After creating a component in Figma, copy its node ID from the URL
(`figma.com/file/{fileId}?node-id={nodeId}`) and add it to the component's registry
entry. This is what Code Connect reads to map Figma nodes to code components.

```ts
export const ButtonEntry: ComponentEntry = {
  name: "Button",
  package: "@uiid/buttons",
  // ...
  figma: { nodeId: "123:456" },
};
```

Every registered component must have a `figma.nodeId` once its Figma component exists.
This is enforced during code review for any PR that adds or modifies a Figma component.

---

## Checklist for Adding a Component to Figma

1. Create a Figma component on the correct category page
2. Name it exactly as the registry `name` field (PascalCase, no prefix/suffix)
3. Add Figma properties matching each code prop (same name, same casing)
4. Set property values to match code enum values exactly (lowercase)
5. Set default property values to match code defaults
6. Copy the Figma node ID and add it to the registry entry's `figma.nodeId`
7. Arrange the section: Base, Variants, States, Compositions
