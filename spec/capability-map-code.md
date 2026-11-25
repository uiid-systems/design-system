# Capability Map: `@uiid/code` hardening

## Intent

Bring `@uiid/code` up to the standard of the other packages and make it the polished code surface of the docs site. Add a published `CodePreview` that shows a live example above its collapsed source. Then carry the hardened block into markdown and add tabs.

- **User:** the owner first, through the docs site, where every component example renders in `CodePreview`. Then anyone using the package.
- **Constraint:** built from UIID components wherever one exists (`Dialog`, `Collapsible`, `Button`, `Tabs`), with no direct Base UI import or hand-rolled control in their place.
- **Buttons:** a button that is off is not in the DOM. No button is rendered disabled to mean "not available". Copy is on by default; reset, wrap and fullscreen are opt-in.
- **API:** the 1.0 rules in `.claude/rules/components.md`. Every component exports its composition parts, top-level props win over slot props, slot types omit owned keys.

## Modules

| Module id       | Milestone  | Responsibility                                                                               | Depends on     |
| --------------- | ---------- | -------------------------------------------------------------------------------------------- | -------------- |
| `code-block`    | 1 Harden   | Parts and slot rules, opt-in buttons, fullscreen on UIID `Dialog`, look and feel, robustness | —              |
| `code-inline`   | 1 Harden   | Polish and robustness for inline code                                                        | —              |
| `code-editor`   | 1 Harden   | Slot rules, polish, typing and alignment robustness                                          | `code-block`   |
| `streaming`     | 1 Harden   | The block stays stable while its `code` grows                                                | `code-block`   |
| `code-preview`  | 2 Preview  | New published component: frame, canvas, collapsed code, opt-in reset                         | `code-block`   |
| `docs-adoption` | 2 Preview  | Docs `Example` renders through `CodePreview`                                                 | `code-preview` |
| `markdown-code` | 3 Markdown | Fenced code in `@uiid/markdown` and `@uiid/ai` renders through `CodeBlock`                   | `streaming`    |
| `tabs`          | 4 Tabs     | Tabs in `CodePreview` and other code surfaces, if the work is enough for a milestone         | `code-preview` |

Build order: `code-block`, `code-inline` → `code-editor`, `streaming`, `code-preview` → `docs-adoption`, `markdown-code` → `tabs`

Each module has a spec beside this file: `spec/SPEC-<module id>.md`. Module ids do not change.

## Shared conventions

Every module spec inherits this section and states only what differs.

### Tech stack

React 19, TypeScript 7, Vite 8, `@base-ui/react` 1.9 (reached through UIID components), Shiki 4.6, CSS Modules with design tokens, `cva`, Vitest on happy-dom, Vitest browser mode on Playwright Chromium, Storybook.

### Commands

```
Install:        pnpm install
Unit tests:     pnpm test:run packages/code
Browser tests:  pnpm test:browser
Typecheck:      pnpm typecheck
Lint:           pnpm run lint
Format check:   pnpm run format:check
Build package:  pnpm run build --filter=@uiid/code
Build docs:     pnpm run build --filter=docs
Bundle sizes:   pnpm size
Storybook:      pnpm --filter @uiid/storybook dev
```

### Project structure

```
packages/code/src/code-block/       CodeBlock, its parts in subcomponents/
packages/code/src/code-preview/     CodePreview (new), same layout
packages/code/src/code-editor/      CodeEditor
packages/code/src/code-inline/      CodeInline
packages/code/src/highlighter/      Shiki loading, highlight(), useHighlight
packages/code/src/index.test.ts     the exact public surface
apps/storybook/stories/code/        one story per variant dimension
apps/docs/components/docs/          Example and the server highlight wrapper
packages/markdown/src/markdown/     Markdown (milestone 3)
spec/                               this map and the module specs
```

Each component directory holds `{name}.tsx`, `.types.ts`, `.module.css`, `.test.tsx`, `.examples.tsx`, `README.md`, and `.browser.test.tsx` where this project adds one.

### Code style

A slot spreads first, top-level values after through `definedProps()`, and a button that is off is simply absent:

```tsx
<CodeBlockHeader {...HeaderProps} {...definedProps({ filename, language })}>
  {wrappable && (
    <CodeBlockWrapButton
      {...WrapButtonProps}
      pressed={wrap}
      onPressedChange={onWrapChange}
    />
  )}
  {copyable && code && <CodeBlockCopyButton {...CopyButtonProps} code={code} />}
</CodeBlockHeader>
```

- `data-slot` on every part's root element, `cx()` for class names, `"use client"` only on parts that need it.
- Layout through `Stack`, `Group` and style props (`w="full"`, not the deprecated `fullwidth`). CSS Modules for visual styling and `data-*` state only. No `style={{}}` beyond the one existing `--code-rows` variable.
- State selectors written as `:where(.local)[data-…]`, because the docs build compiles CSS modules in pure mode.
- Token JSON holds literals and plain references only.

### Testing strategy

- **Unit (happy-dom), `{name}.test.tsx`:** rendering, `data-slot`, props, state, callbacks, a11y roles and names, and a `// @ts-expect-error` line for each owned key a slot type omits.
- **Browser (Chromium), `{name}.browser.test.tsx`:** anything that depends on layout or paint: heights before and after highlighting, overflow at 320px, theme resolution, nesting, caret alignment. `packages/forms` has the only existing browser tests and is the reference.
- **Stories:** every visual rule in a spec has a story that shows it. The owner judges look and feel by eye in Storybook; there is no design mock.
- **Surface:** any change to exports changes `packages/code/src/index.test.ts` in the same PR.

### Boundaries

- **Always:** read a UIID component's `.types.ts` before using it; add a story and a test with each behavior; mark breaking changes with `!` in the PR title and name them in the body; run unit tests, browser tests, typecheck, lint and `pnpm size` before opening a PR.
- **Ask first:** adding any dependency beyond `@uiid/interactive`, `@uiid/overlays` and `@uiid/navigation`; changing a component in another package to make it fit; changing Shiki themes, languages or the highlighter's public functions; raising a size limit.
- **Never:** import `@base-ui/react` in `@uiid/code` where a UIID component covers the part; render a disabled button to mean a feature is off; hand-edit generated files (`packages/tokens/src/props.css`); remove or skip a failing test; add AI attribution to commits or PRs.

## Out of scope for the whole project

- Live-editable playgrounds, where editing the code changes the preview.
- New languages or themes.
- Sandboxing previews in an iframe.
- Changing how docs extract example source from `*.examples.tsx`.
