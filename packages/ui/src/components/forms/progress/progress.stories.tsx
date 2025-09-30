import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/primitives";

import { Progress } from "./progress";

const meta = {
  title: "Components/Forms/Progress",
  component: Progress,
  args: {
    value: 50,
  },
  render: (args) => (
    <Stack ax="stretch" style={{ gap: 16 }}>
      <Progress {...args} />

      <Progress
        {...args}
        label="Progress with label and description"
        description="This is a basic description"
        name="label"
        value={68}
        required
      />
    </Stack>
  ),
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Progress" };
