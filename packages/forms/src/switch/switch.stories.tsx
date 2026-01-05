import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/layout";

import { Switch } from "./switch";

const meta: Meta<typeof Switch> = {
  title: "Forms/Switch",
  component: Switch,
  tags: ["beta"],
  parameters: {
    actions: { argTypesRegex: "^on.*" },
  },
  args: {},
  argTypes: {},
  render: (args) => (
    <Stack gap={4}>
      <Switch {...args} />
      <Switch {...args} label="With label and description" />
      <Switch {...args} label="Default checked" defaultChecked />
      <Switch {...args} label="Disabled" disabled />
      <Switch {...args} label="Bordered" bordered />
      <Switch {...args} label="Reversed" bordered reversed />
      <Switch
        {...args}
        bordered
        label="Bordered with label and description"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      />
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Switch" };
