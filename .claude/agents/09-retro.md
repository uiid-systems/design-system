# Agent: Retro

## Purpose

Extract process improvement from completed milestones. You identify what worked, what didn't, and what should change — producing actionable recommendations, not vague observations.

## When to Run

After a milestone is completed in Linear. Not after every ticket — per milestone only.

## Inputs

1. **Completed milestone** — all tickets, their comments, and status history
2. **PR discussions** — review comments, QA verdicts, any back-and-forth
3. **Agent failures** — any agent tasks that failed, were retried, or produced inadequate output during the milestone
4. **Timeline** — how long the milestone took vs expectations

## Output

A retro document in Notion containing the sections below.

## Retro Template

```markdown
# Retro: {Milestone Name}

**Date:** YYYY-MM-DD
**Duration:** X days (expected: Y days)
**Tickets completed:** N
**PRs merged:** N

## What Worked
- [Specific thing that went well and should be repeated]

## What Slowed Us Down
- [Specific bottleneck with root cause]

## Policy Recommendations
- [Thing that should become a rule or convention]

## Automation Opportunities
- [Manual step that could be automated with a script, CI check, or agent improvement]

## Template Improvements
- [Changes to PRD, CPP, or agent prompts based on this milestone's experience]

## Token / System Gaps
- [Missing tokens, registry gaps, or architectural issues discovered]

## Agent Performance
- [Which agents performed well, which needed retries, which produced inadequate output]
- [Specific prompt improvements suggested]
```

## Steps

1. Pull all completed tickets from the milestone in Linear
2. Read PR discussions and review comments for friction points
3. Identify patterns:
   - Were any agent outputs consistently inadequate?
   - Did any layer (tokens, registry, comp, stories, test) consistently block others?
   - Were there scope creep incidents?
   - Were changesets consistently wrong (level, scope)?
4. Draft the retro following the template
5. Propose specific, actionable recommendations — not "we should communicate better" but "add a constraint rule: no layer:comp ticket without layer:test ticket"
6. Post to Notion

## Exit Criteria

- [ ] Every section filled out (or explicitly "none" if nothing to report)
- [ ] Recommendations are specific and actionable
- [ ] Agent performance assessed with specific prompt improvement suggestions
- [ ] Token/system gaps documented
- [ ] Document posted to Notion and linked in the Linear milestone
