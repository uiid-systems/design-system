# Component / Pattern Proposal (CPP)

The CPP is the API contract for a component or pattern change. Nothing gets implemented until this is reviewed. Downstream agents (Feature Coder, Designer, Code Review Bot) use this as their source of truth.

**Where this lives:** Notion (the filled-out proposal). This template lives in the repo so agents can reference the structure.

---

## Metadata

| Field         | Value                                          |
| ------------- | ---------------------------------------------- |
| Component     | `{ComponentName}`                              |
| Package       | `@uiid/{package}`                              |
| PRD Link      | [Link to PRD in Notion]                        |
| Linear Tickets| UI-XX, UI-XX, ...                              |
| Risk          | `breaking` / `visual` / `behavioral` / `none`  |
| Size          | `small` / `medium` / `large`                   |
| Author        | Name                                           |
| Date          | YYYY-MM-DD                                     |

---

## 1. API Definition

### Props

```ts
type {ComponentName}Props = {
  // Required props
  // Optional props with defaults noted
};
```

### Slots

| Slot               | Element      | Description              |
| ------------------ | ------------ | ------------------------ |
| `{component-name}` | Root element | Top-level wrapper        |

### Variants

| Prop      | Values                        | Default     |
| --------- | ----------------------------- | ----------- |
| `size`    | `small`, `medium`, `large`    | `medium`    |
| `variant` | `default`, `subtle`           | `default`   |

### Defaults

```ts
const DEFAULTS = {
  size: "medium",
  variant: "default",
};
```

### Controlled vs Uncontrolled

Describe which props support both patterns and how.

### Extensibility

How consumers extend this component:
- `className` merging via `cx()`
- `render` prop (if applicable)
- Exposed subcomponents (if applicable)
- `data-slot` selectors for CSS targeting

---

## 2. State Matrix

Every visual and interactive state the component can be in. Every state listed here must appear in Storybook stories and be covered by tests.

| State     | Trigger              | Visual Change             | ARIA Change          |
| --------- | -------------------- | ------------------------- | -------------------- |
| default   | Initial render       | —                         | —                    |
| hover     | Pointer enter        | Background shift          | —                    |
| focus     | Tab / click          | Focus ring                | —                    |
| active    | Pointer down         | Scale / color shift       | —                    |
| disabled  | `disabled` prop      | Reduced opacity           | `aria-disabled=true` |
| loading   | `loading` prop       | Spinner, content hidden   | `aria-busy=true`     |
| error     | External validation  | Error tone                | `aria-invalid=true`  |

---

## 3. Token Map

### Existing Tokens Used

| Token                          | Property         | Context         |
| ------------------------------ | ---------------- | --------------- |
| `--uiid-color-surface`        | `background`     | Default state   |
| `--uiid-space-3`              | `padding-inline` | All states      |

### New Tokens Proposed

| Token                          | Value            | Justification                  |
| ------------------------------ | ---------------- | ------------------------------ |
| `--uiid-{component}-{prop}`   | `{value}`        | Why this can't use an existing token |

### Token Rules

- [ ] No hard-coded color, spacing, or typography values
- [ ] New tokens justified (not duplicating existing semantic tokens)
- [ ] Component tokens reference semantic tokens, not primitives

---

## 4. Accessibility Contract

### ARIA Roles

| Element      | Role       | Notes                           |
| ------------ | ---------- | ------------------------------- |
| Root         | `{role}`   | Provided by Base UI primitive   |

### Keyboard Interactions

| Key          | Action                                      |
| ------------ | ------------------------------------------- |
| `Tab`        | Focus the component                         |
| `Enter`      | Activate                                    |
| `Space`      | Activate                                    |
| `Escape`     | Close / deactivate (if applicable)          |

### Focus Management

Describe focus behavior: where focus goes on open/close, focus trapping, focus restoration.

### Screen Reader Behavior

What gets announced, when, and in what order.

---

## 5. Registry Impact

- [ ] **New entry?** Does this component need a new registry entry?
- [ ] **Schema changes?** Does `propsSchema` need updating?
- [ ] **Metadata changes?** Category, description, previews affected?
- [ ] **Migration plan?** If changing an existing entry, what breaks?

### Registry Entry Sketch

```ts
export const {ComponentName}Entry: ComponentEntry<typeof {ComponentName}PropsSchema> = {
  name: "{ComponentName}",
  package: "@uiid/{package}",
  hasChildren: true,
  propsSchema: {ComponentName}PropsSchema,
  description: "",
  category: "",
  defaults: {},
};
```

---

## 6. Edge Cases

| Case                 | Expected Behavior                            |
| -------------------- | -------------------------------------------- |
| Long text overflow   |                                              |
| Empty children       |                                              |
| Rapid state changes  |                                              |
| SSR / hydration      |                                              |
| Missing required prop|                                              |

---

## 7. Non-Goals

What this proposal explicitly does NOT cover. Prevents scope creep.

- 
- 

---

## 8. Open Questions

Unresolved decisions that need input before implementation begins.

- 
- 

---

## Exit Criteria

Before this CPP is approved:

- [ ] API is additive (unless breaking change explicitly approved)
- [ ] Every state in the matrix has a clear visual and ARIA description
- [ ] Token usage justified — no hard-coded values, no unnecessary new tokens
- [ ] Accessibility contract complete (roles, keyboard, focus, screen reader)
- [ ] Registry entry sketched
- [ ] Edge cases documented
- [ ] Risk classification accurate
- [ ] Linear tickets reference this CPP

---

<!--
TEMPLATE INSTRUCTIONS (delete this section when using)

This is the output of the Interface Steward agent. It is consumed by:
- Feature Coder: implements against the API definition and state matrix
- Product Designer: designs against the state matrix and token map
- Code Review Bot: validates implementation matches this contract
- QA Agent: validates every state in the matrix is covered

Filling out this template:
- Be specific. "Looks different" is not a visual change. "Background shifts to --uiid-color-surface-hover" is.
- The state matrix is the most important section. If a state isn't here, it won't be built or tested.
- Token map must reference actual token names from packages/tokens, not invented names.
- Registry entry sketch doesn't need to be perfect — it's a target for the Feature Coder.

When to create a CPP:
- New component
- New variant or prop on existing component
- Breaking API change
- Visual redesign

When to skip:
- Pure documentation changes
- Internal refactor with zero API surface change
- Bug fix that doesn't change behavior
-->
