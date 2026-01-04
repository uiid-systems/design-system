import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/layout";

import { Radio } from "./radio";

const meta: Meta<typeof Radio> = {
  title: "Forms/Radio",
  component: Radio,
  parameters: {
    actions: { argTypesRegex: "^on.*" },
  },
  tags: ["beta"],
  args: {},
  argTypes: {
    label: { control: "text", table: { category: "Text" } },
    description: { control: "text", table: { category: "Text" } },

    size: {
      control: "select",
      options: ["small", "medium", "large"],
      table: { category: "Variants" },
    },

    bordered: { control: "boolean", table: { category: "Toggles" } },
    reversed: { control: "boolean", table: { category: "Toggles" } },
    required: { control: "boolean", table: { category: "Toggles" } },
    disabled: { control: "boolean", table: { category: "Toggles" } },
    readOnly: { control: "boolean", table: { category: "Toggles" } },
    hideIndicator: { control: "boolean", table: { category: "Toggles" } },
    nativeButton: { control: "boolean", table: { category: "Toggles" } },

    ContainerProps: { control: "object", table: { category: "Subcomponents" } },
    IndicatorProps: { control: "object", table: { category: "Subcomponents" } },
  },
  render: (args) => (
    <Stack gap={4}>
      <Radio {...args} />
      <Radio {...args} label="With label" />
      <Radio {...args} label="Bordered" bordered />
      <Radio {...args} label="Reversed" bordered reversed />
      <Radio {...args} label="Hidden indicator" bordered hideIndicator />
      <Radio
        {...args}
        bordered
        label="Bordered with label and description"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      />
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Radio" };
