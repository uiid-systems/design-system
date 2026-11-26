# Spec: tabs — V1 (draft)

Milestone 4, if the work is enough for one. Depends on `code-preview`. Inherits the shared conventions in `spec/capability-map-code.md`.

Status: draft. This spec is finished once milestone 2 has shipped and the owner has picked from the candidates below. Until then it records what the earlier modules must leave room for.

## Objective

Use UIID `Tabs` from `@uiid/navigation` wherever a code surface has more than one view of the same thing.

## Candidates

| #   | Candidate         | What it is                                                                                                         | Size   |
| --- | ----------------- | ------------------------------------------------------------------------------------------------------------------ | ------ |
| 1   | Preview/Code tabs | `CodePreview` shows the example and its source as two tabs in one frame, as an alternative to collapsed code below | Medium |
| 2   | Multi-file code   | A code block with several files, one tab per filename, one copy button for the active file                         | Medium |
| 3   | Install tabs      | A docs block for `pnpm` / `npm` / `yarn` / `bun` commands that remembers the reader's choice across pages          | Small  |

One candidate alone is a ticket, not a milestone. Two or more make the milestone.

## What earlier modules must leave room for

- `code-preview` requirement 19: the canvas and the code panel are sibling parts, and no public type says the code is below or collapsible. Candidate 1 is then an additive prop.
- `code-block` requirement 11: the header renders from its content. Candidate 2 puts a tab list where the filename is, without a second header.

## Requirements (to be completed)

1. Tabs are UIID `Tabs` parts. Nothing imports Base UI tabs directly.
2. Every tabbed surface is additive: existing `CodePreview` and `CodeBlock` usage is unchanged.
3. The copy button always copies what is visible.
4. Reset in a tabbed `CodePreview` works from either tab and does not change the active tab.
5. Tab state is controllable and has a default.

## Success criteria

To be written with the final requirements.

## Out of scope (deferred)

- Syncing tab choice between unrelated blocks beyond candidate 3's package-manager choice.

## Open questions

1. Which candidates are in.
2. For candidate 1: is the arrangement chosen per preview, or site-wide in docs?
3. `@uiid/code` would gain `@uiid/navigation` as a dependency for candidates 1 and 2. Confirm that is acceptable, or keep tabs composed in the consumer.
