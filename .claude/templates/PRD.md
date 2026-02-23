# Product / Technical Requirements Document (PRD)

The PRD is the output of the Feature Planner agent. It transforms a request into a structured brief that the Task Breakdown and Interface Steward agents consume.

**Where this lives:** Notion (the filled-out document). This template lives in the repo so agents can reference the structure.

---

## Metadata

| Field          | Value                                          |
| -------------- | ---------------------------------------------- |
| Title          | Short name for this feature or change          |
| Type           | `feature` / `refactor` / `component` / `block` / `breaking-change` |
| Size           | `small` / `medium` / `large`                   |
| Author         | Name                                           |
| Date           | YYYY-MM-DD                                     |
| Status         | `draft` / `review` / `approved` / `superseded` |

---

## 1. Problem Statement

What problem does this solve? Who has it? Why does it matter now?

---

## 2. Context & Motivation

Background information. What exists today, what's broken or missing, what triggered this work.

### Existing System References

Components, tokens, packages, or patterns that already exist and relate to this work. This is the reuse map — the Interface Steward will use it to determine what can be extended vs what needs to be new.

| Existing Asset          | Relevance                                   |
| ----------------------- | ------------------------------------------- |
| `@uiid/{package}`      | How it relates to this work                 |

---

## 3. Success Criteria

State-based, testable criteria. Not vague aspirations.

| # | Criterion                                            | Verifiable By        |
| - | ---------------------------------------------------- | -------------------- |
| 1 | Component renders in all states defined in matrix    | Storybook + tests    |
| 2 | No new hard-coded values introduced                  | Code review          |
| 3 | Registry entry complete and accurate                 | Build verification   |

---

## 4. Non-Goals

What this work explicitly does NOT include. Prevents scope creep.

- 
- 

---

## 5. User Stories

| As a...         | I want to...                    | So that...                        |
| --------------- | ------------------------------- | --------------------------------- |
| Consumer dev    |                                 |                                   |
| Design system   |                                 |                                   |
| Contributor     |                                 |                                   |

---

## 6. Acceptance Criteria

These become the checklist on the implementation PR. Each one must be independently verifiable.

### Functional

- [ ] 
- [ ] 

### Visual

- [ ] 
- [ ] 

### Accessibility

- [ ] Keyboard navigation works per spec
- [ ] Screen reader announces correctly
- [ ] Focus management correct

### System

- [ ] Registry updated
- [ ] Tokens only (no hard-coded values)
- [ ] Storybook stories cover all states
- [ ] Tests pass
- [ ] Changeset included (if applicable)

---

## 7. Interaction States

List every state the component or feature can be in. This becomes the source for the CPP state matrix.

| State     | Description                                        |
| --------- | -------------------------------------------------- |
| default   |                                                    |
| hover     |                                                    |
| focus     |                                                    |
| active    |                                                    |
| disabled  |                                                    |
| loading   |                                                    |
| error     |                                                    |

---

## 8. Dependencies

What must exist or be true before this work can start.

| Dependency               | Status    | Owner        |
| ------------------------ | --------- | ------------ |
|                          | `ready` / `blocked` |    |

---

## 9. Risk Classification

| Risk Type   | Level              | Notes                              |
| ----------- | ------------------ | ---------------------------------- |
| Breaking    | `none` / `low` / `high` |                              |
| Visual      | `none` / `low` / `high` |                              |
| Behavioral  | `none` / `low` / `high` |                              |
| Token       | `none` / `low` / `high` | New tokens, changed tokens, etc. |

---

## 10. Open Questions

- 
- 

---

## Exit Criteria

Before this PRD is approved:

- [ ] Acceptance criteria are state-based and independently testable
- [ ] All required interaction states listed
- [ ] Dependencies identified and status known
- [ ] Scope bounded — non-goals documented
- [ ] Risk classification complete
- [ ] Token impact evaluated (new tokens needed? existing tokens affected?)
- [ ] Breaking impact assessed

---

<!--
TEMPLATE INSTRUCTIONS (delete this section when using)

This is the output of the Feature Planner agent. It is consumed by:
- Task Breakdown agent: creates Linear tickets from the AC and interaction states
- Interface Steward agent: uses the reuse map and risk classification to draft the CPP

Common failure modes to avoid:
- AC too vague ("works correctly" → instead: "renders in disabled state with aria-disabled=true")
- No state matrix (forces the Interface Steward to guess)
- Token impact not evaluated (leads to ad-hoc styles sneaking in)
- Breaking impact not assessed (surprises at release time)
- Dependencies not identified (blocked work discovered mid-implementation)

When to create a PRD:
- New feature or component
- Major refactor
- New block
- New package
- Breaking change proposal

When to skip:
- Bug fixes with clear reproduction
- Pure documentation changes
- Dependency updates
-->
