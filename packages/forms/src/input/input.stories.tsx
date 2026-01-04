import { expect, userEvent, within } from "storybook/test";
import { fn } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Group } from "@uiid/layout";

import { Field } from "../field/field";

import { Input } from "./input";

const meta: Meta<typeof Input> = {
  title: "Forms/Input",
  component: Input,
  tags: ["beta"],
  args: {
    disabled: false,
    required: false,
    placeholder: "Placeholder",
    onFocus: fn(),
    onValueChange: fn(),
    onBlur: fn(),
  },
  argTypes: {
    /** Events */
    onFocus: { table: { category: "Events" } },
    onValueChange: { table: { category: "Events" } },
    onBlur: { table: { category: "Events" } },
    /** Variants */
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      table: { category: "Variants" },
    },
    /** Toggles */
    disabled: { control: "boolean", table: { category: "Toggles" } },
    required: { control: "boolean", table: { category: "Toggles" } },
    ghost: { control: "boolean", table: { category: "Toggles" } },
    /** Text */
    placeholder: { control: "text", table: { category: "Text" } },
    /** Subcomponents */
    FieldProps: { control: "object", table: { category: "Subcomponents" } },
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
        required={args.required}
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
};

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
