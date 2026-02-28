# Token Naming Guide

Reference guide for design token naming conventions, synthesized from industry best
practices. Used as the benchmark for auditing the UIID token system.

Sources: [Name Design Tokens Guide](https://www.namedesigntokens.guide/),
[Smashing Magazine](https://www.smashingmagazine.com/2024/05/naming-best-practices/),
[Smart Interface Design Patterns](https://smart-interface-design-patterns.com/articles/naming-design-tokens/),
[Nord Design System](https://nordhealth.design/naming/),
[Aufait UX](https://www.aufaitux.com/blog/naming-design-tokens/)

---

## Naming Structure

The consensus formula across major design systems:

```
{namespace}-{category}-{property}-{modifier}
```

Where:

| Level        | Position  | Purpose                                          | Examples                            |
| ------------ | --------- | ------------------------------------------------ | ----------------------------------- |
| **Namespace** | Prepended | System/brand identifier, prevents collisions     | `n-`, `ds-`, (or omitted if single system) |
| **Category**  | Base      | The design property domain                       | `color`, `space`, `font`, `shadow`  |
| **Property/Role** | Middle | What it does, not what it looks like           | `background`, `border`, `text`, `accent` |
| **Modifier**  | Appended  | Variant, state, scale, or mode                   | `hover`, `strong`, `sm`, `dark`     |

### Scale Guidelines

- **Small systems** (single product): 2-4 naming levels
- **Large multi-platform systems**: 5-6 naming levels

## Core Principles

### 1. Semantic over visual

Names describe purpose, not appearance. `color-accent` not `color-blue`.
`shade-foreground` not `shade-dark`. This lets values change without renaming.

### 2. Consistent casing

Pick one convention and enforce it everywhere. Most design systems use **kebab-case**
for CSS custom properties. CamelCase and kebab-case should never mix in the same tier.

### 3. Full words over abbreviations

Use `background` not `bg`, `foreground` not `fg`, `padding` not `p`. Abbreviations
save keystrokes but cost clarity, especially for new team members.

The counterargument: some abbreviations are so universal they're clearer than the
full word (e.g., `sm`, `md`, `lg` for sizing). The rule is: abbreviate scale values,
spell out property names.

### 4. Predictable structure

A developer should be able to guess a token name without looking it up. If
`button-background-hover` exists, `input-background-hover` should too. Consistency
across components matters more than any single name.

### 5. Unique and unambiguous

No two tokens should be confusable. Avoid homonyms. `surface` and `accent` are
better than `light` and `lighter`.

### 6. Scalable

The system must accommodate new tokens without restructuring. T-shirt sizing
(`xs`, `sm`, `md`, `lg`, `xl`) scales better than numbered sequences for bounded
ranges. Numbered scales (`1`-`12`) work for open-ended spectrums like shade/color ramps.

## Token Hierarchy

The three-tier model is industry consensus:

| Tier           | Purpose                    | Consumers                    | Naming pattern                     |
| -------------- | -------------------------- | ---------------------------- | ---------------------------------- |
| **Primitive**  | Raw palette values         | Semantic tokens only         | `color-red`, `space-4`, `font-sans` |
| **Semantic**   | Meaning-based references   | Components, consumers        | `shade-foreground`, `tone-critical` |
| **Component**  | Component-specific values  | Internal to the design system | `button-background-hover`          |

**Key rule**: each tier only references the tier above it. Components reference
semantic tokens, semantic tokens reference primitives. Skipping tiers (component
referencing a primitive directly) creates fragile coupling.

## Color Naming

Colors are the most complex naming domain. Best practices:

- **Primitives**: Named by hue + optional scale (`red`, `blue-500`)
- **Semantic**: Named by role (`background`, `foreground`, `accent`, `surface`)
- **Status/tone**: Named by meaning (`positive`, `critical`, `warning`, `info`)
- **Variants**: Append usage (`-surface`, `-border`, `-foreground`)
- **States**: Append state (`-hover`, `-active`, `-focus`, `-disabled`)

## Sizing and Spacing

- **T-shirt sizes** for bounded scales: `xs`, `sm`, `md`, `lg`, `xl`
- **Numeric scales** for open ranges: `1`, `2`, `3`... or `100`, `200`, `300`...
- **Base unit** approach: define a unit, derive everything from multiples

## Testing Token Names

Validate naming with these questions:

1. **Clarity**: Can a new team member understand what this token does?
2. **Consistency**: Does it follow the same pattern as sibling tokens?
3. **Scalability**: Can we add more tokens without restructuring?
4. **Predictability**: Could someone guess this name from the pattern?
5. **Specificity vs. flexibility**: Is it reusable but not vague?
