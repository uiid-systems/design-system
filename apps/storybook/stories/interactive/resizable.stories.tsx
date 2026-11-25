import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Stack,
  Box,
  Text,
  Resizable,
  ResizablePanel,
  ResizableHandle,
} from "@uiid/design-system";

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
      w="full"
      h="full"
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
    <Resizable orientation="horizontal">
      <ResizablePanel defaultSize="50%">
        <PanelContent label="One" />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize="50%">
        <PanelContent label="Two" shade="background" />
      </ResizablePanel>
    </Resizable>
  );
}

function VerticalDemo() {
  return (
    <Resizable orientation="vertical">
      <ResizablePanel defaultSize="25%">
        <PanelContent label="Header" />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize="75%">
        <PanelContent label="Content" shade="background" />
      </ResizablePanel>
    </Resizable>
  );
}

function WithHandleDemo() {
  return (
    <Resizable orientation="horizontal">
      <ResizablePanel defaultSize="25%" minSize="15%">
        <PanelContent label="Sidebar" />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="75%">
        <PanelContent label="Content" shade="background" />
      </ResizablePanel>
    </Resizable>
  );
}

function NestedDemo() {
  return (
    <Resizable orientation="horizontal">
      <ResizablePanel defaultSize="25%" minSize="15%">
        <PanelContent label="Sidebar" />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="75%">
        <Resizable orientation="vertical">
          <ResizablePanel defaultSize="60%">
            <PanelContent label="Main Content" shade="background" />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize="40%">
            <PanelContent label="Footer" />
          </ResizablePanel>
        </Resizable>
      </ResizablePanel>
    </Resizable>
  );
}

function ThreePanelDemo() {
  return (
    <Resizable orientation="horizontal">
      <ResizablePanel defaultSize="33%">
        <PanelContent label="One" />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize="34%">
        <PanelContent label="Two" shade="background" />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize="33%">
        <PanelContent label="Three" />
      </ResizablePanel>
    </Resizable>
  );
}

function DisabledDemo() {
  return (
    <Resizable orientation="horizontal">
      <ResizablePanel defaultSize="33%">
        <PanelContent label="One" />
      </ResizablePanel>
      <ResizableHandle withHandle disabled />
      <ResizablePanel defaultSize="34%">
        <PanelContent label="Two" shade="background" />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="33%">
        <PanelContent label="Three" />
      </ResizablePanel>
    </Resizable>
  );
}

export const Default: Story = {
  name: "Resizable",
  render: () => (
    <Stack gap={8} w="full">
      <Stack gap={2}>
        <Text size={1} weight="bold">
          Horizontal
        </Text>
        <Text size={0} emphasis="muted" mb={2}>
          Drag the divider left and right
        </Text>
        <HorizontalDemo />
      </Stack>

      <Stack gap={2}>
        <Text size={1} weight="bold">
          Vertical
        </Text>
        <Text size={0} emphasis="muted" mb={2}>
          Drag the divider up and down
        </Text>
        <VerticalDemo />
      </Stack>

      <Stack gap={2}>
        <Text size={1} weight="bold">
          With Handle
        </Text>
        <Text size={0} emphasis="muted" mb={2}>
          Visible grip indicator for better discoverability
        </Text>
        <WithHandleDemo />
      </Stack>

      <Stack gap={2}>
        <Text size={1} weight="bold">
          Nested Panels
        </Text>
        <Text size={0} emphasis="muted" mb={2}>
          Combine horizontal and vertical layouts
        </Text>
        <NestedDemo />
      </Stack>

      <Stack gap={2}>
        <Text size={1} weight="bold">
          Three Panels
        </Text>
        <Text size={0} emphasis="muted" mb={2}>
          Multiple panels in a single group
        </Text>
        <ThreePanelDemo />
      </Stack>
    </Stack>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Stack gap={2} w="full">
      <Text size={1} weight="bold">
        Disabled handle
      </Text>
      <Text size={0} emphasis="muted" mb={2}>
        The first handle is disabled: it cannot be dragged and Tab skips it. The
        second handle still resizes with the pointer and the arrow keys.
      </Text>
      <DisabledDemo />
    </Stack>
  ),
};
