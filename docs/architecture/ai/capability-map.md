# Capability Map: `@uiid/ai` POC

**Date:** 2026-10-27
**Status:** Map approved; module specs in progress
**Source:** [vercel/ai-elements](https://github.com/vercel/ai-elements) `packages/elements/src` at `ca8be60` (2026-10-14)

## Why

AI Elements is a shadcn registry of chat-UI components. It is copy-in source on Tailwind and shadcn primitives, not a package. Porting it means re-expressing each component on existing `@uiid` components and CSS Modules. Upstream's Radix-only APIs (`asChild`, `data-[state=…]`) disappear in that swap, so the primitive layer is not where the cost is.

This map covers a POC subset. Out of scope: everything that needs `@xyflow/react`, `@rive-app/react-webgl2`, `media-chrome`, `ansi-to-react` or `react-jsx-parser`, plus MessageBranch, ConversationDownload, PromptInput attachments, drag-and-drop and the command menu.

## Decisions

| Decision                  | Outcome                                                                                                                                                                                                                 |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vercel `ai` SDK types     | Not a dependency. `@uiid/ai` defines its own types, structurally compatible with the SDK's message, tool-part and chat-status shapes.                                                                                   |
| Markdown                  | `markdown-to-jsx`, which has zero dependencies and renders React elements styled by `Prose`. Placement rule: a dependency-bearing renderer lives in `@uiid/ai`; a dependency-free one would live in `@uiid/typography`. |
| Streaming markdown repair | Written locally, not `remend`.                                                                                                                                                                                          |
| `use-stick-to-bottom`     | Not a dependency. Recreated locally as a hook.                                                                                                                                                                          |
| `motion`                  | Not a dependency. Shimmer is pure CSS.                                                                                                                                                                                  |
| Shimmer                   | Lives in `@uiid/typography` next to `Reveal`. It is a text effect with nothing AI-specific about it.                                                                                                                    |

## Modules

| Module id            | Responsibility                                                                                                            | Package            | Depends on                                      |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------ | ----------------------------------------------- |
| `forms-input-group`  | `InputWrapper` `orientation`, so Textarea gets stacked `before`/`after` slots inside one field surface                    | `@uiid/forms`      | —                                               |
| `typography-shimmer` | `Shimmer`: an animated highlight sweep across a line of text                                                              | `@uiid/typography` | —                                               |
| `ai-scaffold`        | The `@uiid/ai` package, its registrations, and the shared structural types                                                | `@uiid/ai`         | —                                               |
| `markdown`           | Renders a possibly-incomplete markdown string as plain elements under `Prose`                                             | `@uiid/ai`         | `ai-scaffold`                                   |
| `ai-message`         | Message, MessageContent, MessageActions, MessageAction, MessageToolbar, MessageResponse, Suggestion                       | `@uiid/ai`         | `ai-scaffold`, `markdown`                       |
| `ai-conversation`    | Conversation, ConversationContent, ConversationEmptyState, ConversationScrollButton, plus a local `useStickToBottom` hook | `@uiid/ai`         | `ai-scaffold`                                   |
| `ai-reasoning-tool`  | Reasoning, Tool                                                                                                           | `@uiid/ai`         | `ai-scaffold`, `markdown`, `typography-shimmer` |
| `ai-prompt-input`    | PromptInput (trimmed): textarea, submit/stop by status, header, footer, tools                                             | `@uiid/ai`         | `ai-scaffold`, `forms-input-group`              |

**Build order:**

1. `forms-input-group`, `typography-shimmer` and `ai-scaffold`, in parallel
2. `markdown`
3. `ai-message`, `ai-conversation` and `ai-reasoning-tool`, in parallel
4. `ai-prompt-input`

Each module has its own spec in this directory, named `SPEC-<module-id>.md`. This map is the index of what exists.

| Spec                                                         | Status   |
| ------------------------------------------------------------ | -------- |
| [`SPEC-typography-shimmer.md`](./SPEC-typography-shimmer.md) | Approved |
| [`SPEC-ai-scaffold.md`](./SPEC-ai-scaffold.md)               | Approved |
| [`SPEC-forms-input-group.md`](./SPEC-forms-input-group.md)   | Approved |
