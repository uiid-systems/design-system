import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/primitives";
import { Textarea } from "./textarea";

const meta = {
  title: "Components/Forms/Textarea",
  component: Textarea,
  args: {
    required: true,
    name: "textarea",
  },
  render: (args) => (
    <Stack gap={8} ax="stretch">
      <Textarea {...args} name="textarea" />

      <Textarea
        {...args}
        label="Textarea with label and description"
        description="This is a basic description"
        name="with-label-and-description"
      />

      <Textarea
        {...args}
        label="Textarea with bookends"
        description="They're vertical instead of horizontal"
        before="B"
        after="A"
        name="with-label-and-description-horizontal"
      />
    </Stack>
  ),
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Textarea" };
