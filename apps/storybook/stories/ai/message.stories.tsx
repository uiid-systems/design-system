import type { Meta, StoryObj } from "@storybook/react-vite";
import { Message, MessageContent, MessageResponse } from "@uiid/ai";
import { Button, CodeBlock, highlight, Stack } from "@uiid/design-system";
import type {
  MarkdownCodeBlockProps,
  MarkdownOverrides,
} from "@uiid/design-system";
import { useEffect, useState, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { expect, waitFor } from "storybook/test";

import * as Examples from "../../../../packages/ai/src/message/message.examples";

const meta = {
  title: "AI/Message",
  component: Message,
  args: {
    from: "assistant",
    gap: 2,
  },
  argTypes: {
    from: {
      control: "select",
      options: ["user", "assistant", "system"],
      table: { category: "Layout" },
    },
    gap: { control: "number", table: { category: "Spacing" } },
    render: { table: { disable: true } },
    ref: { table: { disable: true } },
    style: { table: { disable: true } },
    className: { table: { disable: true } },
    children: { table: { disable: true } },
  },
} satisfies Meta<typeof Message>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <Examples.Basic {...args} />,
};

export const UserAndAssistant: Story = {
  render: () => <Examples.UserAndAssistant />,
};

export const Streaming: Story = {
  render: () => <Examples.Streaming />,
};

/*
 * The opt-in recipe from the Message README, shared by every story with code:
 * `@uiid/ai` does not depend on `@uiid/code`, so the app passes CodeBlock as
 * Markdown's codeBlock override. Defined once, outside render, so each block
 * keeps its instance.
 */
const ChatCodeBlock = ({ code, language }: MarkdownCodeBlockProps) => (
  <CodeBlock
    code={code}
    language={language ?? "text"}
    notations={false}
    hideLanguageIcon
  />
);

const CODE_OVERRIDES: MarkdownOverrides = { codeBlock: ChatCodeBlock };

const CODE_QUESTION = "How do I keep a count in a React component?";
const CODE_ANSWER = [
  "Hold it in state with `useState`, and set it from the click handler:",
  "",
  "```tsx",
  'import { useState } from "react";',
  "",
  "export const Counter = () => {",
  "  const [count, setCount] = useState(0);",
  "  return (",
  '    <button type="button" onClick={() => setCount(count + 1)}>',
  "      Clicked {count} times",
  "    </button>",
  "  );",
  "};",
  "```",
  "",
  "Then start the dev server:",
  "",
  "```",
  "pnpm dev",
  "```",
  "",
  "Each click re-renders the button with the new count.",
].join("\n");

const BLOCK = '[data-slot="code-block"]';

/** A token Shiki colored; plain text has none. */
const COLORED_TOKEN = "span[style*='--shiki-light']";

const getBlocks = (root: ParentNode) => [
  ...root.querySelectorAll<HTMLElement>(BLOCK),
];

const content = (block: Element) =>
  block.querySelector<HTMLElement>('[data-slot="code-block-content"]')!;

/** Whether the block shows Shiki's output rather than its plain fallback. */
const isHighlighted = (block: Element) =>
  content(block).querySelector("pre.shiki") !== null;

/** The text the block shows, as a reader or a selection sees it. */
const shownText = (block: Element) =>
  content(block).querySelector("code")?.textContent;

/* A finished reply with code: each fence is a CodeBlock with only a copy button. */
export const WithCode: Story = {
  render: () => (
    <Stack gap={4} w="full">
      <Message from="user">
        <MessageContent>
          <MessageResponse>{CODE_QUESTION}</MessageResponse>
        </MessageContent>
      </Message>
      <Message from="assistant">
        <MessageContent>
          <MessageResponse overrides={CODE_OVERRIDES}>
            {CODE_ANSWER}
          </MessageResponse>
        </MessageContent>
      </Message>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const blocks = getBlocks(canvasElement);
    await expect(blocks).toHaveLength(2);
    await waitFor(() => expect(blocks.every(isHighlighted)).toBe(true), {
      timeout: 10_000,
    });
    const [tsx, bare] = blocks;

    for (const block of blocks) {
      const header = block.querySelector(
        ':scope > [data-slot="code-block-header"]',
      );
      // No bar: the buttons float over the code, and the only one is copy.
      await expect(header).toHaveAttribute("data-floating");
      const buttons = [...header!.querySelectorAll("button")];
      await expect(buttons).toHaveLength(1);
      await expect(buttons[0]).toHaveAttribute(
        "data-slot",
        "code-block-copy-button",
      );
      await expect(block.querySelector('[data-slot="language-icon"]')).toBe(
        null,
      );
    }

    // The tsx fence is colored; the fence with no language is plain text.
    await expect(tsx.querySelector(COLORED_TOKEN)).not.toBe(null);
    await expect(bare.querySelector(COLORED_TOKEN)).toBe(null);
    await expect(shownText(bare)).toBe("pnpm dev");
  },
};

/** `text` cut into `count` non-empty chunks of near-equal length. */
const chunk = (text: string, count: number) =>
  Array.from({ length: count }, (_, i) =>
    text.slice(
      Math.round((i * text.length) / count),
      Math.round(((i + 1) * text.length) / count),
    ),
  );

type ReplyState = { text: string; streaming: boolean };

/**
 * A reply that arrives a chunk per `step()`, as a store React subscribes to.
 * The caller decides when each chunk lands: a play function steps it a frame
 * at a time, and the story's own player steps it on animation frames.
 */
const createReplyStream = (chunks: string[]) => {
  const listeners = new Set<() => void>();
  let sent = 0;
  let state: ReplyState = { text: "", streaming: true };
  const set = (next: ReplyState) => {
    state = next;
    for (const listener of listeners) listener();
  };
  return {
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => void listeners.delete(listener);
    },
    get: () => state,
    /** Send the next chunk. False once every chunk is out. */
    step: () => {
      if (sent >= chunks.length) return false;
      set({ text: state.text + chunks[sent++], streaming: true });
      return true;
    },
    /** End the stream: the reply is complete. */
    finish: () => set({ ...state, streaming: false }),
    reset: () => {
      sent = 0;
      set({ text: "", streaming: true });
    },
  };
};

type ReplyStream = ReturnType<typeof createReplyStream>;

const STREAM_BEFORE =
  "Hold the count in state with `useState`, and set it from the click handler. A label prop keeps the text reusable:\n\n";

const STREAM_OPEN = "```tsx\n";

const STREAM_CODE = [
  'import { useState } from "react";',
  "",
  "type CounterProps = {",
  "  /** Shown before the count. */",
  "  label?: string;",
  "};",
  "",
  "// A button that counts its clicks",
  'export const Counter = ({ label = "Clicked" }: CounterProps) => {',
  "  const [count, setCount] = useState(0);",
  "  /* A template literal, so the label and",
  "     the count read as one string */",
  "  const text = `${label} ${count} times`;",
  "  return (",
  '    <button type="button" onClick={() => setCount(count + 1)}>',
  "      {text}",
  "    </button>",
  "  );",
  "};",
].join("\n");

const STREAM_CLOSE = "\n```\n\n";

const STREAM_AFTER =
  "Each click re-renders the button with the new count, so the label always matches what was clicked.";

const STREAM_ANSWER = [
  STREAM_BEFORE,
  STREAM_OPEN,
  STREAM_CODE,
  STREAM_CLOSE,
  STREAM_AFTER,
].join("");

/*
 * The prose and the code arrive a few characters at a time, and both fence
 * lines one character at a time, so the stream passes through every partial
 * fence: a lone backtick, `tsx` half typed, the closing backticks one by one.
 */
const STREAM_CHUNKS = [
  ...chunk(STREAM_BEFORE, 30),
  ...STREAM_OPEN,
  ...chunk(STREAM_CODE, 160),
  ...STREAM_CLOSE,
  ...chunk(STREAM_AFTER, 25),
];

/** Where the fenced code starts and ends in the finished reply. */
const CODE_START = STREAM_BEFORE.length + STREAM_OPEN.length;
const CODE_END = CODE_START + STREAM_CODE.length;

/**
 * The code a reader has received once `text` has arrived: everything after
 * the opening fence, up to the closing one. Null before the fence's first line.
 */
const receivedCode = (text: string) =>
  text.length > CODE_START
    ? STREAM_ANSWER.slice(CODE_START, Math.min(text.length, CODE_END))
    : null;

/**
 * The streaming reply. Given a `stream`, the caller drives it. Without one it
 * makes its own and plays it on load, a chunk per animation frame; Replay
 * plays it again.
 */
const StreamingCodeReply = ({ stream: driven }: { stream?: ReplyStream }) => {
  const [own] = useState(() =>
    driven ? undefined : createReplyStream(STREAM_CHUNKS),
  );
  const stream = driven ?? own!;
  const { text, streaming } = useSyncExternalStore(
    stream.subscribe,
    stream.get,
  );
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!own) return;
    let frame = requestAnimationFrame(function tick() {
      if (own.step()) frame = requestAnimationFrame(tick);
      else own.finish();
    });
    return () => cancelAnimationFrame(frame);
  }, [own, run]);

  return (
    <Stack gap={4} w="full">
      {own && (
        <Button
          size="small"
          variant="subtle"
          onClick={() => {
            own.reset();
            setRun((n) => n + 1);
          }}
        >
          Replay
        </Button>
      )}
      <Message from="user">
        <MessageContent>
          <MessageResponse>{CODE_QUESTION}</MessageResponse>
        </MessageContent>
      </Message>
      <Message from="assistant">
        <MessageContent>
          {/* A new reply per run, so a replay starts from empty. */}
          <MessageResponse
            key={run}
            streaming={streaming}
            overrides={CODE_OVERRIDES}
          >
            {text}
          </MessageResponse>
        </MessageContent>
      </Message>
    </Stack>
  );
};

const nextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

/** Markup as the browser serializes it, which escapes `<` as `&lt;`. */
const serialized = (html: string) => {
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.innerHTML;
};

/*
 * A reply with prose, a tsx fence and more prose, streamed through
 * MessageResponse and the chat CodeBlock recipe. The play function sends one
 * chunk per frame, renders it synchronously and checks the frame it leaves:
 * once highlighted the block never shows its plain fallback again, its text is
 * the code received so far, its height never drops, and it is the same block
 * element throughout, so the code component never remounts.
 */
export const StreamingWithCode: Story = {
  render: () => <StreamingCodeReply />,
  play: async ({ mount, canvasElement }) => {
    const stream = createReplyStream(STREAM_CHUNKS);
    await mount(<StreamingCodeReply stream={stream} />);

    const failures: string[] = [];
    const seen = new Set<Element>();
    let highlighted = false;
    let plainAfterHighlight = 0;
    let lastHeight = 0;

    const check = (code: string | null, at: string) => {
      const block = canvasElement.querySelector<HTMLElement>(BLOCK);
      if (block) seen.add(block);
      if (code === null) return;
      if (!block) {
        failures.push(`${at}: no code block`);
        return;
      }

      const now = isHighlighted(block);
      if (highlighted && !now) plainAfterHighlight++;
      highlighted ||= now;

      // A chunk can end on newlines. CodeBlock leaves one out, since it ends
      // the last line, and markdown drops the blank lines at the end of a
      // fence, closed or not. A blank line shows once code arrives after it,
      // so the block grows into it rather than showing it and then losing it.
      const expected = code.replace(/(\r?\n)+$/, "");
      const shown = shownText(block);
      if (shown !== expected) {
        failures.push(
          `${at}: shows ${JSON.stringify(shown?.slice(-12))}, received ${JSON.stringify(expected.slice(-12))}`,
        );
      }

      const { height } = block.getBoundingClientRect();
      if (height < lastHeight) {
        failures.push(`${at}: height ${lastHeight} -> ${height}`);
      }
      lastHeight = height;
    };

    for (let i = 0; stream.get().text.length < STREAM_ANSWER.length; i++) {
      flushSync(() => stream.step());
      check(
        receivedCode(stream.get().text),
        `chunk ${i} ${JSON.stringify(stream.get().text.slice(-6))}`,
      );
      await nextFrame();
    }
    flushSync(() => stream.finish());
    check(STREAM_CODE, "finished");

    // Then frame by frame until the markup is a one-shot highlight of the
    // whole code, as the recipe renders it.
    const oneShot = serialized(
      (await highlight(STREAM_CODE, "tsx", { notations: false })).replace(
        ' tabindex="0"',
        "",
      ),
    );
    const block = () => canvasElement.querySelector<HTMLElement>(BLOCK)!;
    for (let i = 0; i < 600 && content(block()).innerHTML !== oneShot; i++) {
      await nextFrame();
      check(STREAM_CODE, `settle ${i}`);
    }

    await expect(failures).toEqual([]);
    await expect(highlighted).toBe(true);
    await expect(plainAfterHighlight).toBe(0);
    await expect(seen.size).toBe(1);
    await expect(content(block()).innerHTML).toBe(oneShot);
  },
};

const LONG_LINE =
  "pnpm --filter @uiid/design-system exec vitest run --reporter=verbose --coverage.enabled";

const NESTED_ANSWER = [
  "Two steps:",
  "",
  "1. Run the checks in one package:",
  "",
  "   ```bash",
  `   ${LONG_LINE}`,
  "   ```",
  "",
  "2. Read the report.",
  "",
  "> The config it reads looks like this:",
  ">",
  "> ```ts",
  '> export const config = { include: ["src/**/*.test.tsx"], environment: "happy-dom", globals: true };',
  "> ```",
].join("\n");

/* Code inside a list item and a blockquote, in a 320px viewport: each block keeps its frame inside the item or the quote, and its long line scrolls inside the block. */
export const CodeInListAndQuote: Story = {
  globals: { viewport: { value: "mobile1" } },
  render: () => (
    <Message from="assistant">
      <MessageContent>
        <MessageResponse overrides={CODE_OVERRIDES}>
          {NESTED_ANSWER}
        </MessageResponse>
      </MessageContent>
    </Message>
  ),
  play: async ({ canvasElement }) => {
    const blocks = getBlocks(canvasElement);
    await expect(blocks).toHaveLength(2);
    await waitFor(() => expect(blocks.every(isHighlighted)).toBe(true), {
      timeout: 10_000,
    });

    await expect(window.innerWidth).toBe(320);
    const [inList, inQuote] = blocks;
    await expect(inList.parentElement?.tagName).toBe("LI");
    await expect(inQuote.parentElement?.tagName).toBe("BLOCKQUOTE");

    for (const block of blocks) {
      const parent = block.parentElement!;
      const box = block.getBoundingClientRect();
      const parentBox = parent.getBoundingClientRect();
      const style = getComputedStyle(block);
      // The frame: a border, inside the item or the quote it sits in.
      await expect(parseFloat(style.borderTopWidth)).toBeGreaterThan(0);
      await expect(parseFloat(style.borderRightWidth)).toBeGreaterThan(0);
      await expect(box.left).toBeGreaterThanOrEqual(parentBox.left);
      await expect(box.right).toBeLessThanOrEqual(parentBox.right + 0.5);
      await expect(parent.scrollWidth).toBeLessThanOrEqual(parent.clientWidth);
      // A step down from the text above it, not flush against it.
      const above = block.previousElementSibling!.getBoundingClientRect();
      await expect(box.top - above.bottom).toBeGreaterThan(0);
      // The long line scrolls inside the block's content.
      const scroller = content(block);
      await expect(getComputedStyle(scroller).overflowX).toBe("auto");
      await expect(scroller.scrollWidth).toBeGreaterThan(scroller.clientWidth);
    }

    // Nothing pushes the reply or the page sideways.
    const reply = canvasElement.querySelector<HTMLElement>(
      '[data-slot="message-response"]',
    )!;
    await expect(reply.scrollWidth).toBeLessThanOrEqual(reply.clientWidth);
    const page = document.documentElement;
    await expect(page.scrollWidth).toBeLessThanOrEqual(page.clientWidth);
  },
};

export const WithActions: Story = {
  render: () => <Examples.WithActions />,
};

export const WithConversation: Story = {
  render: () => <Examples.WithConversation />,
};
