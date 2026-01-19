import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/layout";
import { RadioGroup, type RadioGroupProps, type FormItemProps } from "@uiid/forms";

const MOCK_RADIOGROUP_OPTIONS: FormItemProps[] = [
  { value: "1", label: "Option 1" },
  { value: "2", label: "Option 2" },
  { value: "3", label: "Option 3", disabled: true },
];

const meta: Meta<RadioGroupProps> = {
  title: "Forms/Radio Group",
  component: RadioGroup,
  tags: ["beta"],
  parameters: {
    actions: { argTypesRegex: "^on.*" },
  },
  args: {
    items: MOCK_RADIOGROUP_OPTIONS,
  },
  argTypes: {
    items: { control: "object", table: { category: "Data" } },
    defaultValue: { control: "object", table: { category: "Data" } },
    value: { control: "object", table: { category: "Data" } },

    onValueChange: { table: { category: "Events" } },

    direction: {
      control: "select",
      options: ["horizontal", "vertical"],
      table: { category: "Options" },
    },

    bordered: { control: "boolean", table: { category: "Toggles" } },
    reversed: { control: "boolean", table: { category: "Toggles" } },
    hideIndicators: { control: "boolean", table: { category: "Toggles" } },
    required: { control: "boolean", table: { category: "Toggles" } },
    disabled: { control: "boolean", table: { category: "Toggles" } },

    RadioProps: { control: "object", table: { category: "Subcomponents" } },
    IndicatorProps: { control: "object", table: { category: "Subcomponents" } },
  },
  render: (args) => (
    <Stack gap={8}>
      <RadioGroup {...args} />
      <RadioGroup {...args} direction="horizontal" />
      <RadioGroup {...args} bordered />
      <RadioGroup {...args} bordered direction="horizontal" />
      <RadioGroup
        {...args}
        bordered
        direction="horizontal"
        label="With label and description"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      />
      <RadioGroup
        {...args}
        bordered
        direction="horizontal"
        label="Without indicators"
        hideIndicators
      />
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Radio Group" };
