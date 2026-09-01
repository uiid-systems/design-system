import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "@uiid/design-system";

import * as Examples from "../../../../packages/forms/src/textarea/textarea.examples";

const meta = {
  title: "Forms/Textarea",
  component: Textarea,
  parameters: {
    actions: { argTypesRegex: "^on.*" },
  },
  args: {
    label: "Release notes",
    description: "Markdown is supported.",
    placeholder: "What changed?",
  },
  argTypes: {
    label: { control: "text", table: { category: "Text" } },
    description: { control: "text", table: { category: "Text" } },
    placeholder: { control: "text", table: { category: "Text" } },

    size: {
      control: "select",
      options: ["xsmall", "small", "medium", "large"],
      table: { category: "Variants" },
    },
    variant: {
      control: "select",
      options: ["ghost"],
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
    resize: {
      control: "select",
      options: ["none", "vertical", "horizontal", "both"],
      table: { category: "Variants" },
    },

    rows: { control: "number", table: { category: "Options" } },

    fullwidth: { control: "boolean", table: { category: "Toggles" } },
    required: { control: "boolean", table: { category: "Toggles" } },
    disabled: { control: "boolean", table: { category: "Toggles" } },
    readOnly: { control: "boolean", table: { category: "Toggles" } },

    onValueChange: { table: { category: "Events" } },
    onFocus: { table: { category: "Events" } },
    onBlur: { table: { category: "Events" } },

    FieldProps: { control: "object", table: { category: "Subcomponents" } },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { render: (args) => <Textarea {...args} /> };

export const WithLabel: Story = { render: () => <Examples.WithLabel /> };
export const Sizes: Story = { render: () => <Examples.Sizes /> };
export const Colors: Story = { render: () => <Examples.Colors /> };
export const Rows: Story = { render: () => <Examples.Rows /> };
export const Resize: Story = { render: () => <Examples.Resize /> };
export const Ghost: Story = { render: () => <Examples.Ghost /> };
export const Fullwidth: Story = { render: () => <Examples.Fullwidth /> };
export const Required: Story = { render: () => <Examples.Required /> };
export const Disabled: Story = { render: () => <Examples.Disabled /> };
export const Invalid: Story = { render: () => <Examples.Invalid /> };
export const ErrorTypes: Story = { render: () => <Examples.ErrorTypes /> };
export const Controlled: Story = { render: () => <Examples.Controlled /> };
export const Uncontrolled: Story = { render: () => <Examples.Uncontrolled /> };
