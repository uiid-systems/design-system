# Agent: Groom Ticket (Runnable)

## Purpose

Run the ticket groomer process end-to-end using Linear MCP. Read a ticket, groom it according to guidelines, and update Linear with the groomed description, labels, estimate, and status.

**Invocation:** `& groom ticket UI-35`

## Setup

This agent uses Linear MCP, which is configured via environment variables in `.env.local`:
- `LINEAR_API_KEY` — your Linear API token
- `LINEAR_TEAM_ID` — your team ID
- `LINEAR_WORKSPACE_ID` — workspace ID (optional)

The SessionStart hook in `.claude/settings.json` automatically loads these when you start a Claude Code web session.

## Inputs

**Via command line:**
```
& groom ticket UI-35
```

The agent will extract the ticket ID (UI-35) and use Linear MCP to:
1. Read the full ticket (description, labels, state, estimate)
2. Read related tickets and links
3. Access the ticket's current status

## Process

### Step 1: Fetch the Ticket

Use Linear MCP to read ticket UI-35:
- Title
- Description
- Current labels
- Current estimate
- Current state/status
- Priority
- Relations and linked tickets

### Step 2: Apply Grooming Rules

Follow the grooming process from `.claude/agents/11-ticket-groomer.md`:

**Assess Labels:**
- Apply `layer:*` label if missing (required)
- Apply `size:*` label if missing (required)
- Apply `risk:*` label if applicable (optional)

**Estimate Complexity:**
- Set `estimate` field (1-5 scale):
  - 1: Trivial (config change, doc fix, single-file edit)
  - 2: Straightforward (add prop, write tests, new story)
  - 3: Moderate (new variant, multi-file change, registry + component)
  - 4: Complex (new component, new package, cross-package)
  - 5: Very complex (breaking change, new system)

**Assess Description Quality:**
- Does it have context (why is this work needed)?
- Is the scope clear (in/out)?
- Are acceptance criteria testable and state-based?
- Are dependencies linked?

**Determine Next Step:**
- `size:small` + clear AC + single layer → "Ready to build"
- `size:medium` or `size:large` → "Needs planning" or "Needs breakdown"
- Spans multiple layers → "Needs breakdown"
- Large scope → "Needs project"

### Step 3: Update Description

If the description needs improvement, replace it with a groomed version:

```markdown
{Original context — preserved and tightened}

## Acceptance Criteria

- [ ] {criteria 1}
- [ ] {criteria 2}

## Groom Notes

**Estimate**: {1-5} ({rationale})
**Labels**: `layer:{x}` ({reason}), `size:{x}` ({reason}), `risk:{x}` ({reason or "none"})
**Next step**: {Ready to build | Needs planning | Needs breakdown | Needs project} — {brief reason}

**Recommendations**:
- {Any suggestions: split ticket, add relations, link docs, clarify scope, etc.}
```

### Step 4: Update Linear

Use Linear MCP to update the ticket:

```javascript
// Example pseudocode for Linear MCP update
updateIssue(ticketId, {
  title: "...",
  description: "...",
  labels: ["layer:comp", "size:small"],
  estimate: 2,
  state: "Ready" // Move to Ready status
});

// Remove task:groom label
removeLabel(ticketId, "task:groom");
```

### Step 5: Verify

Print a summary:
- ✅ Ticket ID and title
- ✅ Labels applied
- ✅ Estimate set
- ✅ Status moved to "Ready"
- ✅ task:groom label removed

## Exit Criteria

- [ ] Ticket has a `layer:` label
- [ ] Ticket has a `size:` label
- [ ] Risk assessed (label applied if warranted)
- [ ] Complexity estimate set (1-5)
- [ ] Description quality assessed
- [ ] Next step recommendation included (in Groom Notes if description updated)
- [ ] Ticket status moved to "Ready"
- [ ] `task:groom` label removed
- [ ] All updates written to Linear via MCP

## Linear MCP Reference

Use the Linear MCP server to interact with tickets:

**Query a ticket:**
```
GET /graphql
query {
  issue(id: "UI-35") {
    id
    title
    description
    labels { name }
    estimate
    state { name }
  }
}
```

**Update a ticket:**
```
POST /graphql
mutation {
  issueUpdate(id: "UI-35", input: {
    title: "...",
    description: "...",
    labelIds: ["label-uuid-1", "label-uuid-2"],
    estimate: 2,
    stateId: "state-uuid-for-ready"
  })
}
```

## Groom Ticket Checklist

Before marking the ticket "Ready," verify:

- [ ] Description preserved author's intent
- [ ] Scope clarified (what's in/out)
- [ ] Acceptance criteria are state-based and testable
- [ ] Dependencies identified
- [ ] Groom notes appended (estimate, labels, next step, recommendations)
- [ ] All required labels present
- [ ] Estimate set based on complexity, not effort
- [ ] Status moved to "Ready"
- [ ] `task:groom` label removed

## Common Issues

| Issue | Resolution |
|-------|-----------|
| "No `layer:` label" | Determine primary layer ticket affects, apply label |
| "Vague AC" | Ask "what states/conditions equal 'done'?" and rewrite |
| "No context" | Ask "why does this work need to happen?" and add |
| "Multiple layers" | Recommend splitting into separate tickets per layer |
| "Unclear scope" | Tighten description: what's in, what's out, why |

## Guides to Reference

- `.claude/agents/11-ticket-groomer.md` — detailed grooming process
- `.claude/guides/workflow.md` — size/risk/layer definitions and pipeline rules
