# Registry (`@uiid/registry`)

The registry provides component metadata for AI-powered tools (playground, docs). Each registered component has a Zod schema, `ComponentEntry` metadata, and optional previews.

## Structure

```
packages/registry/src/
├── categories.ts       # Category definitions
├── shared.ts           # Shared Zod schemas (Size, Tone, etc.)
├── types.ts            # TypeScript types
├── manifest.ts         # Central registry export
├── components/         # Component entries
│   ├── index.ts        # Barrel export
│   ├── button/
│   │   ├── index.ts    # Schema + ComponentEntry
│   │   └── previews.ts # Preview configurations
│   └── ...
└── utils/              # Documentation utilities
```

## Adding a Component

See the full template at `.claude/templates/REGISTRY_ENTRY.md`.

**Quick steps:**

1. Create `packages/registry/src/components/{name}/index.ts` with Zod schema + `ComponentEntry`
2. Optionally create `previews.ts`
3. Export from `packages/registry/src/components/index.ts`
4. Import and add to `packages/registry/src/manifest.ts`
5. Add to app component maps:
   - `apps/docs/components/tree-preview.tsx` — add to `componentMap`
   - `apps/playground/lib/components.tsx` — add to `registry`
6. Build: `pnpm build --filter=@uiid/registry`

## ComponentEntry Fields

| Field         | Required | Description                                        |
| ------------- | -------- | -------------------------------------------------- |
| `name`        | Yes      | Component display name (e.g., "Button")            |
| `package`     | Yes      | Source package (e.g., "@uiid/buttons")             |
| `hasChildren` | Yes      | Whether component accepts children                 |
| `propsSchema` | Yes      | Zod schema for props validation                    |
| `description` | No       | Brief description for AI context                   |
| `category`    | No       | Category key (layout, forms, overlays, etc.)       |
| `defaults`    | No       | Default prop values                                |
| `previews`    | No       | Preview configurations for docs/playground         |
| `usage`       | No       | LLM-oriented usage guidance                        |

## Shared Schemas

Import from `../../shared`:

| Schema              | Values                                             |
| ------------------- | -------------------------------------------------- |
| `Size`              | `xsmall`, `small`, `medium`, `large`               |
| `FormSize`          | `small`, `medium`, `large`                         |
| `Tone`              | `positive`, `critical`, `warning`, `info`          |
| `Shade`             | `background`, `surface`, `accent`, `halftone`, `muted`, `foreground` |
| `SpacingPropsSchema`| `gap`, `p`, `px`, `py`, `m`, etc.                  |
| `LayoutPropsSchema` | `ax`, `ay`, `direction`                            |

## Checking Coverage

```bash
npx tsx scripts/generate-registry.ts
```
