import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/layout";
import { Sun, Moon, MonitorSmartphone } from "@uiid/icons";

import { ToggleGroup, Toggle } from "./toggle-group";

const meta: Meta<typeof ToggleGroup> = {
  title: "Interactive/Toggle Group",
  component: ToggleGroup,
  args: {
    size: "md",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Toggle Group",
  render: (args) => (
    <Stack gap={4}>
      <ToggleGroup {...args} defaultValue={["light"]}>
        <Toggle value="light" aria-label="Light mode">
          <Sun />
        </Toggle>
        <Toggle value="dark" aria-label="Dark mode">
          <Moon />
        </Toggle>
        <Toggle value="system" aria-label="System theme">
          <MonitorSmartphone />
        </Toggle>
      </ToggleGroup>
      <ToggleGroup {...args} defaultValue={["light"]} orientation="vertical">
        <Toggle value="light" aria-label="Light mode">
          <Sun />
        </Toggle>
        <Toggle value="dark" aria-label="Dark mode">
          <Moon />
        </Toggle>
        <Toggle value="system" aria-label="System theme">
          <MonitorSmartphone />
        </Toggle>
      </ToggleGroup>

      <ToggleGroup {...args} defaultValue={["monthly"]}>
        <Toggle value="monthly">Monthly</Toggle>
        <Toggle value="yearly">Yearly</Toggle>
      </ToggleGroup>

      <ToggleGroup {...args} defaultValue={["left"]}>
        <Toggle value="left">Left</Toggle>
        <Toggle value="center">Center</Toggle>
        <Toggle value="right">Right</Toggle>
      </ToggleGroup>

      <ToggleGroup {...args} defaultValue={["left"]} orientation="vertical">
        <Toggle value="left">Left</Toggle>
        <Toggle value="center">Center</Toggle>
        <Toggle value="right">Right</Toggle>
      </ToggleGroup>
    </Stack>
  ),
};
