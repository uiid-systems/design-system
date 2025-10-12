import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/primitives";
import { Collapsible } from "./collapsible";

const meta: Meta<typeof Collapsible> = {
  title: "Components/Interactive/Collapsible",
  component: Collapsible,
  args: {
    trigger: "This is a collapsible trigger",
    children: "This is a collapsible content area",
  },
  argTypes: {},
  render: (args) => (
    <Stack gap={4}>
      <Collapsible {...args} />
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Collapsible" };
