import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  Card,
  CodePreview,
  Group,
  Stack,
  Text,
} from "@uiid/design-system";

import * as Examples from "../../../../packages/code/src/code-preview/code-preview.examples";

const meta = {
  title: "Code/Code Preview",
  component: CodePreview,
  tags: ["beta"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    showLineNumbers: { control: "boolean" },
    copyable: { control: "boolean" },
    defaultOpen: { control: "boolean" },
    resettable: { control: "boolean" },
  },
} satisfies Meta<typeof CodePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

const SAMPLE = `import { Button, Group } from "@uiid/design-system";

export const Actions = () => (
  <Group gap={2}>
    <Button variant="subtle">Cancel</Button>
    <Button>Save</Button>
  </Group>
);`;

const Actions = () => (
  <Group gap={2}>
    <Button variant="subtle">Cancel</Button>
    <Button>Save</Button>
  </Group>
);

/* Closed by default: the example on top, the "Show code" footer beneath it.
   Open, the code sits between them with its copy button floating top right.
   The code is mounted while closed, so the frame is as wide open as closed. */
export const Default: Story = {
  render: () => <Examples.Default />,
};

export const OpenByDefault: Story = {
  render: () => <Examples.OpenByDefault />,
};

/* No `code`: a framed canvas with no code and no footer. */
export const NoCode: Story = {
  render: () => <Examples.NoCode />,
};

/* A 40-line file opens in full. */
export const LongCode: Story = {
  render: () => <Examples.LongCode />,
};

/* Reset remounts the example: the words reveal again and the count clears.
   The subtle reset button sits in the top-right corner, with room kept for it
   above and below the example. */
export const Resettable: Story = {
  render: () => <Examples.Resettable />,
};

/* Wider than the frame: the example starts at the canvas's start edge and
   scrolls, rather than overflowing both sides, and the reset button stays in
   its corner. */
export const WideChild: Story = {
  render: () => <Examples.WideChild />,
};

/* Taller than the canvas's 7.5rem minimum: the canvas grows with the example. */
export const TallChild: Story = {
  render: () => <Examples.TallChild />,
};

/* Inside a Card, the preview takes the card's width and its long line scrolls
   inside the code. */
export const InCard: Story = {
  render: () => (
    <Card title="Actions" description="A cancel and a save button.">
      <CodePreview
        code={`${SAMPLE}\n// ${"a comment long enough to scroll sideways ".repeat(3)}`}
        language="tsx"
        resettable
      >
        <Actions />
      </CodePreview>
    </Card>
  ),
};

/* Each container's [data-theme] picks the colors, with no re-highlight. */
export const Themes: Story = {
  render: () => (
    <Group gap={4} evenly w="full" ay="start">
      {(["light", "dark"] as const).map((theme) => (
        <Stack key={theme} data-theme={theme} gap={4} p={4} w="full">
          <Text emphasis="muted">{theme}</Text>
          <CodePreview code={SAMPLE} language="tsx" resettable defaultOpen>
            <Actions />
          </CodePreview>
          <CodePreview code={SAMPLE} language="tsx">
            <Actions />
          </CodePreview>
        </Stack>
      ))}
    </Group>
  ),
};

/* An example that throws: a short message in the canvas, the rest intact. */
export const Throws: Story = {
  render: () => <Examples.Throws />,
};

export const Labels: Story = {
  render: () => <Examples.Labels />,
};

export const Controlled: Story = {
  render: () => <Examples.Controlled />,
};

/* The exported parts under CodePreviewRoot: the same frame, zones and footer,
   a floating copy button from CodeBlockHeader, and the code colored by
   useHighlight. */
export const Composed: Story = {
  render: () => <Examples.Composed />,
};
