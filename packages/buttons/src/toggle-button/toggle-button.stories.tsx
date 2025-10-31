import type { Meta, StoryObj } from "@storybook/react-vite";

import { Heart, Sun, Moon } from "@uiid/icons";
import { Stack, Group } from "@uiid/layout";

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
        <Group gap={2} ay="center">
          <ToggleButton
            {...args}
            icon={<Heart />}
            pressedIcon={<Heart fill="red" />}
          />
          <ToggleButton
            {...args}
            icon={<Heart />}
            pressedIcon={<Heart fill="red" />}
          >
            Favorite
          </ToggleButton>
          <ToggleButton
            {...args}
            pressedText="Favorited"
            iconPosition="after"
            icon={<Heart />}
            pressedIcon={<Heart fill="red" />}
          >
            Favorite
          </ToggleButton>
        </Group>

        <Group gap={2} ay="center">
          <ToggleButton
            {...args}
            variant="subtle"
            icon={<Sun />}
            pressedIcon={<Moon />}
          />
          <ToggleButton
            {...args}
            variant="subtle"
            icon={<Sun />}
            pressedIcon={<Moon />}
          >
            Toggle theme
          </ToggleButton>
          <ToggleButton
            {...args}
            variant="subtle"
            icon={<Sun />}
            pressedIcon={<Moon />}
            pressedText="Dark Mode"
            iconPosition="after"
          >
            Light Mode
          </ToggleButton>
        </Group>
      </Stack>
    );
  },
};
