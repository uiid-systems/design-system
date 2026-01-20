import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack, Box } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { Resizable } from "./resizable";
import { ResizablePanel, ResizableHandle } from "./subcomponents";

const meta = {
  title: "Interactive/Resizable",
  tags: ["new"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

function PanelContent({
  label,
  shade = "surface",
}: {
  label: string;
  shade?: "surface" | "background";
}) {
  return (
    <Box
      fullwidth
      fullheight
      ax="center"
      ay="center"
      p={4}
      style={{
        backgroundColor: `var(--shade-${shade})`,
        minHeight: 100,
      }}
    >
      <Text weight="bold">{label}</Text>
    </Box>
  );
}

function HorizontalDemo() {
  return (
    <Resizable direction="horizontal">
      <ResizablePanel defaultSize={50}>
        <PanelContent label="One" />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <PanelContent label="Two" shade="background" />
      </ResizablePanel>
    </Resizable>
  );
}

function VerticalDemo() {
  return (
    <Resizable direction="vertical">
      <ResizablePanel defaultSize={25}>
        <PanelContent label="Header" />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={75}>
        <PanelContent label="Content" shade="background" />
      </ResizablePanel>
    </Resizable>
  );
}

function WithHandleDemo() {
  return (
    <Resizable direction="horizontal">
      <ResizablePanel defaultSize={25} minSize={15}>
        <PanelContent label="Sidebar" />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={75}>
        <PanelContent label="Content" shade="background" />
      </ResizablePanel>
    </Resizable>
  );
}

function NestedDemo() {
  return (
    <Resizable direction="horizontal">
      <ResizablePanel defaultSize={25} minSize={15}>
        <PanelContent label="Sidebar" />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={75}>
        <Resizable direction="vertical">
          <ResizablePanel defaultSize={60}>
            <PanelContent label="Main Content" shade="background" />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={40}>
            <PanelContent label="Footer" />
          </ResizablePanel>
        </Resizable>
      </ResizablePanel>
    </Resizable>
  );
}

function ThreePanelDemo() {
  return (
    <Resizable direction="horizontal">
      <ResizablePanel defaultSize={33}>
        <PanelContent label="One" />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={34}>
        <PanelContent label="Two" shade="background" />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={33}>
        <PanelContent label="Three" />
      </ResizablePanel>
    </Resizable>
  );
}

export const Default: Story = {
  name: "Resizable",
  render: () => (
    <Stack gap={8} ax="stretch" fullwidth>
      <Stack gap={2}>
        <Text size={1} weight="bold">
          Horizontal
        </Text>
        <Text size={0} shade="muted" mb={2}>
          Drag the divider left and right
        </Text>
        <HorizontalDemo />
      </Stack>

      <Stack gap={2}>
        <Text size={1} weight="bold">
          Vertical
        </Text>
        <Text size={0} shade="muted" mb={2}>
          Drag the divider up and down
        </Text>
        <VerticalDemo />
      </Stack>

      <Stack gap={2}>
        <Text size={1} weight="bold">
          With Handle
        </Text>
        <Text size={0} shade="muted" mb={2}>
          Visible grip indicator for better discoverability
        </Text>
        <WithHandleDemo />
      </Stack>

      <Stack gap={2}>
        <Text size={1} weight="bold">
          Nested Panels
        </Text>
        <Text size={0} shade="muted" mb={2}>
          Combine horizontal and vertical layouts
        </Text>
        <NestedDemo />
      </Stack>

      <Stack gap={2}>
        <Text size={1} weight="bold">
          Three Panels
        </Text>
        <Text size={0} shade="muted" mb={2}>
          Multiple panels in a single group
        </Text>
        <ThreePanelDemo />
      </Stack>
    </Stack>
  ),
};
