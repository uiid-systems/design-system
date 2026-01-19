import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack, Group } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { CodeInline } from "@uiid/code";

const meta = {
  title: "Code/Code Inline",
  component: CodeInline,
  tags: ["beta"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    language: {
      control: "select",
      options: [
        undefined,
        "javascript",
        "typescript",
        "jsx",
        "tsx",
        "json",
        "css",
        "html",
        "bash",
        "python",
      ],
    },
  },
} satisfies Meta<typeof CodeInline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "npm install @uiid/code",
  },
};

export const WithLanguage: Story = {
  args: {
    children: "const x: number = 42;",
    language: "typescript",
  },
};

export const InText: Story = {
  args: {
    children: "npm install",
  },
  render: () => (
    <Stack gap={4}>
      <Text>
        Run <CodeInline>npm install</CodeInline> to install dependencies.
      </Text>
      <Text>
        The <CodeInline language="typescript">useState</CodeInline> hook is used
        for managing component state.
      </Text>
      <Text>
        Set <CodeInline language="bash">NODE_ENV=production</CodeInline> for
        production builds.
      </Text>
    </Stack>
  ),
};

export const Languages: Story = {
  args: {
    children: "npm install",
  },
  render: () => (
    <Stack gap={2}>
      <Group gap={2} ay="center">
        <Text size={-1} style={{ width: 100 }}>
          Plain:
        </Text>
        <CodeInline>npm install</CodeInline>
      </Group>
      <Group gap={2} ay="center">
        <Text size={-1} style={{ width: 100 }}>
          TypeScript:
        </Text>
        <CodeInline language="typescript">const x: number = 42;</CodeInline>
      </Group>
      <Group gap={2} ay="center">
        <Text size={-1} style={{ width: 100 }}>
          JavaScript:
        </Text>
        <CodeInline language="javascript">console.log("hello")</CodeInline>
      </Group>
      <Group gap={2} ay="center">
        <Text size={-1} style={{ width: 100 }}>
          Bash:
        </Text>
        <CodeInline language="bash">echo $HOME</CodeInline>
      </Group>
      <Group gap={2} ay="center">
        <Text size={-1} style={{ width: 100 }}>
          JSON:
        </Text>
        <CodeInline language="json">{`{"key": "value"}`}</CodeInline>
      </Group>
    </Stack>
  ),
};
