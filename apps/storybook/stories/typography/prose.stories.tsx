import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prose } from "@uiid/design-system";
import * as Examples from "../../../../packages/typography/src/prose/prose.examples";

const meta = {
  title: "Typography/Prose",
  component: Prose,
  argTypes: {
    render: { table: { disable: true } },
    ref: { table: { disable: true } },
    style: { table: { disable: true } },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Prose>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => <Examples.Markdown />,
};

export const Markdown: Story = {
  render: () => <Examples.Markdown />,
};

export const Headings: Story = {
  render: () => <Examples.Headings />,
};

export const Article: Story = {
  render: () => <Examples.Article />,
};
