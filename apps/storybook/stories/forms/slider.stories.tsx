import type { Meta, StoryObj } from "@storybook/react-vite";
import { Slider } from "@uiid/design-system";

import * as Examples from "../../../../packages/forms/src/slider/slider.examples";

const meta = {
  title: "Forms/Slider",
  component: Slider,
  parameters: {
    actions: { argTypesRegex: "^on.*" },
  },
  args: {
    label: "Volume",
    description: "Applies to every output device.",
    defaultValue: 40,
  },
  argTypes: {
    label: { control: "text", table: { category: "Text" } },
    description: { control: "text", table: { category: "Text" } },

    size: {
      control: "select",
      options: ["small", "medium", "large"],
      table: { category: "Variants" },
    },
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      table: { category: "Variants" },
    },

    value: { control: "object", table: { category: "Data" } },
    defaultValue: { control: "object", table: { category: "Data" } },
    format: { control: "object", table: { category: "Data" } },
    locale: { control: "text", table: { category: "Data" } },

    min: { control: "number", table: { category: "Options" } },
    max: { control: "number", table: { category: "Options" } },
    step: { control: "number", table: { category: "Options" } },
    largeStep: { control: "number", table: { category: "Options" } },
    minStepsBetweenValues: {
      control: "number",
      table: { category: "Options" },
    },
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

    ghost: { control: "boolean", table: { category: "Toggles" } },
    fullwidth: { control: "boolean", table: { category: "Toggles" } },
    disabled: { control: "boolean", table: { category: "Toggles" } },

    onValueChange: { table: { category: "Events" } },
    onValueCommitted: { table: { category: "Events" } },

    RootProps: { control: "object", table: { category: "Subcomponents" } },
    ValueProps: { control: "object", table: { category: "Subcomponents" } },
    ControlProps: { control: "object", table: { category: "Subcomponents" } },
    TrackProps: { control: "object", table: { category: "Subcomponents" } },
    IndicatorProps: { control: "object", table: { category: "Subcomponents" } },
    ThumbProps: { control: "object", table: { category: "Subcomponents" } },
    FieldProps: { control: "object", table: { category: "Subcomponents" } },
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { render: (args) => <Slider {...args} /> };

export const WithLabel: Story = { render: () => <Examples.WithLabel /> };
export const Sizes: Story = { render: () => <Examples.Sizes /> };
export const Range: Story = { render: () => <Examples.Range /> };
export const MinMaxStep: Story = { render: () => <Examples.MinMaxStep /> };
export const Format: Story = { render: () => <Examples.Format /> };
export const CustomValue: Story = { render: () => <Examples.CustomValue /> };
export const Vertical: Story = { render: () => <Examples.Vertical /> };
export const Ghost: Story = { render: () => <Examples.Ghost /> };
export const Disabled: Story = { render: () => <Examples.Disabled /> };
export const Invalid: Story = { render: () => <Examples.Invalid /> };
export const Controlled: Story = { render: () => <Examples.Controlled /> };
export const Uncontrolled: Story = { render: () => <Examples.Uncontrolled /> };
