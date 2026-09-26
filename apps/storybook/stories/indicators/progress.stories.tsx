import type { Meta, StoryObj } from "@storybook/react-vite";
import { PALETTE_HUES, Progress } from "@uiid/design-system";

import * as Examples from "../../../../packages/indicators/src/progress/progress.examples";

const meta = {
  title: "Indicators/Progress",
  component: Progress,
  args: {
    value: 45,
    label: "Uploading files",
  },
  argTypes: {
    label: { control: "text", table: { category: "Text" } },

    size: {
      control: "select",
      options: ["xsmall", "small", "medium", "large"],
      table: { category: "Variants" },
    },
    color: {
      control: "select",
      options: PALETTE_HUES,
      table: { category: "Variants" },
    },

    value: {
      control: { type: "range", min: 0, max: 100 },
      table: { category: "Data" },
    },
    format: { control: "object", table: { category: "Data" } },
    locale: { control: "text", table: { category: "Data" } },

    min: { control: "number", table: { category: "Options" } },
    max: { control: "number", table: { category: "Options" } },

    hideValue: { control: "boolean", table: { category: "Toggles" } },

    getAriaValueText: { table: { category: "Accessibility" } },

    RootProps: { control: "object", table: { category: "Subcomponents" } },
    HeaderProps: { control: "object", table: { category: "Subcomponents" } },
    LabelProps: { control: "object", table: { category: "Subcomponents" } },
    ValueProps: { control: "object", table: { category: "Subcomponents" } },
    TrackProps: { control: "object", table: { category: "Subcomponents" } },
    IndicatorProps: { control: "object", table: { category: "Subcomponents" } },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { render: (args) => <Progress {...args} /> };

export const Sizes: Story = { render: () => <Examples.Sizes /> };
export const Colors: Story = { render: () => <Examples.Colors /> };
export const Indeterminate: Story = {
  render: () => <Examples.Indeterminate />,
};
export const HideValue: Story = { render: () => <Examples.HideValue /> };
export const MinMax: Story = { render: () => <Examples.MinMax /> };
export const Format: Story = { render: () => <Examples.Format /> };
export const CustomValue: Story = { render: () => <Examples.CustomValue /> };
export const Live: Story = { render: () => <Examples.Live /> };
export const Composed: Story = { render: () => <Examples.Composed /> };
