import type { Meta, StoryObj } from "@storybook/react-vite";
import { Message, MessageContent, MessageResponse } from "@uiid/ai";
import { CodeBlock, Stack } from "@uiid/design-system";
import type {
  MarkdownCodeBlockProps,
  MarkdownOverrides,
} from "@uiid/design-system";

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
 * The opt-in recipe from the Message README: `@uiid/ai` does not depend on
 * `@uiid/code`, so the app passes CodeBlock as Markdown's codeBlock override.
 * Defined once, outside render, so each block keeps its instance.
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
};

export const WithActions: Story = {
  render: () => <Examples.WithActions />,
};

export const WithConversation: Story = {
  render: () => <Examples.WithConversation />,
};
