import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/layout";

import { ToggleButton } from "./toggle-button";

const meta = {
  title: "Buttons/Toggle Button",
  component: ToggleButton,
  args: {},
  argTypes: {
    disabled: { control: "boolean" },
    onClick: { action: "onClick" },
  },
} satisfies Meta<typeof ToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Toggle Button",
  render: (args) => {
    return (
      <Stack gap={4}>
        <ToggleButton {...args} />
        <ToggleButton {...args}>Favorite</ToggleButton>
        <ToggleButton {...args} pressedText="Favorited" iconPosition="after">
          Favorite
        </ToggleButton>
      </Stack>
    );
  },
};
