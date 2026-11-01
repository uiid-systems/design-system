# Capability Map: `@uiid/ai` POC

**Date:** 2026-10-27, wave 2 added 2026-11-01
**Status:** Wave 1 shipped; wave 2 proposed
**Source:** [vercel/ai-elements](https://github.com/vercel/ai-elements) `packages/elements/src` at `ca8be60` (2026-10-14) for wave 1. shadcn/ui [AI Elements](https://ui.shadcn.com/docs/ai-elements) at the `base-nova` registry (2026-11-01) for wave 2, after upstream relaunched the set as patterns composed from shadcn/ui components.

## Why

AI Elements is a shadcn registry of chat-UI components. It is copy-in source on Tailwind and shadcn primitives, not a package. Porting it means re-expressing each component on existing `@uiid` components and CSS Modules. Upstream's Radix-only APIs (`asChild`, `data-[state=…]`) disappear in that swap, so the primitive layer is not where the cost is.

This map covers a POC subset. Out of scope: everything that needs `@xyflow/react`, `@rive-app/react-webgl2`, `media-chrome`, `ansi-to-react` or `react-jsx-parser`, plus MessageBranch, ConversationDownload, PromptInput attachments, drag-and-drop and the command menu.

## Decisions

| Decision                  | Outcome                                                                                                                                                                                                                 |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vercel `ai` SDK types     | Not a dependency. `@uiid/ai` defines its own types, structurally compatible with the SDK's message, tool-part and chat-status shapes.                                                                                   |
| Markdown                  | `markdown-to-jsx`, which has zero dependencies and renders React elements styled by `Prose`. Placement rule: a dependency-bearing renderer lives in `@uiid/ai`; a dependency-free one would live in `@uiid/typography`. |
| Streaming markdown repair | `markdown-to-jsx`'s own `optimizeForStreaming` option, exposed as a `streaming` prop. No local repair pass and not `remend`. See `SPEC-markdown.md`.                                                                    |
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

## Wave 2

Wave 1 is the chat core: a conversation of messages with markdown, reasoning, tool calls and a prompt. Wave 2 is what the agent did, shown as steps. Upstream rebuilt ten of its twenty-one relaunched patterns on one `Trace` primitive, so the primitive comes first and each pattern after it is a small module. Overlay and code-block patterns wait on decisions outside `@uiid/ai`.

| Module id               | Responsibility                                                                                        | Package             | Depends on                                 |
| ----------------------- | ----------------------------------------------------------------------------------------------------- | ------------------- | ------------------------------------------ |
| `interactive-trace`     | Trace, TraceLine, TraceIcon, TraceTitle, TraceDescription, TraceCollapsible and its Trigger and Panel | `@uiid/interactive` | `typography-shimmer`                       |
| `ai-confirmation`       | Approve and deny a tool call in the `approval-requested` state                                        | `@uiid/ai`          | `ai-reasoning-tool`                        |
| `ai-sources`            | A collapsible list of cited URLs                                                                      | `@uiid/ai`          | `interactive-trace`                        |
| `ai-checkpoint`         | A labeled divider with a restore action, on `Separator` with children                                 | `@uiid/ai`          | `ai-scaffold`                              |
| `ai-task`               | A collapsible step list with per-step status                                                          | `@uiid/ai`          | `interactive-trace`                        |
| `ai-plan`               | An ordered list of steps the user approves before the agent runs                                      | `@uiid/ai`          | `interactive-trace`, `ai-confirmation`     |
| `ai-chain-of-thought`   | Reasoning, tool and source rows interleaved in one trace                                              | `@uiid/ai`          | `interactive-trace`, `ai-reasoning-tool`   |
| `ai-subagent`           | A nested trace for a delegated agent's own steps                                                      | `@uiid/ai`          | `interactive-trace`, `ai-chain-of-thought` |
| `overlays-preview-card` | `PreviewCard` wrapping Base UI's part, for hover detail                                               | `@uiid/overlays`    | —                                          |
| `ai-context`            | Token usage and cost on hover, with `Progress`                                                        | `@uiid/ai`          | `overlays-preview-card`                    |
| `ai-inline-citation`    | A numbered marker in prose that previews its source on hover                                          | `@uiid/ai`          | `overlays-preview-card`, `ai-sources`      |
| `ai-code-output`        | Terminal, TestResults and StackTrace, once a code block for `@uiid/ai` is decided                     | `@uiid/ai`          | `interactive-trace`, a code-block decision |

Deferred, with no module: Model Selector, which is a dropdown with search and belongs to the app, and File Tree, which is a tree view with nothing AI-specific and would be its own `@uiid/interactive` proposal.

Open in this wave: whether `Tool` becomes a trace row the way upstream's did, or stays a bordered card and the trace-based modules render tool parts as rows themselves. It is decided when the `Tool` follow-up in `SPEC-interactive-trace.md` starts, not before.

**Build order:**

1. `interactive-trace` and `ai-confirmation`, in parallel
2. `ai-sources` and `ai-checkpoint`, in parallel
3. `ai-task`, `ai-plan`, `ai-chain-of-thought`, then `ai-subagent`
4. `overlays-preview-card`, then `ai-context` and `ai-inline-citation`
5. `ai-code-output`, after the code-block decision

## Specs

Each module has its own spec in this directory, named `SPEC-<module-id>.md`. This map is the index of what exists.

| Spec                                                         | Status   |
| ------------------------------------------------------------ | -------- |
| [`SPEC-typography-shimmer.md`](./SPEC-typography-shimmer.md) | Approved |
| [`SPEC-ai-scaffold.md`](./SPEC-ai-scaffold.md)               | Approved |
| [`SPEC-forms-input-group.md`](./SPEC-forms-input-group.md)   | Approved |
| [`SPEC-markdown.md`](./SPEC-markdown.md)                     | Approved |
| [`SPEC-ai-conversation.md`](./SPEC-ai-conversation.md)       | Approved |
| [`SPEC-ai-message.md`](./SPEC-ai-message.md)                 | Approved |
| [`SPEC-ai-prompt-input.md`](./SPEC-ai-prompt-input.md)       | Approved |
| [`SPEC-ai-reasoning-tool.md`](./SPEC-ai-reasoning-tool.md)   | Approved |
| [`SPEC-interactive-trace.md`](./SPEC-interactive-trace.md)   | Proposed |
