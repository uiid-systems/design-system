import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/layout";
import { NumberField } from "@uiid/forms";

const meta: Meta<typeof NumberField> = {
  title: "Forms/Number Field",
  component: NumberField,
  tags: ["beta"],
  parameters: {
    actions: { argTypesRegex: "^on.*" },
  },
  args: {},
  argTypes: {
    defaultValue: { control: "number", table: { category: "Data" } },
    value: { control: "number", table: { category: "Data" } },
    locale: { control: "text", table: { category: "Data" } },
    format: { control: "object", table: { category: "Data" } },

    min: { control: "number", table: { category: "Options" } },
    max: { control: "number", table: { category: "Options" } },
    step: { control: "number", table: { category: "Options" } },
    smallStep: { control: "number", table: { category: "Options" } },
    largeStep: { control: "number", table: { category: "Options" } },

    label: { control: "text", table: { category: "Text" } },
    description: { control: "text", table: { category: "Text" } },

    disabled: { control: "boolean", table: { category: "Toggles" } },
    required: { control: "boolean", table: { category: "Toggles" } },
    snapOnStep: { control: "boolean", table: { category: "Toggles" } },
    allowWheelScrub: { control: "boolean", table: { category: "Toggles" } },

    onFocus: { table: { category: "Events" } },
    onValueChange: { table: { category: "Events" } },
    onValueCommitted: { table: { category: "Events" } },
    onBlur: { table: { category: "Events" } },

    RootProps: {
      description: "Props for the root element",
      table: { category: "Subcomponents" },
    },
    DecrementProps: { table: { category: "Subcomponents" } },
    IncrementProps: { table: { category: "Subcomponents" } },
    FieldProps: { table: { category: "Subcomponents" } },
    InputProps: { table: { category: "Subcomponents" } },
  },
  render: (args) => (
    <Stack ax="stretch" gap={8}>
      <NumberField {...args} />
      <NumberField
        {...args}
        label="Number Field with label and description"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      />
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Number Field" };
