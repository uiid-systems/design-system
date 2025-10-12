import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/primitives";
import { Tabs } from "./tabs";

const meta: Meta<typeof Tabs> = {
  title: "Components/Interactive/Tabs",
  component: Tabs,
  args: {
    children: "This is a modal",
    items: [
      { label: "Tab 1", value: "tab-1" },
      { label: "Tab 2", value: "tab-2" },
      { label: "Tab 3", value: "tab-3" },
    ],
  },
  argTypes: {},
  render: (args) => (
    <Stack gap={4}>
      <Tabs {...args}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam ipsa
        hic, accusamus dolor cum minima pariatur provident vero blanditiis vel!
        Assumenda ipsum officia autem!
      </Tabs>
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Tabs" };
