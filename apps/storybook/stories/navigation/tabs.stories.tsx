import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Tabs } from "@uiid/design-system";

import * as Examples from "../../../../packages/navigation/src/tabs/tabs.examples";
import { MOCK_TABS } from "./tabs.mocks";

const meta: Meta<typeof Tabs> = {
  title: "Navigation/Tabs",
  component: Tabs,
  tags: ["new"],
  args: {
    items: MOCK_TABS,
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["xsmall", "small", "medium", "large"],
    },
    variant: {
      control: "select",
      options: ["ghost"],
    },
  },
  render: (args) => (
    <Stack w="full" gap={4}>
      <Tabs {...args} />
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Tabs" };

export const Basic: Story = { render: () => <Examples.Default /> };

export const DefaultValue: Story = { render: () => <Examples.DefaultValue /> };

export const Controlled: Story = { render: () => <Examples.Controlled /> };

export const Sizes: Story = { render: () => <Examples.Sizes /> };

export const Ghost: Story = { render: () => <Examples.Ghost /> };

export const FullWidth: Story = { render: () => <Examples.FullWidth /> };

export const KeepMounted: Story = { render: () => <Examples.KeepMounted /> };

export const Composed: Story = { render: () => <Examples.Composed /> };
