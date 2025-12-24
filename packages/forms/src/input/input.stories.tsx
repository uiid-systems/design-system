import { expect, userEvent, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Group } from "@uiid/layout";

import { Field } from "../field/field";

import { Input } from "./input";

const meta = {
  title: "Forms/Input",
  component: Input,
  args: {
    disabled: false,
    required: false,
    placeholder: "Placeholder",
  },
  argTypes: {
    onFocus: { action: "onFocus" },
    onValueChange: { action: "onValueChange" },
    onBlur: { action: "onBlur" },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
  render: (args) => (
    <Stack ax="stretch" gap={8}>
      <Input {...args} defaultValue="Default value" />
      <Input
        {...args}
        label="Input with label and description"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      />

      <Field
        label="Group of inputs with field wrapper"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      >
        <Group fullwidth evenly gap={2}>
          <Input {...args} placeholder="First name" />
          <Input {...args} placeholder="Last name" />
        </Group>
      </Field>

      <Input
        {...args}
        data-testid="input"
        label="Interaction test"
        description="Check the Interactions panel for a report!"
      />
    </Stack>
  ),
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Input",

  play: async ({ canvasElement }) => {
    const message = "Welcome to UIID's Storybook!";
    const canvas = within(canvasElement.ownerDocument.body);
    const input = await canvas.findByTestId("input");
    await userEvent.type(input, message);
    await expect(input).toHaveValue(message);
  },
};
