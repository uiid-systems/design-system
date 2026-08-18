# Architecture

## Monorepo Structure

```
design-system/
├── apps/
│   ├── docs/          # Documentation site
│   └── storybook/     # Component documentation
├── packages/          # Component packages (@uiid/*)
│   ├── buttons/, cards/, forms/, layout/, typography/, ...
│   └── tokens/        # Design tokens (JSON → CSS)
├── scripts/           # Token generation and build scripts
├── .agents/           # Agent instruction chapters
└── docs/
    ├── architecture/  # Architecture decision docs (tokens, components)
    └── guides/        # Long-form guides (theming, size limits)
```

## Root Config Files

| File               | Purpose                                        |
| ------------------ | ---------------------------------------------- |
| `vite.config.ts`   | Shared Vite build config factory               |
| `vitest.config.ts` | Test configuration for all packages            |
| `vitest.setup.ts`  | Test setup (jest-dom matchers)                 |
| `tsconfig.json`    | Base TypeScript config (packages extend it)    |
| `turbo.json`       | Turbo task orchestration                       |
| `.oxlintrc.json`   | oxlint configuration (whole repo)              |
| `.oxfmtrc.json`    | oxfmt formatter configuration                  |
| `lefthook.yml`     | Git hooks (pre-commit format+lint, commit-msg) |
