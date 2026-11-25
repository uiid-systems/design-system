import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Group, Text, CodeInline, Table } from "@uiid/design-system";

const LONG_COMMAND =
  "pnpm --filter @uiid/storybook exec vitest run --project storybook --reporter verbose";
const LONG_PATH =
  "packages/code/src/code-inline/subcomponents/an-unusually-long-file-name-with-no-spaces.tsx";

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

/* A long command wraps at its spaces and a long path anywhere, so neither
   widens the column. A short snippet stays on one line. */
export const LongSnippetNarrowColumn: Story = {
  name: "Long Snippet, Narrow Column",
  args: {
    children: "npm install",
  },
  render: () => (
    <Stack gap={4} maxw={320}>
      <Text render={<p />}>
        Run <CodeInline>{LONG_COMMAND}</CodeInline> to test the stories.
      </Text>
      <Text render={<p />}>
        Open <CodeInline>{LONG_PATH}</CodeInline> to edit it.
      </Text>
      <Text render={<p />}>
        Highlighted <CodeInline language="bash">{LONG_COMMAND}</CodeInline>
      </Text>
      <Text render={<p />}>
        Short <CodeInline>pnpm install</CodeInline>
      </Text>
    </Stack>
  ),
};

/* The heading's size scales the code, which keeps its own surface. */
export const InHeading: Story = {
  args: {
    children: "useHighlight",
  },
  render: () => (
    <Stack gap={4}>
      <Text render={<h2 />} size={4} weight="bold">
        The <CodeInline>useHighlight</CodeInline> hook
      </Text>
      <Text render={<h3 />} size={2} weight="semibold">
        Configure <CodeInline language="ts">highlightLines</CodeInline>
      </Text>
    </Stack>
  ),
};

/* The link's underline runs through the code, and plain code takes the
   link's color. */
export const InLink: Story = {
  args: {
    children: "CodeBlock",
  },
  render: () => (
    <Text render={<p />}>
      Read the{" "}
      <Text render={<a href="#code-block" />} underline>
        <CodeInline>CodeBlock</CodeInline> guide
      </Text>{" "}
      or the{" "}
      <Text render={<a href="#highlight" />} underline color="blue">
        <CodeInline language="ts">highlight()</CodeInline> reference
      </Text>
      .
    </Text>
  ),
};

const TABLE_ROWS = [
  { prop: "language", type: "CodeLanguage" },
  { prop: "html", type: "string" },
  { prop: "path", type: LONG_PATH },
];

export const InTable: Story = {
  args: {
    children: "language",
  },
  render: () => (
    <Table
      items={TABLE_ROWS}
      bordered
      formatCell={(value, column) =>
        column === "prop" ? (
          <CodeInline>{String(value)}</CodeInline>
        ) : (
          <CodeInline language="ts">{String(value)}</CodeInline>
        )
      }
    />
  ),
};

/* Each container's [data-theme] picks the colors, with no re-highlight. */
export const Themes: Story = {
  args: {
    children: "npm install",
  },
  render: () => (
    <Group gap={4} evenly>
      {(["light", "dark"] as const).map((theme) => (
        <Stack key={theme} data-theme={theme} gap={2} p={4}>
          <Text render={<p />}>
            Plain <CodeInline>pnpm install</CodeInline> in {theme}.
          </Text>
          <Text render={<p />}>
            Highlighted{" "}
            <CodeInline language="typescript">const x: number = 42;</CodeInline>{" "}
            in {theme}.
          </Text>
        </Stack>
      ))}
    </Group>
  ),
};
