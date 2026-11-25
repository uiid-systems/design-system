import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Accordion } from "@uiid/design-system";

import * as Examples from "../../../../packages/navigation/src/accordion/accordion.examples";
import { MOCK_ITEMS } from "./accordion.mocks";

const meta: Meta<typeof Accordion> = {
  title: "Navigation/Accordion",
  component: Accordion,
  tags: ["beta"],
  args: {
    items: MOCK_ITEMS,
  },
  argTypes: {
    disabled: { control: "boolean", table: { category: "Toggles" } },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      table: { category: "Options" },
    },
    variant: {
      control: "select",
      options: ["ghost"],
      table: { category: "Variants" },
    },
    orientation: {
      control: "select",
      options: ["vertical", "horizontal"],
      table: { category: "Options" },
    },
  },
  decorators: [
    (Story) => (
      <Stack w="full" maxw={640}>
        <Story />
      </Stack>
    ),
  ],
  render: (args) => (
    <Stack gap={4} w="full">
      <Accordion {...args} />
      <Accordion {...args} defaultValue={["item-1"]} multiple />
      <Accordion {...args} disabled />
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Accordion" };

export const Basic: Story = { render: () => <Examples.Default /> };

export const Multiple: Story = { render: () => <Examples.Multiple /> };

export const Controlled: Story = { render: () => <Examples.Controlled /> };

export const Icons: Story = { render: () => <Examples.Icons /> };

export const Sizes: Story = { render: () => <Examples.Sizes /> };

export const Ghost: Story = { render: () => <Examples.Ghost /> };

export const Disabled: Story = { render: () => <Examples.Disabled /> };

export const Spaced: Story = { render: () => <Examples.Spaced /> };

export const Composed: Story = { render: () => <Examples.Composed /> };
