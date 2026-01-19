# Pull Request Description Template

Use this template when creating pull requests for new features, packages, or significant changes.

## Template

```markdown
## Summary

- Brief bullet point describing primary change
- Additional changes or features added
- Any supporting utilities or hooks exposed

## Test plan

- [ ] `pnpm build --filter=@uiid/{package}` succeeds
- [ ] `pnpm test:run packages/{package}` passes
- [ ] Verify stories render correctly in Storybook
- [ ] Additional verification steps specific to the change

## Details

### New Components

**ComponentName** - Brief description of what it does

```tsx
<ComponentName
  prop="value"
  anotherProp
/>
```

### Files Added

```
packages/{package}/
├── src/
│   ├── {component}/
│   │   ├── {component}.tsx
│   │   ├── {component}.types.ts
│   │   ├── {component}.constants.ts
│   │   ├── {component}.module.css
│   │   ├── {component}.stories.tsx
│   │   └── {component}.test.tsx
│   └── index.ts
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

### Other Changes

- Updated `vitest.config.ts` to include {package} alias
- Updated `apps/storybook/.storybook/main.ts` to include stories
- Updated `AGENTS.md` with relevant documentation
```

## Guidelines

### When to Use This Template

Use the full template for:

- **New packages** - Any new `@uiid/*` package
- **Major features** - New components or significant component changes
- **Breaking changes** - Changes that affect the public API

### When to Use a Simpler Format

For smaller changes, a brief summary is sufficient:

```markdown
## Summary

Fix tooltip positioning when near viewport edge.

## Test plan

- [ ] `pnpm test:run packages/overlays` passes
- [ ] Verify tooltip repositions correctly in Storybook
```

### Section Guidelines

| Section | Required | Purpose |
|---------|----------|---------|
| **Summary** | Always | High-level overview in bullet points |
| **Test plan** | Always | Verification checklist |
| **New Components** | If adding components | Usage examples |
| **Files Added** | For new packages/components | Directory structure |
| **Other Changes** | If modifying existing files | Cross-references |

### Test Plan Items

Always include:

1. Build verification: `pnpm build --filter=@uiid/{package}`
2. Test verification: `pnpm test:run packages/{package}`
3. Storybook verification (if UI changes)
4. Feature-specific verification steps

### Code Examples

- Show the simple API, not composed subcomponents
- Include commonly used props
- Keep examples concise and scannable

### Files Added Section

- Use tree format for new directories
- Show the standard file structure
- Include any subcomponents directory if applicable
