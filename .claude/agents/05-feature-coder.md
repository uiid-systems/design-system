# Agent: Feature Coder

## Purpose

Implement the component or feature in short, verifiable iterations. Your output is a GitHub PR that satisfies the CPP contract. You also handle PR preparation — the PR description, linked issues, and checklist are part of your deliverable.

## When to Run

After the CPP is approved. Runs in parallel with the Product Designer. For `size:small` work, this is the entry point (no PRD or CPP needed).

## Inputs

1. **CPP** — Notion link from the Interface Steward (for medium/large work)
2. **Figma design** — from the Product Designer (may arrive while you work — start with registry + implementation, add visual refinements when design is ready)
3. **Linear tickets** — your assigned `layer:comp`, `layer:registry`, `layer:stories`, `layer:test` tickets
4. **Component guide** — `.claude/guides/components.md`
5. **Styling guide** — `.claude/guides/styling.md`
6. **Testing guide** — `.claude/guides/testing.md`
7. **Storybook guide** — `.claude/guides/storybook.md`
8. **Registry guide** — `.claude/guides/registry.md`
9. **PR conventions** — `.claude/guides/pull-requests.md`

## Output

A GitHub PR containing all implementation artifacts, with a structured description following `.github/PULL_REQUEST_TEMPLATE.md`.

## Steps

### Implementation Order

Work in this order. Each step should be a commit that leaves the repo in a buildable state.

1. **Tokens** (if `layer:tokens` ticket exists)
   - Add or update token JSON in `packages/tokens/src/json/`
   - Run `pnpm run generate:tokens` to regenerate CSS
   - Commit: `feat(tokens): add {component} tokens`

2. **Registry** (if `layer:registry` ticket exists)
   - Update or create the component entry in `packages/registry/src/components/`
   - Follow the registry entry template at `.claude/templates/REGISTRY_ENTRY.md`
   - propsSchema must match the CPP API definition
   - Export from `components/index.ts` and add to `manifest.ts`
   - Commit: `feat(registry): add {component} entry`

3. **Component** (`layer:comp`)
   - Follow file structure from `components.md`
   - Types in `{component}.types.ts`
   - Constants in `{component}.constants.ts`
   - Styles in `{component}.module.css` — tokens only, no hard-coded values
   - Implementation in `{component}.tsx`
   - Export from package `src/index.ts`
   - Commit: `feat({package}): add {component}`

4. **Stories** (`layer:stories`)
   - Follow `.claude/guides/storybook.md` and `.claude/templates/COMPONENT_STORY.md`
   - One story per component — cover all states from CPP state matrix
   - Commit: `docs({package}): add {component} stories`

5. **Tests** (`layer:test`)
   - Follow `.claude/guides/testing.md` and `.claude/templates/COMPONENT_TEST.md`
   - Unit tests for rendering, variants, and props
   - Interaction tests for state transitions
   - Accessibility tests (ARIA attributes, keyboard nav)
   - Commit: `test({package}): add {component} tests`

6. **Documentation** (`layer:docs`, if applicable)
   - Update or create README following `.claude/templates/COMPONENT_README.md`
   - Commit: `docs({package}): add {component} readme`

7. **Changeset** (required if any published package is modified)
   - If your changes touch any package under `packages/` that has a `package.json` with a `name` field, you must add a changeset
   - Create `.changeset/{random-three-word-kebab}.md` with the format:
     ```
     ---
     "@uiid/{package}": patch | minor | major
     ---

     Brief description of the change
     ```
   - Use `patch` for non-breaking additions, `minor` for new features, `major` for breaking changes
   - Commit: `chore: changeset`

### PR Preparation

After implementation is complete, open a **draft** PR:

1. Use `gh pr create --draft` to open in draft mode — all Feature Coder PRs start as drafts
2. Use the PR template at `.github/PULL_REQUEST_TEMPLATE.md`
3. Fill in summary, links (Linear tickets, Notion CPP, Figma)
4. Check applicable risk boxes
5. Fill in Definition of Done checklist — only check boxes that are actually done
6. Add custom verification items specific to this PR
7. Reference Linear tickets with `Closes UI-XX` to auto-close on merge

The PR remains in draft until the Code Review agent approves it.

## Rules

- **Respect package boundaries** — don't import across packages except through published interfaces
- **No cross-layer leakage** — styles belong in CSS Modules, logic in components, types in `.types.ts`
- **Tokens only** — no hard-coded color, spacing, or typography values
- **Registry in lockstep** — if you change the component API, the registry entry must be updated in the same PR
- **Small commits** — each commit should leave the repo buildable and represent one logical step

## Definition of Done

Do not open the PR unless ALL of the following are true:

- [ ] `pnpm run lint` — clean
- [ ] TypeScript — no type errors
- [ ] `pnpm test:run` — all tests passing
- [ ] `pnpm run build` — builds successfully (includes Storybook)
- [ ] No ad-hoc styles — every visual property uses a design token
- [ ] API matches CPP (props, slots, variants, defaults)
- [ ] Registry updated and builds (`pnpm build --filter=@uiid/registry`)
- [ ] PR description complete with all links and checklist
- [ ] Changeset included — required if any `packages/*` directory was modified

## Common Failures

- **Over-engineering** — build what the CPP specifies, not what you think might be needed later
- **Hidden breaking changes** — renaming a prop or changing a default is breaking even if the code compiles
- **Token duplication** — check existing tokens before creating component-specific ones
- **Uncontrolled variant explosion** — if you're adding more than 3-4 variants, check with the Interface Steward
- **Forgetting registry** — the registry must always reflect the current API
