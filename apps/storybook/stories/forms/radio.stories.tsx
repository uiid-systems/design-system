import type { Meta, StoryObj } from "@storybook/react-vite";
import { Radio, RadioGroupRoot } from "@uiid/design-system";

import * as Examples from "../../../../packages/forms/src/radio/radio.examples";

const meta = {
  title: "Forms/Radio",
  component: Radio,
  parameters: {
    actions: { argTypesRegex: "^on.*" },
  },
  args: {
    value: "monthly",
    label: "Monthly",
  },
  argTypes: {
    label: { control: "text", table: { category: "Text" } },
    description: { control: "text", table: { category: "Text" } },

    size: {
      control: "select",
      options: ["xsmall", "small", "medium", "large"],
      table: { category: "Variants" },
    },
    color: {
      control: "select",
      options: [
        "red",
        "orange",
        "yellow",
        "green",
        "blue",
        "indigo",
        "purple",
        "neutral",
      ],
      table: { category: "Variants" },
    },

    value: { control: "text", table: { category: "Data" } },

    bordered: { control: "boolean", table: { category: "Toggles" } },
    reversed: { control: "boolean", table: { category: "Toggles" } },
    hideIndicator: { control: "boolean", table: { category: "Toggles" } },
    required: { control: "boolean", table: { category: "Toggles" } },
    disabled: { control: "boolean", table: { category: "Toggles" } },
    readOnly: { control: "boolean", table: { category: "Toggles" } },

    FieldProps: { control: "object", table: { category: "Subcomponents" } },
    IndicatorProps: { control: "object", table: { category: "Subcomponents" } },
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

/*
 * A radio only means something next to its siblings, so the playground sits in
 * a `RadioGroupRoot` — the controls drive the first radio.
 */
export const Playground: Story = {
  render: (args) => (
    <RadioGroupRoot defaultValue="monthly">
      <Radio {...args} />
      <Radio value="yearly" label="Yearly" />
    </RadioGroupRoot>
  ),
};

export const WithDescription: Story = {
  render: () => <Examples.WithDescription />,
};
export const Sizes: Story = { render: () => <Examples.Sizes /> };
export const Colors: Story = { render: () => <Examples.Colors /> };
export const Bordered: Story = { render: () => <Examples.Bordered /> };
export const HideIndicator: Story = {
  render: () => <Examples.HideIndicator />,
};
export const Disabled: Story = { render: () => <Examples.Disabled /> };
export const Unselected: Story = { render: () => <Examples.Unselected /> };
