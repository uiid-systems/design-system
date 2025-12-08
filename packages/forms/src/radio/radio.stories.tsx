import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/layout";

import { Radio } from "./radio";
import type { RadioProps } from "./radio.types";

const meta = {
  title: "Forms/Radio",
  component: Radio,
  args: {
    name: "radio",
    value: "default",
  },
  render: (args) => (
    <Stack gap={8}>
      <Radio {...args} />
      <Radio
        {...args}
        label="With label and description"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        ContainerProps={{ style: { maxWidth: "24rem" } }}
      />
      <Radio
        {...args}
        bordered
        label="With border"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        ContainerProps={{ style: { maxWidth: "24rem" } }}
      />
      <Radio
        {...args}
        bordered
        reversed
        label="Reversed"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        ContainerProps={{ style: { maxWidth: "24rem" } }}
      />
    </Stack>
  ),
} satisfies Meta<RadioProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Radio" };
