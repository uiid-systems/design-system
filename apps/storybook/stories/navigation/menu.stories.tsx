import type { Meta, StoryObj } from "@storybook/react-vite";
import { Group, Menu, Select } from "@uiid/design-system";

import * as Examples from "../../../../packages/navigation/src/menu/menu.examples";

const meta: Meta<typeof Menu> = {
  title: "Navigation/Menu",
  component: Menu,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <Examples.Default /> };

export const Icons: Story = { render: () => <Examples.Icons /> };

export const Submenu: Story = { render: () => <Examples.Submenu /> };

export const NestedSubmenus: Story = {
  render: () => <Examples.NestedSubmenus />,
};

export const Actions: Story = { render: () => <Examples.Actions /> };

export const Controlled: Story = { render: () => <Examples.Controlled /> };

export const Placement: Story = { render: () => <Examples.Placement /> };

export const WithoutBackdrop: Story = {
  render: () => <Examples.WithoutBackdrop />,
};

export const NonModal: Story = { render: () => <Examples.NonModal /> };

export const IconTrigger: Story = { render: () => <Examples.IconTrigger /> };

export const FunctionTrigger: Story = {
  render: () => <Examples.FunctionTrigger />,
};

export const ItemDescriptions: Story = {
  render: () => <Examples.ItemDescriptions />,
};

export const Links: Story = { render: () => <Examples.Links /> };

export const Separators: Story = { render: () => <Examples.Separators /> };

export const Disabled: Story = { render: () => <Examples.Disabled /> };

export const LongLabels: Story = { render: () => <Examples.LongLabels /> };

export const Composed: Story = { render: () => <Examples.Composed /> };

export const Descriptions: Story = { render: () => <Examples.Descriptions /> };

export const Groups: Story = { render: () => <Examples.Groups /> };

export const ViewToggles: Story = { render: () => <Examples.ViewToggles /> };

export const SortPicker: Story = { render: () => <Examples.SortPicker /> };

export const ViewOptions: Story = { render: () => <Examples.ViewOptions /> };

/*
 * Open each in turn to compare: the popups and rows should read as one kind.
 * The Select is drawn here because `@uiid/navigation` does not depend on
 * `@uiid/forms`, so the examples file cannot import it.
 */
export const BesideSelect: Story = {
  render: () => (
    <Group gap={4} ay="start">
      <Examples.Icons />
      <Select
        aria-label="Action"
        placeholder="Choose an action"
        items={[
          { label: "Edit", value: "edit" },
          { label: "Duplicate", value: "duplicate" },
          { label: "Delete", value: "delete", disabled: true },
        ]}
      />
    </Group>
  ),
};
