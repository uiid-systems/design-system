# Plan: Generate Component READMEs from Registry

## Context

The `@uiid/registry` package (`packages/registry/`) is the single source of truth for component metadata — Zod prop schemas, descriptions, defaults, categories, and package locations. There are currently 34 hand-written `README.md` files scattered across `packages/*/src/*/README.md`. These manually duplicate prop tables, descriptions, and import paths that the registry already knows.

The goal is a script that generates README files from the registry, replacing the manually-maintained prop tables while preserving hand-written content that the registry can't know (examples, accessibility notes, data slots, anatomy, see also).

## What the registry knows (can generate)

- Component name, package, description
- Full props table: name, type string, required/optional, default value, enum values
- Import path: `import { ComponentName } from "@uiid/{package}"`

These come from `generateComponentDocs(entry)` in `packages/registry/src/utils/schema-to-docs.ts`, which returns a `ComponentDocumentation` object with a `props: PropDocumentation[]` array.

## What the registry does NOT know (cannot generate)

- Usage examples (Quick Reference, Examples sections)
- Data Slots (actual DOM element details like `button-spinner`, `field-root`)
- Anatomy (compound component structure like `<ModalRoot>/<ModalTrigger>`)
- Accessibility notes (keyboard behavior, ARIA details)
- See Also links (related components, Base UI primitive links)
- Subcomponents table
- Any hand-written prose beyond the one-line description

## Approach: Generate-and-merge, not overwrite

The script should NOT blindly overwrite existing READMEs. Instead:

1. **For components WITH an existing README**: Replace only the Props table section. Leave all other sections (Quick Reference, Examples, Data Slots, Accessibility, See Also, Anatomy) untouched. Update the title line and description if they differ from the registry.

2. **For components WITHOUT a README**: Generate a scaffold with the Props table filled in and placeholder sections for the hand-written parts.

3. **Output**: Write to `packages/{package-dir}/src/{component-dir}/README.md`.

## Registry API reference

Key file: `packages/registry/src/utils/schema-to-docs.ts`

```ts
// Returns full docs for a component entry
generateComponentDocs(entry: ComponentEntry): ComponentDocumentation

// ComponentDocumentation shape:
{
  name: string;           // "Button"
  package: string;        // "@uiid/buttons"
  description?: string;   // "Primary action button..."
  category: string;       // "buttons"
  hasChildren: boolean;
  props: PropDocumentation[];
}

// PropDocumentation shape:
{
  name: string;           // "size"
  type: string;           // '"small" | "medium" | "large"'
  required: boolean;
  description?: string;   // "Size variant"
  defaultValue?: any;     // "medium"
  enumValues?: string[];  // ["small", "medium", "large"]
}
```

Key file: `packages/registry/src/manifest.ts`

```ts
// All component entries keyed by name
export const registry: Registry = { Button: ButtonEntry, ... };
export const componentNames: string[];
```

Key file: `packages/registry/src/types.ts`

```ts
// ComponentEntry has these fields relevant to READMEs:
{
  name: string;
  package: string;        // "@uiid/buttons"
  description?: string;
  defaults?: Record<string, any>;
  category: string;
  slots?: Record<string, string>;  // e.g. { title: "Card heading..." }
}
```

## Script location

Create: `scripts/generate-readmes.mjs`

Add to root `package.json` scripts:
```json
"generate-readmes": "node scripts/generate-readmes.mjs"
```

## Script logic

### 1. Import registry data

The script should import from the built registry package:
```js
import { registry, generateComponentDocs } from "@uiid/registry";
```

Or if ESM import from dist doesn't work cleanly, use the built output:
```js
const { registry, generateComponentDocs } = await import("../packages/registry/dist/index.js");
```

### 2. Map component names to file paths

The registry knows the package name (e.g., `@uiid/buttons`) but not the filesystem directory name for each component. The mapping is:

- Package `@uiid/buttons` → directory `packages/buttons/`
- Component `Button` → subdirectory `src/button/` (kebab-case of name)
- Component `ToggleButton` → subdirectory `src/toggle-button/`

So: `packages/{pkg}/src/{kebab(name)}/README.md`

Where `{pkg}` is the part after `@uiid/` in the package field, and `{kebab(name)}` converts PascalCase to kebab-case.

### 3. Generate props table markdown

For each component, call `generateComponentDocs(entry)` and format the props array as a markdown table:

```markdown
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"small" \| "medium" \| "large"` | `"medium"` | Size variant |
| `variant` | `"subtle" \| "inverted"` | — | Visual variant |
```

Rules:
- Type column: use the `type` string from PropDocumentation, escape pipe characters
- Default column: use `defaultValue` if present, otherwise `—`
- Skip `children` prop (it's implicit for components with `hasChildren: true`)
- Sort: required props first, then alphabetical

### 4. For existing READMEs: replace Props section

Parse the existing README and find the `## Props` section. Replace everything from `## Props` up to the next `##` heading (or end of file) with the generated table.

Also update line 1 (`# ComponentName`) and line 3 (`> description`) if they differ from registry.

### 5. For missing READMEs: generate scaffold

```markdown
# {ComponentName}

> {description from registry}

## Quick Reference

\`\`\`tsx
import { {ComponentName} } from "{package}";

<{ComponentName} />
\`\`\`

## Props

{generated props table}

## See Also

- [{RelatedComponent}](../{related}/README.md)
```

### 6. Verify by diffing

After generation, the script should log which files were updated vs created vs unchanged. Do NOT write files that haven't changed (compare content before writing).

## Mapping of existing README locations to registry entries

These are the 21 registry components and their expected README paths:

| Registry Entry | Package | Expected Path |
|---|---|---|
| Box | @uiid/layout | packages/layout/src/box/README.md |
| Stack | @uiid/layout | packages/layout/src/stack/README.md |
| Group | @uiid/layout | packages/layout/src/group/README.md |
| Layer | @uiid/layout | packages/layout/src/layer/README.md |
| Separator | @uiid/layout | packages/layout/src/separator/README.md |
| Button | @uiid/buttons | packages/buttons/src/button/README.md |
| ToggleButton | @uiid/buttons | packages/buttons/src/toggle-button/README.md |
| Form | @uiid/forms | packages/forms/src/form/README.md |
| Input | @uiid/forms | packages/forms/src/input/README.md |
| Textarea | @uiid/forms | packages/forms/src/textarea/README.md |
| Checkbox | @uiid/forms | packages/forms/src/checkbox/README.md |
| Select | @uiid/forms | packages/forms/src/select/README.md |
| Switch | @uiid/forms | packages/forms/src/switch/README.md |
| Text | @uiid/typography | packages/typography/src/text/README.md |
| Card | @uiid/cards | packages/cards/src/card/README.md |
| Drawer | @uiid/overlays | packages/overlays/src/drawer/README.md |
| Modal | @uiid/overlays | packages/overlays/src/modal/README.md |
| Popover | @uiid/overlays | packages/overlays/src/popover/README.md |
| Sheet | @uiid/overlays | packages/overlays/src/sheet/README.md |
| Toaster | @uiid/overlays | packages/overlays/src/toaster/README.md |
| Tooltip | @uiid/overlays | packages/overlays/src/tooltip/README.md |

Note: Some registry components may not have existing directories yet (e.g., Card, Drawer, Toaster). The script should only write READMEs where the component directory already exists. Do NOT create new component directories.

## Example: What Button README Props section should look like after generation

```markdown
## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"xsmall" \| "small" \| "medium" \| "large"` | `"medium"` | Size variant |
| `variant` | `"subtle" \| "inverted"` | — | Visual variant |
| `tone` | `"positive" \| "critical" \| "warning" \| "info"` | — | Semantic color tone |
| `disabled` | `boolean` | — | Disabled state |
| `loading` | `boolean` | — | Loading state (shows spinner) |
| `fullwidth` | `boolean` | — | Full width button |
| `ghost` | `boolean` | — | Ghost style (transparent background) |
| `pill` | `boolean` | — | Pill shape (fully rounded) |
| `square` | `boolean` | — | Square shape (equal width/height) |
| `grows` | `boolean` | `true` | Grow to fill available space |
| `circle` | `boolean` | — | Circular button |
| `tooltip` | `any` | — | Tooltip content |
```

## Edge cases

- The `description` field on Zod schema props (via JSDoc `/** */` comments) maps to the Description column. If a prop has no description, use `—`.
- `z.any()` types should render as `ReactNode` in the type column when contextually appropriate (children, trigger, tooltip, title, description, action, footer, icon). The script can maintain a list of prop names that should be displayed as `ReactNode` instead of `any`.
- Props with `z.function()` types (like `onOpenChange`) should render as their function signature.
- Default values that are strings should be wrapped in backtick quotes: `` `"medium"` ``. Booleans: `` `true` `` / `` `false` ``. Numbers: `` `3` ``.

## Verification

After implementing the script:
1. Run `pnpm build` in packages/registry first (script reads from built output)
2. Run `node scripts/generate-readmes.mjs`
3. Diff the output against existing READMEs to verify only Props sections changed
4. Spot-check Button, Input, and Modal READMEs to confirm props match the registry
