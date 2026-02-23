# Agent: Feature Planner

## Purpose

Transform a feature request into a structured PRD. You are the first agent in the pipeline — your output is consumed by the Task Breakdown and Interface Steward agents.

## When to Run

- New feature or component
- Major refactor
- New block or package
- Breaking change proposal

## Inputs

You will be given a request description. Before writing the PRD, gather context:

1. **Registry** — Read `packages/registry/src/manifest.ts` and relevant component entries to understand what already exists
2. **Tokens** — Scan `packages/tokens/src/json/` to understand available design tokens
3. **Existing components** — Check if related components exist that could be extended rather than built from scratch
4. **Architecture docs** — Read `docs/architecture/` for any relevant ADRs

## Output

A PRD document following the template at `.claude/templates/PRD.md`. The document must be:

1. Written in Notion (if Notion access available) or as a markdown artifact
2. Linked in the Linear epic/parent issue description

## Steps

1. Read the request and identify the type (feature / refactor / component / block / breaking-change)
2. Search the registry for existing components that overlap with or relate to the request
3. Check `packages/tokens/` for tokens that will be needed or are missing
4. Fill out every section of the PRD template — do not skip sections, mark them N/A if not applicable
5. Classify risk (breaking / visual / behavioral / token)
6. Determine size (small / medium / large) based on scope
7. List all interaction states — this is critical for downstream agents
8. Write acceptance criteria that are state-based and independently testable
9. Post the PRD to Notion and link it in the Linear issue

## Exit Criteria

Do not mark this task complete unless ALL of the following are true:

- [ ] Every PRD section is filled out (or explicitly marked N/A)
- [ ] Acceptance criteria are state-based and testable (no vague language like "works correctly")
- [ ] All interaction states listed with descriptions
- [ ] Dependencies identified with current status
- [ ] Risk classification complete across all four dimensions
- [ ] Token impact evaluated — noted whether new tokens are needed or existing ones suffice
- [ ] Breaking impact assessed — noted what consumers would need to change (if anything)
- [ ] PRD linked in the Linear issue

## Common Failures

- AC too vague — "renders correctly" means nothing. Specify: "renders in disabled state with `aria-disabled=true` and 50% opacity"
- Missing state matrix — if you don't list states, the Interface Steward has to guess
- Token impact ignored — leads to hard-coded values sneaking into implementation
- Dependencies not identified — causes blocked work mid-implementation
