# Pull Review Conventions

Companion to `pull-requests.md`. Covers how to request, conduct, and respond to code reviews — for both humans and agents.

## Skills

Three skills are installed at the project level (`.agents/skills/`) and available to all contributors:

| Skill | Invoke | Role |
|-------|--------|------|
| `requesting-code-review` | `/requesting-code-review` | Dispatches a review subagent with git SHAs |
| `receiving-code-review` | `/receiving-code-review` | Guides how to act on feedback technically |
| `code-review-excellence` | `/code-review-excellence` | The review rubric — 4-phase process + severity labels |

---

## When to Request a Review

**Mandatory:**
- Before every merge to `main`
- After completing a major feature or new component
- After each task in subagent-driven development

**Optional but valuable:**
- When stuck — a review provides a fresh perspective
- Before a significant refactor — establishes a baseline
- After fixing a complex bug

**Never skip because "it's simple."** Simple changes are where assumptions sneak through.

---

## Requesting a Review

Use the `/requesting-code-review` skill. It dispatches a `code-reviewer` subagent using git SHAs to scope the diff.

**1. Get your SHAs:**

```bash
BASE_SHA=$(git rev-parse origin/main)  # or the commit before your work
HEAD_SHA=$(git rev-parse HEAD)
```

**2. Invoke the skill and provide:**
- What was implemented
- The plan or requirements it should satisfy
- `BASE_SHA` and `HEAD_SHA`
- A brief description

**3. Act on feedback** using the severity guide below.

---

## Severity Labels

All review comments must use one of these labels:

| Label | Emoji | Meaning |
|-------|-------|---------|
| `blocking` | 🔴 | Must fix before merge |
| `important` | 🟡 | Should fix; discuss if you disagree |
| `nit` | 🟢 | Nice to have, not blocking |
| `suggestion` | 💡 | Alternative approach to consider |
| `learning` | 📚 | Educational context, no action needed |
| `praise` | 🎉 | Good work |

**Example:**
```
🔴 [blocking] This component mutates the `user` prop directly. Props must be treated as read-only.

🟢 [nit] Consider renaming `data` to `userData` for clarity.

🎉 [praise] Excellent test coverage — edge cases are well handled here.
```

---

## The Review Process (4 Phases)

### Phase 1 — Context (2–3 min)
- Read the PR description and linked Linear issue
- Check PR size — if >400 lines, request a split before reviewing
- Confirm CI is passing (tests, lint, type check)
- Note any relevant architectural decisions

### Phase 2 — High-Level (5–10 min)
- **Architecture**: Does the solution fit the problem? Consistent with existing patterns?
- **File placement**: Are new files in the right package? Correct directory?
- **Exports**: Are new components/types exported from `src/index.ts`?
- **Testing strategy**: Are tests present? Do they cover behavior, not implementation?

### Phase 3 — Line-by-Line (10–20 min)

For each file, check:

**Logic & Correctness**
- Edge cases handled?
- Null/undefined guards where needed?
- No prop mutation?

**UIID-Specific**
- `"use client"` directive present on client components?
- `data-slot` attribute set on root element?
- `cx()` used for className merging (not string concatenation)?
- `displayName` set?
- Remaining props spread to root element?
- No inline `style={{}}` — layout handled via props or CSS Modules?
- Design tokens used for all colors/spacing (no hardcoded values)?

**Types**
- No `any` — use proper TypeScript types
- Props type exported from `.types.ts`
- Zod schema updated in registry if props changed?

**Tests**
- Tests describe behavior, not internal state
- Test names are descriptive
- Variants, disabled state, and interactions covered

### Phase 4 — Summary (2–3 min)

Leave a review comment using this structure:

```markdown
## Summary
[Brief overview of what was reviewed]

## Strengths
- [What was done well]

## Required Changes
🔴 [Blocking issue]

## Suggestions
💡 [Improvement or alternative]

## Verdict
✅ Approve / 🔄 Request changes
```

---

## Responding to Feedback

Use the `/receiving-code-review` skill when acting on review comments.

**The response pattern:**
1. Read all feedback completely before acting on any of it
2. If anything is unclear — stop and ask before implementing
3. Verify suggestions against the actual codebase before applying
4. Fix one item at a time; test each individually
5. Prioritize: blocking → simple fixes → complex refactors

**Priority order:**
- 🔴 Blocking issues first — always
- Simple fixes (typos, missing exports) next
- Complex refactors last

**Acknowledging feedback:**
```
✅ "Fixed. Moved token logic to component.constants.ts."
✅ "Good catch — exported type was missing from index.ts. Fixed."
❌ "You're absolutely right!" (performative, not useful)
❌ "Great point!" (same)
```

Actions speak. Fix the code. The diff shows you heard the feedback.

**Pushing back:**
Push back when a suggestion breaks existing functionality, violates project conventions, or conflicts with an architectural decision. Use technical reasoning:

```
"This would break the controlled/uncontrolled pattern used across all form
components. The current implementation is intentional — see the Switch component
for the same pattern."
```

---

## Checklist Review (Agent Workflow)

When asked to verify a PR's checklist (as defined in `pull-requests.md`):

1. Read the PR description — extract all `- [ ]` checkbox items
2. Read the diff and any relevant files referenced by the checklist
3. Verify each item against the actual changes
4. Check the box (`- [x]`) for each verified item via `gh` CLI
5. Leave a single review comment summarizing findings

**Checking a box via gh CLI:**
```bash
# Get current PR body, update checkboxes, then PATCH via gh api
gh api repos/{owner}/{repo}/pulls/{number} \
  --method PATCH \
  --field body="[updated body with checked boxes]"
```

**If an item cannot be verified** (requires runtime testing, subjective judgment): leave unchecked, note the reason in the review comment.

**All boxes must be checked before merge.** If something isn't done, remove the checkbox and open a follow-up issue rather than leaving it unchecked.

---

## What Agents Should NOT Review

Automate these — don't spend review cycles on them:
- Code formatting (Prettier)
- Import ordering
- Linting violations (ESLint)
- Simple typos

These are caught by CI. Reserve review attention for logic, design, and correctness.

---

## Common Pitfalls

| Pitfall | Fix |
|---------|-----|
| Approving without reading | Use the 4-phase process |
| Blocking on style preferences | If it passes lint/format, let it go |
| Scope creep ("while you're at it...") | Open a new issue instead |
| Implementing feedback without verifying | Check against codebase first |
| Leaving unchecked boxes at merge | Either fix it or convert to a follow-up issue |
