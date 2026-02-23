# Agent-Driven Workflow

This guide defines the agent pipeline for UIID. Each agent is a discrete, scoped task with typed inputs and outputs. Agents run in Warp Oz, Claude Code, Cursor, or any tool that can follow structured instructions.

## Tool Ecosystem

| Tool       | Role                                | State It Owns                    |
| ---------- | ----------------------------------- | -------------------------------- |
| **GitHub** | Code, CI/CD, PRs, reviews           | Source code, build status        |
| **Linear** | Tickets, status, cycles             | Task state, assignments, labels  |
| **Notion** | PRDs, CPPs, architecture docs       | Knowledge base, proposals        |
| **Figma**  | Component design, diagrams          | Visual source of truth           |

Cross-referencing rule: every artifact links to its upstream. A Linear ticket links to its Notion PRD. A GitHub PR links to its Linear tickets. Agents are responsible for creating these links.

## Linear Labels

Labels encode what layer a ticket belongs to, what risk it carries, and how much pipeline it needs.

### Layer Labels

| Label            | Meaning                              |
| ---------------- | ------------------------------------ |
| `layer:tokens`   | Token definitions or changes         |
| `layer:registry` | Registry API or schema updates       |
| `layer:comp`     | Component implementation             |
| `layer:stories`  | Storybook documentation              |
| `layer:test`     | Behavior, a11y, interaction tests    |
| `layer:docs`     | Usage guidance and documentation     |
| `layer:blocks`   | Block composition work               |
| `layer:release`  | Version bump or publish impact       |

### Risk Labels

| Label              | Meaning                            |
| ------------------ | ---------------------------------- |
| `risk:breaking`    | Breaking change to public API      |
| `risk:visual`      | Visual regression risk             |
| `risk:behavioral`  | Interaction or state behavior change |

### Size Labels

| Label          | Pipeline                                              |
| -------------- | ----------------------------------------------------- |
| `size:small`   | Dev → PR → Review → Merge                             |
| `size:medium`  | Planner → Breakdown → CPP → Build → Review → QA      |
| `size:large`   | Full pipeline including ADR + migration planning      |

## Agent Pipeline

### Execution Order

```
Sequential:  Planner → Breakdown → Interface Steward
Gate:        Token Curator (if CPP proposes new tokens)
Parallel:    Designer + Feature Coder
Sequential:  Code Review → QA (recommendation) → Human Sign-Off → Release
Continuous:  All agents → retro feed
Periodic:    Retro (per milestone, synthesizes + resets retro feed)
```

### Scaling by Size

#### Small

**What qualifies:** Bug fix, doc change, internal refactor with no API change, adding a field to a type, config updates, single-layer work with no design input needed.

**Pipeline:** Feature Coder → Code Review → Human Sign-Off → Merge

**What gets skipped:** Planner, Breakdown, Interface Steward, Designer, QA, Release Captain.

**Rules:**
- The Linear ticket description is the spec. No PRD, no CPP.
- The ticket must have a `layer:` label and `size:small`.
- Feature Coder reads the ticket, the relevant guides, and the codebase — nothing else.
- Code Review reviews the PR against the diff and project conventions — no CPP to verify against.
- Human gives final approval. QA may validate post-merge if no risk labels are present.
- PR includes changeset if the change affects a published package.
- If a ticket drives changes to workflow guides or agent prompts (`.claude/agents/`, `.claude/guides/`), those changes go in a **separate PR** from the ticket's deliverable. This keeps review scope clean — the ticket PR contains only what the ticket describes, and the workflow PR captures process evolution independently.

**Agent inputs for `size:small`:**

| Agent          | Reads                                           | Writes                     |
| -------------- | ----------------------------------------------- | -------------------------- |
| Feature Coder  | Linear ticket + guides + codebase               | GitHub PR + retro feed     |
| Code Review    | PR diff + guides + registry                     | PR review + retro feed     |

#### Medium

**What qualifies:** New variant, new prop, visual change, multi-layer work.

**Pipeline:** Planner → Breakdown → Interface Steward → parallel build → Review → QA → Human Sign-Off → Merge

#### Large

**What qualifies:** New component, breaking change, new package.

**Pipeline:** Full pipeline including ADR + migration planning. PRD in Notion. CPP in Notion. Figma design. All layers ticketed.

---

## Agent Definitions

### 1. Feature Planner

**Purpose:** Transform a request into a structured brief.

**Trigger:** New feature, major refactor, new component, new block, new package, breaking change.

**Inputs:**
- Request description
- Existing related components (check registry)
- Available tokens (`packages/tokens/`)
- Known pain points or context

**Output:** PRD document in Notion (use `.claude/templates/PRD.md`)

**Output links:**
- Paste Notion PRD link in the Linear epic/parent issue description

**Exit criteria:**
- [ ] Acceptance criteria are state-based and testable
- [ ] All interaction states listed
- [ ] Dependencies identified
- [ ] Risk classified
- [ ] Token impact evaluated

**Common failures:** AC too vague. No state matrix. Token impact ignored. Breaking impact unassessed.

---

### 2. Task Breakdown

**Purpose:** Convert PRD into executable Linear tickets organized by layer.

**Inputs:**
- Approved PRD (Notion link)

**Output:** Linear tickets with:
- Layer label (`layer:tokens`, `layer:registry`, `layer:comp`, etc.)
- Risk label (if applicable)
- Size label
- Linked PRD
- Clear AC per ticket
- Definition of Done per ticket

**Ticket creation rules:**
- No `layer:comp` ticket without a `layer:registry` ticket
- No `risk:visual` ticket without a `layer:stories` ticket
- No `risk:behavioral` ticket without a `layer:test` ticket

**Exit criteria:**
- [ ] Every layer that's affected has a ticket
- [ ] Every ticket has AC and Definition of Done
- [ ] All tickets linked to PRD
- [ ] Layer dependencies respected (tokens before comp, registry before comp)

---

### 3. Interface Steward (CPP Gate)

**Purpose:** Protect API integrity and system cohesion. This is the most critical gate.

**Inputs:**
- PRD (Notion)
- Breakdown tickets (Linear)
- Existing components (registry at `packages/registry/`)
- Token definitions (`packages/tokens/`)

**Output:** CPP document in Notion (use `.claude/templates/COMPONENT_PROPOSAL.md`)

**Output links:**
- Paste Notion CPP link in each related Linear ticket
- Link CPP to PRD in Notion

**Exit criteria:**
- [ ] API is additive unless breaking change explicitly approved
- [ ] Tokens reused where possible — new tokens justified
- [ ] No hard-coded values anywhere in the proposal
- [ ] Accessibility contract complete
- [ ] Registry entry sketched
- [ ] State matrix complete (every state has visual + ARIA description)

**When to skip:** Pure documentation. Internal refactor with zero surface change.

---

### 4. Product Designer

**Purpose:** Translate CPP into visual and interaction artifacts.

**Inputs:**
- CPP (Notion)
- Token system (`packages/tokens/`)
- Existing design language (Figma)

**Output:**
- Figma component or mock
- State matrix visualized (all states from CPP)
- Spacing and typography using token names
- Edge cases: long text, error, loading, disabled, overflow

**Output links:**
- Embed Figma frames in the Notion CPP
- Link Figma in relevant Linear tickets

**Must not do:**
- Invent new tokens without escalation to Interface Steward
- Create states not in the CPP without coordination
- Use raw pixel values

**Exit criteria:**
- [ ] Every AC state visually represented
- [ ] Token usage explicitly referenced (token names, not hex values)
- [ ] Interaction flows clear
- [ ] Responsive considerations documented (if relevant)

---

### 5. Feature Coder

**Purpose:** Implement in short, verifiable iterations.

**Inputs:**
- CPP (Notion)
- Figma design
- Linear tickets (assigned `layer:comp`, `layer:stories`, `layer:test`, `layer:registry`)

**Responsibilities:**
- Respect package boundaries (see `components.md`)
- Follow file structure conventions (see `components.md`)
- No cross-layer leakage
- Small incremental commits (PR-ready at each step)
- Update registry in lockstep with implementation
- Open PR with structured description (see `pull-requests.md`)

**Output:** GitHub PR containing:
- Implementation
- Storybook stories (all CPP states)
- Unit tests
- Interaction tests (if behavior-heavy)
- A11y tests
- Changeset (if applicable)
- Registry update

**Output links:**
- PR description links to Linear tickets (`Closes UI-XX`)
- PR description links to Notion CPP

**Definition of Done:**
- [ ] Lint clean (`pnpm run lint`)
- [ ] Type check clean
- [ ] Tests passing (`pnpm test:run`)
- [ ] Storybook builds (`pnpm run build-storybook`)
- [ ] No ad-hoc styles — tokens only
- [ ] API matches CPP
- [ ] Registry updated and builds

**Common failures:** Over-engineering. Hidden breaking changes. Token duplication. Uncontrolled variant explosion.

---

### 6. Code Review Bot

**Purpose:** Ensure structural and systemic quality.

**Inputs:**
- GitHub PR diff
- CPP (Notion link from PR description)
- Registry (`packages/registry/`)

**Review dimensions:**
- API integrity (does implementation match CPP?)
- Breaking change detection
- Type safety
- Accessibility correctness
- State completeness (all CPP states implemented?)
- Token correctness (no hard-coded values?)
- Dependency graph health
- Performance risks
- Registry alignment

**Does NOT focus on:**
- Subjective visual preferences
- UX redesign
- Product direction

**Output:** GitHub PR review using severity labels from `pull-reviews.md`:
- `blocking` — must fix before merge
- `important` — should fix, may defer with justification
- `nit` — optional improvement
- `suggestion` — alternative approach worth considering

**Exit criteria:**
- [ ] No `blocking` items unresolved
- [ ] No structural regression risk unaccounted for
- [ ] PR checklist items verified (see `pull-requests.md`)

---

### 7. QA Agent

**Purpose:** Validate system behavior and visual correctness.

**Inputs:**
- GitHub PR
- Storybook build
- CPP state matrix

**Checklist:**
- [ ] Visual diff approved (no unexpected UI drift)
- [ ] Keyboard navigation correct
- [ ] Focus trap behavior correct (if applicable)
- [ ] All CPP states present in Storybook
- [ ] Edge cases validated
- [ ] Cross-browser spot check (if needed)

**Output:** QA recommendation as a Linear issue comment on the implementation ticket. A human reviews the findings and gives final sign-off.

**Merge policy:**
- `risk:breaking` or `risk:visual` → QA + human sign-off required before merge
- `size:medium` with no risk labels → QA + human sign-off required before merge
- `size:small` with no risk labels → QA may validate post-merge

---

### 8. Release Captain

**Purpose:** Protect versioning integrity.

**Inputs:**
- Merged PR
- Changeset files (`.changeset/`)
- Package dependency graph

**Responsibilities:**
- Validate changeset level is correct (patch / minor / major)
- Confirm package scope is complete
- Verify changelog is human-readable
- Identify migration notes (if breaking)
- Confirm CI publish readiness

**Exit criteria:**
- [ ] Version bump justified and matches risk classification
- [ ] No hidden breaking changes
- [ ] Changelog entry is clear and useful

**Note:** Much of this is already enforced by CI (`release.yml`, `auto-changeset.yml`). This agent adds judgment — "is this really a minor?" — that CI can't provide.

---

### 9. Retro Agent (Periodic)

**Purpose:** Extract process improvement from completed milestones.

**Trigger:** After a milestone is completed in Linear, not after every ticket.

**Inputs:**
- Completed milestone tickets and their comments
- PR discussions
- QA notes
- Any agent failures or retries from the milestone

**Output:** Retro document in Notion containing:
- What worked
- What slowed us down
- What should become policy
- What should become automation
- New template opportunities
- Token or system gaps discovered

---

### 10. Token Curator

**Purpose:** Prevent token explosion and maintain token system integrity.

**Trigger:** New token proposals in a CPP, PRs modifying token JSON, periodic health checks.

**Inputs:**
- Token definitions (`packages/tokens/src/json/`)
- CPP token map (if reviewing a proposal)
- PR diff (if reviewing a PR)
- CSS Module token references across all packages

**Output:** Token audit report (Notion comment on CPP, PR review comment, or standalone Notion doc).

**Exit criteria:**
- [ ] Every proposed token evaluated against existing inventory
- [ ] No naming convention violations unaddressed
- [ ] No redundant tokens approved without justification
- [ ] Interface Steward notified of any CPP changes needed

---

## Optional Agents (Add When Needed)

| Agent                     | Purpose                                        | Trigger                    |
| ------------------------- | ---------------------------------------------- | -------------------------- |
| **Migration Planner**     | Generates codemods for breaking changes         | `risk:breaking` tickets    |
| **Documentation Synth**   | Auto-generates usage docs from stories + CPP   | Post-release               |
| **Visual Diff Enforcer**  | Blocks PRs without story coverage              | CI integration             |

---

## Contract Summary

Every agent reads from and writes to predictable locations:

| Agent              | Reads From                | Writes To                          |
| ------------------ | ------------------------- | ---------------------------------- |
| Planner            | Request + registry + tokens | Notion PRD + retro feed          |
| Breakdown          | Notion PRD                | Linear tickets + retro feed        |
| Interface Steward  | PRD + tickets + registry  | Notion CPP + retro feed            |
| Token Curator      | Tokens + CPP + CSS Modules | Audit report (Notion/PR) + retro feed |
| Designer           | CPP + tokens + Figma      | Figma + Notion embeds + retro feed |
| Feature Coder      | CPP + Figma + tickets     | GitHub PR + retro feed             |
| Code Review Bot    | PR diff + CPP             | GitHub PR review + retro feed      |
| QA Agent           | PR + Storybook + CPP      | Linear comment (recommendation) + retro feed |
| Release Captain    | Merged PR + changesets    | Release validation + retro feed    |
| Retro Agent        | Retro feed + milestone artifacts | Notion retro doc (archives + resets retro feed) |

## Agent Prompt Files

Each agent has a self-contained prompt file in `.claude/agents/`. These define purpose, inputs, outputs, steps, and exit criteria. They are runtime-agnostic — usable in Warp Oz, Claude Code, Cursor, or any agent framework.

| File                         | Agent                |
| ---------------------------- | -------------------- |
| `01-feature-planner.md`      | Feature Planner      |
| `02-task-breakdown.md`       | Task Breakdown       |
| `03-interface-steward.md`    | Interface Steward    |
| `04-product-designer.md`     | Product Designer     |
| `05-feature-coder.md`        | Feature Coder        |
| `06-code-review.md`          | Code Review Bot      |
| `07-qa.md`                   | QA Agent             |
| `08-release-captain.md`      | Release Captain      |
| `09-retro.md`                | Retro Agent          |
| `10-token-curator.md`        | Token Curator        |

---

## Runtime Environment

Agents run in **Warp cloud agent environments** (Oz). Each agent execution spins up an isolated Docker container, clones the repo, runs setup commands, and executes the agent workflow. Key implications:

- **No persistent local state** — containers are destroyed after each run. Agents must read from and write to durable stores (GitHub, Linear, Notion, Figma, `.claude/retro-feed.md`).
- **MCP availability** — environment configuration determines which MCP servers are accessible. Ensure the environment includes the MCPs each agent needs (Linear, Notion, Figma, GitHub).
- **Setup commands must be idempotent** — `pnpm install`, `pnpm build`, etc. run fresh each time.
- **glibc-based images required** — Alpine/musl images are not supported by Warp.

See [Warp environments docs](https://docs.warp.dev/agent-platform/cloud-agents/environments) for configuration details.

---

## Outstanding Work

The following items are needed to complete the workflow infrastructure:

### Completed
- [x] Agent prompt files written (`.claude/agents/01-10.md`)
- [x] Token Curator promoted to mandatory agent (`10-token-curator.md`)
- [x] QA Agent updated with human sign-off requirement
- [x] Retro Agent updated with continuous feedback collection model
- [x] Retro feedback file created (`.claude/retro-feed.md`)
- [x] Templates created (PRD, CPP, story, test, registry, README)
- [x] Linear labels created (`layer:`, `risk:`, `size:`)
- [x] Linear backlog cleaned — onboarding artifacts and premature tickets canceled
- [x] Active tickets labeled (UI-7, UI-8, UI-10) with dependencies set
- [x] `size:small` workflow formalized with explicit agent inputs/outputs

### Notion Structure
Set up Notion workspace pages for:
- PRD archive (one page per approved PRD)
- CPP archive (one page per approved CPP)
- Retro archive (one page per milestone retro)
- Link the Notion workspace in the workflow guide once created

### Warp Environment Configuration
- Configure a Warp environment with the correct Docker image, repo clone, and setup commands
- Verify MCP server access (Linear, Notion, Figma, GitHub) within the environment
- Test that `pnpm install && pnpm build` succeeds in the container

### Pilot Run
- Select a feature to run through the full pipeline end-to-end using Oz
- Validate that agent prompts work in the cloud environment
- Identify gaps in prompt files, MCP access, or cross-agent handoffs
- Feed findings into the first retro

### Release Captain Strategy
- Deferred pending more context on CI integration and changeset validation needs
- Evaluate whether this agent adds value beyond what CI already enforces, or whether it should become a CI enhancement
