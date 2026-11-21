---
name: uiid-build-tickets
description: Build every ready ticket in a Linear project in parallel, each through a build agent and a local review loop, ending in one draft PR per ticket. Use when asked to "work the actionable tickets" in a project, to "build the ready tickets", to run the build-and-review loop on a project or a list of ticket ids, or to repeat "what we did for the hardening project". Takes a Linear project name or id, or a list of ticket ids, as its argument. Not for a single ticket worked interactively, and not for reviewing a PR that is already open.
---

# UIID build tickets

You are the orchestrator. You pick the tickets, start one build agent per ticket, run a review loop on each until the reviewer approves, and then have the build agent open a draft PR. You write no product code yourself. The owner hears from you three times: which tickets you picked and why, each PR as it becomes ready, and a closing summary.

The argument is a Linear project (name or `P-UI-n`) or a list of ticket ids. With no argument, ask which project.

## 1. Pick the tickets

Read the project description and milestones with `get_project`, list its issues, then call `get_issue` with `includeRelations: true` on every candidate that is not Done or Canceled. The list view truncates descriptions and has no relations, so it cannot answer this on its own.

A ticket is ready when all of these hold:

- Every issue in `blockedBy` is Done. Check the status, not the title.
- No phase or milestone gate stands in front of it. A milestone that says "starts after the Phase 2 checkpoint" or "review with the owner before" blocks its tickets even when no relation says so.
- Its acceptance criteria can be checked by a command or by reading the diff.
- It needs no ruling from the owner. "The owner rules on it here" or an undecided product question takes it out. A choice the ticket tells the agent how to make ("follow what Lucide does", "pick the simpler of these two") does not.
- No open PR or existing branch already carries it. Check `gh pr list` and `git worktree list`.

Tell the owner in a short list which tickets you picked and, in one line each, why the others were left. Then start. Do not wait for approval of the list unless nothing qualified or the pick is surprising.

When nothing is ready, say so and show the owner the chain: which ticket everything hangs off, and which gates need them. Do not loosen the rules above to find work.

One exception lets a chain move without waiting for merges. A ticket whose only unfinished blocker is a ticket from this run that has already passed local review may be built stacked on that blocker's branch: the build agent branches from the blocker's branch instead of `origin/main`, the reviewer's range is `<blocker-branch>...HEAD`, and the draft PR targets the blocker's branch. Once that PR exists, join it to the blocker's PR as a GitHub stack with `gh stack link <bottom-pr> <next-pr>` (bottom to top), or `gh stack link <stack-number> <new-pr>` to append to a stack that already exists. `link` works on PR numbers and touches no local branch or worktree, which is what you want when each branch lives in its own agent worktree; do not use `gh stack sync`, which rebases and force-pushes the other branches. A stacked PR cannot be merged with `gh pr merge`; the owner merges with `gh stack merge`. Never stack on a branch that is still being built or reviewed, and tell the owner the PR is stacked and on what.

If two ready tickets are likely to edit the same files, still run them in parallel, and name the overlap in both build prompts so each keeps its edits there small.

## 2. Start one build agent per ticket

Spawn all of them in one message so they run together. Each is a `general-purpose` agent with `model: "opus"` and `isolation: "worktree"`. Keep each agent's id: the same agent handles the review findings and opens the PR, so its context must survive.

The agent knows nothing you do not write down. Each prompt carries:

- Its role and the whole arc: build now, fix review findings later, open a draft PR only when told. No push and no PR until then.
- Setup: `git fetch origin`, create the ticket's branch (Linear's `gitBranchName`, such as `ui-425`) from `origin/main`, `pnpm install`.
- What to read first: `AGENTS.md`, the `.agents/` chapters matching the files it will touch, and any spec the project names, with the sections that matter.
- An instruction to invoke the `agent-skills:build` skill with `auto` and to treat the acceptance criteria as its task list.
- The ticket itself, pasted in full: description, acceptance criteria, verification, agent notes. Do not rely on the agent reaching Linear.
- What is out of scope, naming the neighbouring tickets that own it, and any overlap with a parallel agent.
- The standing bar: `pnpm test:run`, `pnpm run lint`, `pnpm run format:check` and `pnpm typecheck` pass; one PR carries one task; unrelated problems are reported, not fixed; a criterion that needs an owner decision is reported, not guessed.
- Commit rules: conventional commits with a scope from commitlint's list (`ui`, `tokens`, `docs`, `storybook`, `release`, `repo`), body lines of 100 characters or fewer, no `Co-Authored-By`, no AI attribution anywhere, no hard-wrapped prose.
- The report it owes you: absolute worktree path, branch, commit SHAs, each criterion as met, not met or blocked with the command that shows it, the verification output, and anything it left out or decided.

As you start the agents, move each picked ticket to In Progress with `save_issue`. You make the status changes, not the build agents, since they may not reach Linear.

While agents run, do not ask the owner anything. Wait for the completion notices.

## 3. Review each build locally

When a build agent reports, spawn a reviewer for that ticket: `agent-skills:code-reviewer` with `model: "opus"`. Add the specialists the change calls for, in parallel in the same message: `agent-skills:security-auditor` for input handling, auth, secrets or external integrations, `agent-skills:test-engineer` for test changes, `agent-skills:web-performance-auditor` for UI loading and rendering. Never a `general-purpose` reviewer.

Give the reviewer the worktree path, the range `origin/main...HEAD`, the ticket text and the intent of the change. Do not give it the build agent's summary or your own opinion, so the review is not anchored. Tell it to read and run but never edit, to rerun the ticket's verification commands itself, and to end with exactly one verdict line, `VERDICT: APPROVE` or `VERDICT: REQUEST CHANGES`, above findings labelled Critical, Important, Suggestion or Nit, each with `path:line`.

This skill reviews before the PR exists, which is the reverse of the usual push, review, post order. That is deliberate: the PR opens in draft only once the code has passed, so the owner's first look is at reviewed work.

## 4. Loop until approved

On `REQUEST CHANGES`, send the findings to the original build agent with `SendMessage`, verbatim and complete. Ask it to check each finding against the code before acting, fix what is real, answer what is not with evidence, commit, and report again. Then send the new range to a fresh reviewer, with the earlier findings and the build agent's replies so it can check the fixes and rule on the disputes.

Repeat until a reviewer returns `APPROVE`. Suggestions and nits the reviewer accepts as deferred do not block approval; carry them into the PR body.

Stop a ticket's loop and bring it to the owner when it has gone three rounds without approval, when builder and reviewer disagree on the same point twice, or when a finding needs a decision the ticket does not make. The other tickets carry on.

## 5. Open the draft PR

On approval, message the build agent to push its branch and open a draft PR with `gh pr create --draft`. Remind it of the rules, since it read them many turns ago:

- The title is a conventional commit in imperative mood; it becomes the changelog entry. Breaking changes carry `!`.
- The body is bullets: what changed, how it was verified with real numbers, what was deferred, and a checklist where each box can be confirmed from the diff or a command. Link the ticket (`Closes UI-425`).
- No AI attribution, no hard-wrapped prose, no `preview` label.
- Write the body to a file and pass it with `--body-file`.

Have it return the PR URL. When it does, move the ticket to In Review. A ticket stopped in step 4 stays In Progress. Leave Done to the `Closes` link, which closes the ticket when the PR merges.

## 6. Tell the owner

As each PR opens, give the owner one line: the ticket, the PR link, the number of review rounds and anything deferred. When all tickets are finished or stopped, close with a short table of ticket, PR, rounds and open points, then offer the standard actions menu (open the PRs in the browser, post the review to the PR).

Leave the worktrees in place. The owner may want to keep working in them, and removing one is not yours to decide.
