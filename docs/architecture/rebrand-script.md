# Onboarding & Rebrand

## Context

The UIID design system is designed as a "grab and go, batteries included" foundation
that teams fork and make their own. The first thing a new consumer should do after
forking is rename the project. Once they start customizing components, tokens, and
documentation, a reliable rename becomes exponentially harder -- references get buried
in new code, custom CSS layers interleave with the old names, and the blast radius
becomes unpredictable.

This means renaming must be the first step, presented up front before the user touches
anything else. An onboarding agent guides users through this setup flow interactively,
with the rebrand script handling the mechanical find-and-replace work underneath.

### Naming guidance

The name a user picks should be a **unique identifier** for their design system, not a
common English word. A name like "balance" or "spark" will collide with variable names,
CSS classes, documentation prose, and future dependencies. A name like "uiid" or "zzyzx"
is unlikely to appear anywhere except as an intentional reference to the design system.
The onboarding agent should communicate this clearly.

---

## Architecture

```
scripts/
├── rebrand.ts              # Deterministic find-and-replace engine
└── onboard.ts              # Interactive setup agent (calls rebrand)
```

The two concerns are intentionally separated:

- **`rebrand.ts`** is a pure function of inputs: given a scope, prefix, and org, it
  transforms the codebase deterministically. It can run headlessly via CLI flags for
  CI or testing.
- **`onboard.ts`** is the interactive wrapper. It asks questions, explains tradeoffs,
  validates answers, and invokes `rebrand.ts` with the collected inputs. It may grow
  to cover additional setup steps beyond renaming.

---

## Onboarding Flow

The agent walks the user through setup via interactive prompts. Each step collects
one decision, explains why it matters, and shows a preview before proceeding.

### Step 1: Name your design system

> **What should your design system be called?**
>
> This name becomes your npm scope (`@name/buttons`), CSS layer prefix
> (`name.tokens.*`), and appears throughout the codebase. Pick something unique
> and short -- a coined word or abbreviation works best. Names like "uiid" or
> "zzyzx" are easy to find-and-replace later; common words like "core" or "spark"
> are not.

**Input**: scope name (validated: lowercase, alphanumeric + hyphens, 2-20 chars)

**Derived defaults** (user can override in subsequent prompts):
- CSS/token prefix: same as scope
- GitHub org: `{scope}-systems`
- GitHub repo: `design-system`

### Step 2: Confirm GitHub identity

> **Where will this live on GitHub?**
>
> Default: `{scope}-systems/design-system`
> Package URLs, issue links, and homepage fields will point here.

**Input**: org name, repo name (or accept defaults)

### Step 3: Preview and confirm

Show a summary of what will change:

```
Scope:       @acme
Prefix:      acme
GitHub:      acme-labs/design-system
Version:     0.0.1

This will modify ~700 files across the codebase.
All package versions will be reset to 0.0.1.
Changelogs will be cleared.
Git history will be squashed to a single initial commit.

Proceed? [y/n/dry-run]
```

If the user picks `dry-run`, run the rebrand in preview mode and show the results
before asking again.

### Future steps (not in initial scope)

The onboarding flow is designed to grow. Potential additions:

- **Token customization**: primary color, font family, spacing scale
- **Package pruning**: remove packages you don't need (e.g., drop `@uiid/calendars`)
- **App setup**: configure docs site URL, Storybook title
- **CI/CD scaffolding**: generate GitHub Actions workflows for the new repo

These are independent of the rebrand and can be added incrementally.

---

## Rebrand Script

### Blast Radius

An audit of the codebase identified 700+ files across 7 categories that reference "uiid":

| Category | Count | Pattern | Example |
|----------|-------|---------|---------|
| Package scope | 18 package.json files | `@uiid/*` | `@uiid/buttons` |
| Import statements | 870+ across 564 files | `from "@uiid/..."` | `from "@uiid/layout"` |
| CSS cascade layers | 25+ layer declarations, 45 CSS files | `uiid.tokens.*` | `@layer uiid.tokens.component.button` |
| Token extension key | ~10 refs in scripts/tokens | `org.uiid.derive` | DTCG `$extensions` key |
| GitHub org/repo | 58 refs in package.json | `uiid-systems` | `github.com/uiid-systems/design-system` |
| App metadata | ~5 refs | `uiid` in titles | `"title": "uiid blocks"` |
| Documentation | 87 markdown files | prose + code examples | Guides, READMEs, templates |
| Config files | vitest, tsconfig aliases | `uiidPackages`, `uiidAliases` | Variable names in config |
| Lock file | 158 refs | `@uiid/*` | Regenerated automatically |

### CLI Interface

The script can be invoked directly for headless/CI use, bypassing the onboarding agent:

```
npx tsx scripts/rebrand.ts [options]
```

| Flag | Default | Description |
|------|---------|-------------|
| `--scope` | (required) | New npm package scope |
| `--prefix` | same as `--scope` | CSS layer and token extension prefix |
| `--org` | `{scope}-systems` | GitHub organization name |
| `--repo` | `design-system` | GitHub repository name |
| `--version` | `0.0.1` | Reset all package versions to this value |
| `--dry-run` | `false` | Preview changes without writing files |
| `--skip-git` | `false` | Skip git history reset |
| `--skip-install` | `false` | Skip `pnpm install` after renaming |

### Replacement Rules

The script applies replacements in a specific order, most specific patterns first to
avoid partial matches. Each rule is a find/replace pair applied to a filtered set of
files.

#### 1. Package scope

**Pattern**: `@uiid/` -> `@{scope}/`

**Files**: all `.ts`, `.tsx`, `.js`, `.cjs`, `.mjs`, `.json`, `.css`, `.md` files
(excluding `node_modules`, `dist`, `.git`, `pnpm-lock.yaml`)

Covers package.json names/dependencies, all import statements, documentation examples,
and config file references.

#### 2. CSS cascade layers

**Pattern**: `uiid.tokens` -> `{prefix}.tokens`, `uiid.globals` -> `{prefix}.globals`,
`uiid.components` -> `{prefix}.components`, `uiid.utilities` -> `{prefix}.utilities`

**Files**: `.css` files and `.ts`/`.js` files that reference layer names

**Note**: The CSS layering strategy is under active revision. The `uiid.*` layer prefix
may change shape before this script is built. The replacement rules should target
whatever layer naming convention is current at implementation time.

#### 3. Token extension key

**Pattern**: `org.uiid.derive` -> `org.{prefix}.derive`

**Files**: `.json` token files under `packages/tokens/`, token generation scripts

#### 4. GitHub identity

**Pattern**: `uiid-systems/design-system` -> `{org}/{repo}`,
`uiid-systems` -> `{org}` (standalone occurrences)

**Files**: `package.json` files (repository, homepage, bugs fields),
`.changeset/config.json`, documentation

#### 5. App metadata

**Pattern**: `"uiid ` -> `"{scope} ` (in title/description strings)

**Files**: app layout files, config files

#### 6. Config variable names

**Pattern**: `uiidPackages` -> `{scope}Packages`, `uiidAliases` -> `{scope}Aliases`

**Files**: `vitest.config.ts`, any config files using these variable names

#### 7. Documentation prose

**Pattern**: case-sensitive replacements:
- `UIID` -> `{SCOPE}` (uppercase, for headings and acronym usage)
- `uiid` -> `{scope}` (lowercase, for prose)

**Files**: `.md` files only. Applied last to catch remaining references without
affecting code files (which are already handled by rules 1-6).

---

## Reset Operations

After all replacements are applied:

### Version reset

Set `"version"` in every `package.json` under `packages/` and root to the target
version (default `0.0.1`). Does not touch dependency version ranges -- workspace
packages use `workspace:*` protocol which is version-independent.

### Changelog cleanup

- Delete all files in `.changeset/` except `config.json`
- Clear or delete `CHANGELOG.md` files in each package

### Lock file regeneration

Run `pnpm install` to regenerate `pnpm-lock.yaml` with the new package names.
Manual lock file editing is fragile -- regeneration is the only reliable approach.

### Git history reset (optional, skipped with `--skip-git`)

```bash
git checkout --orphan fresh
git add -A
git commit -m "initial commit"
git branch -M fresh main
```

Creates a single-commit history. The remote connection is preserved. Force push is
left to the user.

---

## Implementation

### File discovery

Use `globSync` to find all target files, excluding:
- `node_modules/`
- `dist/`
- `.git/`
- `pnpm-lock.yaml` (regenerated, not edited)
- Binary files (images, fonts)

### Replacement engine

```ts
type Rule = {
  name: string;
  find: string | RegExp;
  replace: string;
  glob: string[];
  exclude?: string[];
};
```

Rules are applied sequentially per file. Each file is read once, all applicable rules
are applied in order, and the file is written once (if changed).

### Dry-run output

In dry-run mode, the script outputs:
- Total files scanned
- Files that would be modified (grouped by rule)
- A sample diff for each rule (first 3 matches)
- Summary of reset operations that would be performed

No files are written. No git operations are performed.

### Error handling

- Validate that `--scope` is a valid npm scope (lowercase, alphanumeric + hyphens)
- Check that the current directory is the repo root (look for `turbo.json`)
- Warn if there are uncommitted changes (suggest committing first)
- Fail fast on file read/write errors

---

## What This Does NOT Do

- **Push to remote.** The user decides when and where to push.
- **Rename the GitHub repository.** That's a manual operation in GitHub settings.
- **Update CI/CD.** Pipeline configs may reference `uiid` in deployment-specific ways.
- **Rename the local directory.** The folder name is the user's choice.
- **Handle Figma.** Figma file names, variable collections, and component names are
  managed in the Figma UI.

---

## Verification

After running the script:

1. **Grep check**: `grep -r "uiid" --include="*.ts" --include="*.tsx" --include="*.css"
   --include="*.json" --exclude-dir=node_modules --exclude-dir=dist
   --exclude=pnpm-lock.yaml` should return zero results (or only results in
   `scripts/rebrand.ts` itself and this doc)
2. **Build**: `pnpm run build` succeeds
3. **Tests**: `pnpm test:run` passes
4. **Storybook**: `pnpm run storybook` launches with components rendering
5. **Token generation**: `pnpm run tokens` produces valid CSS with new layer names

---

## Open Questions

1. **Should the script delete itself after running?** Keeping it means forks-of-forks
   can rebrand again. Recommendation: keep it with a comment noting it's for initial
   setup.

2. **CSS layer naming.** The layering strategy is under revision. The rebrand script's
   layer replacement rules (rule 2) should be written against whatever convention is
   settled on. If layers are removed entirely, rule 2 becomes a no-op and can be
   dropped.
