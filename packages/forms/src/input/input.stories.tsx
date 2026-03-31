import { expect, userEvent, within } from "storybook/test";
import { fn } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Group } from "@uiid/layout";
import { SearchIcon, MailIcon, EyeIcon, LockIcon } from "@uiid/icons";

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
    onFocus: { table: { category: "Events" } },
    onValueChange: { table: { category: "Events" } },
    onBlur: { table: { category: "Events" } },

    size: {
      control: "select",
      options: ["small", "medium", "large"],
      table: { category: "Options" },
    },

    disabled: { control: "boolean", table: { category: "Toggles" } },
    required: { control: "boolean", table: { category: "Toggles" } },
    ghost: { control: "boolean", table: { category: "Toggles" } },

    placeholder: { control: "text", table: { category: "Text" } },

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

      <Input {...args} label="Disabled" disabled />
      <Input {...args} label="Required" required />
      <Input {...args} placeholder="Ghost input" ghost />

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

export const BeforeAfterSlots: Story = {
  name: "Before & After Slots",
  render: (args) => (
    <Stack ax="stretch" gap={8}>
      <Input {...args} before={<SearchIcon />} placeholder="Search..." label="Before slot" />
      <Input {...args} after={<MailIcon />} placeholder="Email" label="After slot" />
      <Input
        {...args}
        before={<LockIcon />}
        after={<EyeIcon />}
        placeholder="Password"
        label="Both slots"
      />
      <Input {...args} before={<span>$</span>} after={<span>.00</span>} placeholder="0" label="Text slots" />

      <Group fullwidth gap={4}>
        <Input {...args} before={<SearchIcon />} placeholder="Small" size="small" />
        <Input {...args} before={<SearchIcon />} placeholder="Medium" size="medium" />
        <Input {...args} before={<SearchIcon />} placeholder="Large" size="large" />
      </Group>

      <Input {...args} before={<SearchIcon />} placeholder="Ghost with slot" ghost />
      <Input {...args} before={<SearchIcon />} placeholder="Full width" fullwidth />
      <Input {...args} before={<SearchIcon />} placeholder="Disabled" disabled />
    </Stack>
  ),
};
