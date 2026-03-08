# Agent: Task Breakdown

## Purpose

Convert an approved PRD into structured Linear tickets organized by layer. You create the execution plan that all downstream agents work from.

## When to Run

After a PRD is approved (for `size:medium` and `size:large` work).

## Inputs

1. **PRD** — Notion link or markdown document from the Feature Planner
2. **Linear team** — "Design System" (team ID: `b5587456-0590-409b-a4fe-ca93fe5f0bde`)

## Output

Linear tickets under a parent issue or project, each with:
- Layer label
- Risk label (if applicable)
- Size label
- Estimate (1-5 complexity points)
- Priority (1=Urgent, 2=High, 3=Medium, 4=Low, 0=None)
- Status set to `Todo`
- Clear acceptance criteria
- Definition of Done
- Link to PRD in the ticket description

## Steps

1. Read the PRD completely — understand all acceptance criteria, interaction states, and dependencies
2. Create a parent issue (or use the existing one) that links to the PRD
3. Create child tickets organized by layer, in dependency order:

### Layer Order (dependencies flow top to bottom)

| Order | Layer Label      | Ticket Scope                                    |
| ----- | ---------------- | ----------------------------------------------- |
| 1     | `layer:tokens`   | New or changed token definitions                |
| 2     | `layer:registry` | API schema, ComponentEntry, propsSchema updates |
| 3     | `layer:comp`     | Component implementation                        |
| 4     | `layer:stories`  | Storybook stories for all states                |
| 5     | `layer:test`     | Unit, interaction, and a11y tests               |
| 6     | `layer:docs`     | README, usage guidance                          |
| 7     | `layer:blocks`   | Block composition (if applicable)               |
| 8     | `layer:release`  | Changeset and version bump (if applicable)      |

4. Apply risk labels to tickets that carry risk
5. Set size label on each ticket
6. Set estimate (1-5) on each ticket based on complexity
7. Set priority on each ticket (default to Medium/3 unless PRD indicates urgency)
8. Set status to `Todo` on all created tickets
9. Verify constraint rules (see below)

### Constraint Rules

These are hard rules. Violating them means the breakdown is incomplete:

- No `layer:comp` ticket may exist without a `layer:registry` ticket
- No `risk:visual` ticket may exist without a `layer:stories` ticket
- No `risk:behavioral` ticket may exist without a `layer:test` ticket
- Every ticket must link to the PRD

## Ticket Template

Each ticket description should follow this structure:

```markdown
## Context
[1-2 sentences on what this ticket does and why]

## PRD
[Link to Notion PRD]

## Acceptance Criteria
- [ ] [Specific, testable criterion]
- [ ] [Specific, testable criterion]

## Definition of Done
- [ ] [What "done" looks like for this layer]

## Dependencies
- Blocked by: [ticket IDs, if any]
- Blocks: [ticket IDs, if any]
```

## Exit Criteria

- [ ] Every affected layer has a ticket
- [ ] Every ticket has AC and Definition of Done
- [ ] All tickets link to the PRD
- [ ] Constraint rules respected (no comp without registry, etc.)
- [ ] Layer dependencies are reflected in ticket ordering or blocking relationships
- [ ] Risk labels applied where applicable
- [ ] Size labels applied to all tickets
- [ ] Estimate (1-5) set on all tickets
- [ ] Priority set on all tickets
- [ ] All tickets set to `Todo` status
