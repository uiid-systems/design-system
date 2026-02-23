## Summary

<!-- What changed and why, in a few bullet points -->

-

## Links

<!-- Required for medium/large changes. Remove section for size:small. -->

| Reference       | Link |
| --------------- | ---- |
| Linear tickets  |      |
| Notion CPP      |      |
| Figma           |      |

## Risk

<!-- Check all that apply -->

- [ ] Breaking change to public API
- [ ] Visual regression risk
- [ ] Interaction/state behavior change
- [ ] Token impact (new or changed tokens)
- [ ] No risk — internal only

## Definition of Done

<!-- All boxes must be checked before merge. Remove items that don't apply to this PR. -->

### Code Quality

- [ ] Lint clean (`pnpm run lint`)
- [ ] Type check clean
- [ ] Tests passing (`pnpm test:run`)
- [ ] No ad-hoc styles — tokens only
- [ ] No debug logs or commented-out code

### API Contract

- [ ] API matches CPP (or no CPP required for this change)
- [ ] No unintended breaking changes
- [ ] Registry updated (if component API changed)

### Documentation

- [ ] Storybook stories cover all states from CPP state matrix
- [ ] Stories build successfully (`pnpm run build-storybook`)
- [ ] README updated (if applicable)

### Release

- [ ] Changeset included (if this change affects published packages)
- [ ] Changeset level correct (patch / minor / major)

## Custom Checks

<!-- Add PR-specific verification items for the review agent -->

- [ ]

## Before / After

<!-- For visual changes, include screenshots or Storybook links -->
