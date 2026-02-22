import type { Meta, StoryObj } from "@storybook/react-vite";

import { Heart, Sun, Moon } from "@uiid/icons";
import { Stack, Group } from "@uiid/layout";

import { ToggleButton } from "./toggle-button";

const meta = {
  title: "Buttons/Toggle Button",
  component: ToggleButton,
  tags: ["beta"],
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
            icon={{ pressed: <Heart fill="red" />, unpressed: <Heart /> }}
            shape="square"
          />
          <ToggleButton
            {...args}
            icon={{ pressed: <Heart fill="red" />, unpressed: <Heart /> }}
          >
            Favorite
          </ToggleButton>
          <ToggleButton
            {...args}
            icon={{ pressed: <Heart fill="red" />, unpressed: <Heart /> }}
            text={{ pressed: "Favorited", unpressed: "Favorite" }}
          />
        </Group>

        <Group gap={2} ay="center">
          <ToggleButton
            {...args}
            variant="subtle"
            icon={{
              pressed: <Sun stroke="gold" />,
              unpressed: <Moon stroke="aqua" />,
            }}
            shape="square"
          />
          <ToggleButton
            {...args}
            variant="subtle"
            icon={{
              pressed: <Sun stroke="gold" />,
              unpressed: <Moon stroke="aqua" />,
            }}
          >
            Toggle theme
          </ToggleButton>
          <ToggleButton
            {...args}
            variant="subtle"
            text={{ pressed: "Dark Mode", unpressed: "Light Mode" }}
            icon={{
              pressed: <Sun stroke="gold" />,
              unpressed: <Moon stroke="aqua" />,
            }}
          >
            Light Mode
          </ToggleButton>
        </Group>
      </Stack>
    );
  },
};
