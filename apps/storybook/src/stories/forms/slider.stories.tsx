import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/layout";
import { Slider } from "@uiid/forms";

const meta: Meta<typeof Slider> = {
  title: "Forms/Slider",
  component: Slider,
  tags: ["beta"],
  parameters: {
    actions: { argTypesRegex: "^on.*" },
  },
  args: {},
  argTypes: {
    ghost: { control: "boolean", table: { category: "Toggles" } },
    disabled: { control: "boolean", table: { category: "Toggles" } },

    step: { control: "number", table: { category: "Options" } },
    largeStep: { control: "number", table: { category: "Options" } },
    min: { control: "number", table: { category: "Options" } },
    max: { control: "number", table: { category: "Options" } },
    locale: { control: "text", table: { category: "Options" } },
    format: { control: "object", table: { category: "Options" } },
    thumbAlignment: {
      control: "select",
      options: ["start", "center", "end"],
      table: { category: "Options" },
    },
    thumbCollisionBehavior: {
      control: "select",
      options: ["push", "swap", "none"],
      table: { category: "Options" },
    },
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      table: { category: "Options" },
    },

    RootProps: { control: "object", table: { category: "Subcomponents" } },
    ValueProps: { control: "object", table: { category: "Subcomponents" } },
    ControlProps: { control: "object", table: { category: "Subcomponents" } },
    TrackProps: { control: "object", table: { category: "Subcomponents" } },
    IndicatorProps: { control: "object", table: { category: "Subcomponents" } },
    ThumbProps: { control: "object", table: { category: "Subcomponents" } },
    FieldProps: { control: "object", table: { category: "Subcomponents" } },
  },
  render: (args) => (
    <Stack gap={4}>
      <Slider {...args} />
      <Slider
        {...args}
        label="Slider with label and description"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      />
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Slider" };
