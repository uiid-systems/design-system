import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/primitives";
import { Switch } from "./switch";

const meta: Meta<typeof Switch> = {
  title: "Components/Controls/Switch",
  component: Switch,
  args: {},
  argTypes: {},
  render: (args) => (
    <Stack gap={4}>
      <Switch {...args} />
      <Switch {...args} label="Switch with label" name="switch-with-label" />
      <Switch
        {...args}
        label="Switch with label before"
        name="switch-with-label-before"
        labelPosition="before"
      />
      <Switch
        {...args}
        label="Switch with label disabled"
        name="switch-with-label-disabled"
        disabled
      />
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Switch" };
