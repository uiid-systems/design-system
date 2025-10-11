import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/primitives";
import { RadioGroup } from "./radio-group";

const MOCK_OPTIONS = [
  { value: "1", label: "Option 1" },
  { value: "2", label: "Option 2" },
  { value: "3", label: "Option 3", disabled: true },
];

const meta = {
  title: "Forms/RadioGroup",
  component: RadioGroup,
  args: {
    required: true,
    options: MOCK_OPTIONS,
    name: "radio-group",
  },
  render: (args) => (
    <Stack gap={8}>
      <RadioGroup {...args} name="radio-group" />

      <RadioGroup
        {...args}
        name="radio-group-horizontal"
        direction="horizontal"
      />

      <RadioGroup
        {...args}
        label="RadioGroup with label and description"
        description="This is a basic description"
        name="with-label-and-description"
      />

      <RadioGroup
        {...args}
        label="Horizontal RadioGroup"
        description="Optionally render radio buttons horizontally"
        name="with-label-and-description-horizontal"
        direction="horizontal"
      />
    </Stack>
  ),
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "RadioGroup" };
