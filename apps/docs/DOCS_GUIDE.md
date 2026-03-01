# LLM Guidelines for UIID Documentation Site

This document provides rules for AI models working on the UIID documentation site.

---

## Critical Concepts

### Use Precomposed Components

Always prefer precomposed components over decomposed subcomponents. UIID components handle their own internal structure.

**WRONG — Using subcomponents directly:**

```tsx
<AccordionRoot>
  <AccordionItem value="item">
    <AccordionHeader>
      <AccordionTrigger>Title</AccordionTrigger>
    </AccordionHeader>
    <AccordionPanel>Content</AccordionPanel>
  </AccordionItem>
</AccordionRoot>
```

**CORRECT — Using precomposed component:**

```tsx
<Accordion
  items={[{ value: "item", trigger: "Title", content: <Content /> }]}
  multiple
  fullwidth
/>
```

When subcomponent customization is needed, use the `*Props` escape hatches:

```tsx
<Accordion
  items={items}
  RootProps={{ ghost: true }}
  TriggerProps={{ className: "custom" }}
/>
```

### Typography Constraints

- **Preferred sizes:** 0, 1, 2
- **Reserved for small details only:** -1 (prop counts, type annotations, "Default:" labels)
- **Never use sizes below -1** in the docs app

```tsx
// Good
<Text size={1} weight="bold">Prop name</Text>
<Text size={0} shade="muted">Description</Text>
<Text size={-1} shade="halftone">Default: true</Text>

// Bad
<Text size={3}>Too large for docs content</Text>
<Text size={-2}>Size doesn't exist</Text>
```

### Spacing Constraints

- **Minimum gap:** 2
- **Minimum padding:** 2
- Never use gap={1} or p={1} in the docs app

```tsx
// Good
<Stack gap={3}>
<Group gap={2}>
<Box py={3} px={4}>

// Bad
<Stack gap={1}>  // Too tight
<Box p={1}>      // Too tight
```

---

## Design Patterns

### Progressive Disclosure

Information should be layered. Show the essential summary first, with details available on demand.

**Pattern: Collapsible Sections**

```tsx
// Core props always visible, secondary sections collapsed
<Stack gap={4} fullwidth>
  <CorePropsSection props={coreProps} />
  <Collapsible trigger={<Text weight="bold">Style Props</Text>}>
    {/* Compact grouped summary */}
  </Collapsible>
  <Collapsible trigger={<Text weight="bold">Slot Props</Text>}>
    {/* PropRow entries with forwarding descriptions */}
  </Collapsible>
</Stack>
```

### Visual Hierarchy

1. **Prop name:** `size={0} weight="bold" mono`
2. **Type annotation:** `size={-1} shade="muted" mono`
3. **Description:** `size={0} shade="muted"`
4. **Secondary info:** `size={-1} shade="halftone"`

### Container Usage

Use proper semantic containers:

| Need | Component |
|------|-----------|
| Lifted surface with shadow/border | `Card` or `CardContainer` |
| Simple flex container | `Box`, `Stack`, `Group` |
| Collapsible sections | `Collapsible` |

**Never** add borders/backgrounds via inline styles to simulate cards:

```tsx
// Bad
<Box style={{ background: "var(--shade-1)", border: "1px solid var(--shade-accent)" }}>

// Good
<Card ghost>
// or
<Collapsible>
```

---

## Props Table Patterns

### Structure

The `PropsTable` renders three sections in a flat `Stack` — no outer `Accordion`:

1. **Core Props** — Always visible. Each prop rendered as a `PropRow`.
2. **Style Props** — Collapsed `Collapsible`. Compact grouped summary with `CodeInline` chips per category. Toggle props (`fullwidth`, `fullheight`, `evenly`) rendered as mini PropRow items.
3. **Slot Props** — Collapsed `Collapsible`. Each entry shows the prop name and a forwarding description (e.g. "Forwarded to the internal Container element").

### Style Props Categories

Style props are grouped by category inside a single collapsed `Collapsible`. Each category shows a label, description, and `CodeInline` chips:

| Category | Props |
|----------|-------|
| Spacing | `p`, `px`, `py`, `pt`, `pr`, `pb`, `pl`, `m`, `mx`, `my`, `mt`, `mr`, `mb`, `ml` |
| Layout | `gap`, `ax`, `ay`, `direction`, `wrap` |
| Sizing | `w`, `h`, `minw`, `maxw`, `minh`, `maxh` |
| Border | `b`, `bx`, `by`, `bt`, `br`, `bb`, `bl` |
| Toggle | `fullwidth`, `fullheight`, `evenly` (rendered as name + `boolean` type) |

### PropRow Structure

```tsx
<Box bb={1}>
  <Stack gap={2}>
    {/* Line 1: name + required badge + type (type hidden when enum chips shown) */}
    <Group gap={3} ay="center">
      <Text size={0} weight="bold" mono>{prop.name}</Text>
      {prop.required && <Badge tone="critical" size="small" hideIndicator>required</Badge>}
      {!prop.enumValues && <Text size={-1} shade="muted" mono>{prop.type}</Text>}
    </Group>

    {/* Line 2: enum values as CodeInline chips (replaces type string) */}
    {prop.enumValues && (
      <Group gap={2}>
        {prop.enumValues.map(val => <CodeInline key={val}>{val}</CodeInline>)}
      </Group>
    )}

    {/* Line 3: description + default */}
    <Group gap={2} ay="baseline">
      <Text size={0} shade="muted">{prop.description}</Text>
      <Text size={-1} shade="halftone">Default: <CodeInline>{defaultValue}</CodeInline></Text>
    </Group>
  </Stack>
</Box>
```

---

## Component Imports

Standard imports for docs components:

```tsx
import { Badge } from "@uiid/indicators";
import { CodeInline } from "@uiid/code";
import { Collapsible } from "@uiid/interactive";
import { Box, Group, Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";
```

---

## Component Prop Availability

Not all components have the same style props. Know which props each component accepts:

| Component | Spacing | Sizing | Layout | Border |
|-----------|---------|--------|--------|--------|
| `Box`     | ✓       | ✓      | ✓      | ✓      |
| `Stack`   | ✓       | ✓      | ✓      | ✓      |
| `Group`   | ✓       | ✓      | ✓      | ✓      |
| `Text`    | ✓       | ✗      | ✗      | ✗      |

**Important:** If you need sizing on text (e.g., `minw` for column alignment), wrap in a `Box`:

```tsx
// Wrong — Text doesn't have minw
<Text minw={10}>Name</Text>

// Correct — wrap in Box
<Box minw={10}>
  <Text>Name</Text>
</Box>
```

---

## Best Practices

### DO

1. Use precomposed components with `*Props` for customization
2. Keep text sizes in the 0-2 range (-1 for small details only)
3. Use gaps and padding of 2 or greater
4. Apply progressive disclosure — summary first, details on demand
5. Use `Badge` for status indicators (required, count, etc.)
6. Use `CodeInline` for prop names, types, and values
7. Use semantic shade values: `muted` for secondary, `halftone` for tertiary

### DON'T

1. Don't decompose components into subcomponents unless absolutely necessary
2. Don't use inline styles for backgrounds/borders — use Card or Accordion
3. Don't use text sizes below -1 or above 2 for content
4. Don't use gap/padding values below 2
5. Don't hide all information behind accordions — show category names at minimum
6. Don't over-engineer — flat structures are often clearer than deeply nested ones

---

## Validation Checklist

Before submitting docs component changes:

- [ ] All text uses sizes 0-2 (or -1 for small details)
- [ ] All gaps and padding are ≥ 2
- [ ] Precomposed components used where available
- [ ] No inline style objects for layout/backgrounds
- [ ] Progressive disclosure applied appropriately
- [ ] Visual hierarchy is clear (name > type > description > metadata)
