# Tool

> The collapsible card for one tool call. The header names the tool and wears a colored state `Badge`; the panel shows the call's parameters and its result or error. It takes the part object the AI SDK's `useChat` hands over and renders the whole card from it, on the [`Collapsible`](../../../interactive/src/collapsible/README.md) parts.

Use Tool when you want to:

- Show each tool call in a transcript with its state at a glance: pending, running, awaiting approval, done, failed or denied
- Let the reader open the call to see what the model asked for and what came back
- Render an SDK part as it is, without picking fields out of it first

## Usage

```tsx
import { Tool } from "@uiid/ai";

{
  message.parts.map((part, index) =>
    part.type.startsWith("tool-") || part.type === "dynamic-tool" ? (
      <Tool key={index} part={part} />
    ) : null,
  );
}
```

## Props

All `Collapsible` root props, which are Base UI's `open`, `defaultOpen`, `onOpenChange` and `disabled` plus the [`Stack`](../../../layout/src/stack/README.md) layout props, and:

| Prop       | Type        | Default | Description                                                 |
| ---------- | ----------- | ------- | ----------------------------------------------------------- |
| `part`     | `ToolPart`  | —       | The tool call. Both of the SDK's tool part types satisfy it |
| `children` | `ReactNode` | —       | Replaces the default parameters and result body when given  |

Defaults: `fullwidth`, `ax="stretch"` and `b={1}`, so the card is a bordered `Stack` with the global radius whose panel spans it, and a wide input scrolls inside the card. Closed by default; pass `defaultOpen` to start it open. Renders `data-slot="tool"` and `data-state` set to the part's state on the root, `data-slot="tool-trigger"` and `data-slot="tool-status"` in the header, and `data-slot="tool-panel"`, `data-slot="tool-input"` and `data-slot="tool-output"` inside.

### ToolPart

| Field       | Type        | Description                                                             |
| ----------- | ----------- | ----------------------------------------------------------------------- |
| `type`      | `string`    | `tool-{name}` for a static tool or `dynamic-tool`                       |
| `toolName`  | `string?`   | The tool's name, on a dynamic part                                      |
| `title`     | `string?`   | A display title, when the provider sends one                            |
| `state`     | `ToolState` | One of the seven lifecycle states below                                 |
| `input`     | `unknown?`  | The parameters the model sent                                           |
| `output`    | `unknown?`  | The result. A string renders as itself, an element as itself, else JSON |
| `errorText` | `string?`   | The failure message, in the `output-error` state                        |

The header's name is `title`, else `toolName`, else `type` without its `tool-` prefix.

## States

| State                | Label             | Hue       |
| -------------------- | ----------------- | --------- |
| `input-streaming`    | Pending           | `neutral` |
| `input-available`    | Running           | `blue`    |
| `approval-requested` | Awaiting approval | `yellow`  |
| `approval-responded` | Responded         | `indigo`  |
| `output-available`   | Completed         | `green`   |
| `output-error`       | Error             | `red`     |
| `output-denied`      | Denied            | `orange`  |

The running state's icon spins, and stops under `prefers-reduced-motion`.

## Body

The panel is a `Stack` of two sections. "Parameters" pretty-prints `input` as JSON in a `pre`, and is left out when there is no input. "Result" shows `output`, or becomes "Error" and shows `errorText` in red; with neither, there is no second section. Code renders through [`Prose`](../../../typography/src/prose/README.md), the same way a fence in the reply does. A product that wants syntax highlighting, or a chart, or anything else, passes `children` and the default body steps aside:

```tsx
<Tool part={part}>
  <WeatherCard {...part.output} />
</Tool>
```

## Notes

- `part` is one prop rather than a spread because an SDK part carries `toolCallId`, `approval`, metadata and more that have no place on a `div`.
- `Tool` holds no state of its own. The open state is the Collapsible's, and everything else is read from `part` on each render, so a part that moves from `input-streaming` to `output-available` updates in place.
- There is no approve or deny button row. The SDK's `addToolApprovalResponse` is a product decision; render your own controls as `children` in the `approval-requested` state.
