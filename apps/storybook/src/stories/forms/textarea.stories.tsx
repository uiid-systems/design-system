import { expect, userEvent, within } from "storybook/test";
import { fn } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Group } from "@uiid/layout";
import { Field, Textarea } from "@uiid/forms";

const meta: Meta<typeof Textarea> = {
  title: "Forms/Textarea",
  component: Textarea,
  tags: ["beta"],
  args: {
    disabled: false,
    required: false,
    placeholder: "Enter your message...",
    onFocus: fn(),
    onChange: fn(),
    onBlur: fn(),
  },
  argTypes: {
    onFocus: { table: { category: "Events" } },
    onChange: { table: { category: "Events" } },
    onBlur: { table: { category: "Events" } },

    size: {
      control: "select",
      options: ["small", "medium", "large"],
      table: { category: "Options" },
    },
    resize: {
      control: "select",
      options: ["none", "vertical", "horizontal", "both"],
      table: { category: "Options" },
    },
    rows: {
      control: "number",
      table: { category: "Options" },
    },

    disabled: { control: "boolean", table: { category: "Toggles" } },
    required: { control: "boolean", table: { category: "Toggles" } },
    fullwidth: { control: "boolean", table: { category: "Toggles" } },
    ghost: { control: "boolean", table: { category: "Toggles" } },

    placeholder: { control: "text", table: { category: "Text" } },
    label: { control: "text", table: { category: "Text" } },
    description: { control: "text", table: { category: "Text" } },

    FieldProps: { control: "object", table: { category: "Subcomponents" } },
  },
  render: (args) => (
    <Stack ax="stretch" gap={8}>
      <Textarea {...args} defaultValue="Default value" />
      <Textarea
        {...args}
        label="Textarea with label and description"
        description="Provide additional details about your request."
      />

      <Textarea {...args} label="Disabled" disabled />
      <Textarea {...args} label="Required" required />
      <Textarea {...args} placeholder="Ghost textarea" ghost />

      <Group fullwidth gap={4}>
        <Textarea {...args} label="Small" size="small" rows={2} />
        <Textarea {...args} label="Medium" size="medium" rows={3} />
        <Textarea {...args} label="Large" size="large" rows={4} />
      </Group>

      <Field
        label="Resize options"
        description="Different resize behaviors for textareas."
      >
        <Group fullwidth gap={4}>
          <Textarea {...args} placeholder="Resize: none" resize="none" />
          <Textarea
            {...args}
            placeholder="Resize: vertical"
            resize="vertical"
          />
          <Textarea {...args} placeholder="Resize: both" resize="both" />
        </Group>
      </Field>

      <Textarea
        {...args}
        data-testid="textarea"
        label="Interaction test"
        description="Check the Interactions panel for a report!"
      />
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Textarea",

  play: async ({ canvasElement }) => {
    const message =
      "Welcome to UIID's Storybook! This is a multiline textarea component.";
    const canvas = within(canvasElement.ownerDocument.body);
    const textarea = await canvas.findByTestId("textarea");
    await userEvent.type(textarea, message);
    await expect(textarea).toHaveValue(message);
  },
};
