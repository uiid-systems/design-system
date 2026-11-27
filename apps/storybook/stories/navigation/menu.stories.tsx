import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Group, Menu, Select, Stack } from "@uiid/design-system";
import {
  MenuRoot,
  MenuPopup,
  MenuTrigger,
  MenuPortal,
  MenuBackdrop,
  MenuItem,
  SubmenuRoot,
  SubmenuTrigger,
  MenuPositioner,
} from "@uiid/design-system";

import * as Examples from "../../../../packages/navigation/src/menu/menu.examples";
import { MOCK_ITEMS } from "./menu.mocks";

const meta: Meta<typeof Menu> = {
  title: "Navigation/Menu",
  component: Menu,
  tags: ["beta"],
  args: {},
  argTypes: {
    backdrop: { control: "boolean", table: { category: "Toggles" } },
  },
  render: (args) => (
    <Stack gap={4} ax="start">
      <Menu
        {...args}
        trigger={<button>This is a simple menu</button>}
        items={MOCK_ITEMS}
      />

      <MenuRoot>
        <MenuTrigger>
          <button>This is a composed menu</button>
        </MenuTrigger>
        <MenuPortal>
          <MenuBackdrop />
          <MenuPositioner>
            <MenuPopup>
              <MenuItem label="Lorem" />
              <MenuItem label="Lorem ipsum dolor sit amet" />
              <SubmenuRoot>
                <SubmenuTrigger label="Lorem ipsum" />
                <MenuPortal>
                  <MenuPositioner>
                    <MenuPopup>
                      <MenuItem label="Item 3.1" />
                      <MenuItem label="Item 3.2" />
                      <MenuItem label="Item 3.3" />
                    </MenuPopup>
                  </MenuPositioner>
                </MenuPortal>
              </SubmenuRoot>
            </MenuPopup>
          </MenuPositioner>
        </MenuPortal>
      </MenuRoot>
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Menu" };

export const Basic: Story = { render: () => <Examples.Default /> };

export const Icons: Story = { render: () => <Examples.Icons /> };

export const Submenu: Story = { render: () => <Examples.Submenu /> };

export const Actions: Story = { render: () => <Examples.Actions /> };

export const Placement: Story = { render: () => <Examples.Placement /> };

export const WithoutBackdrop: Story = {
  render: () => <Examples.WithoutBackdrop />,
};

export const IconTrigger: Story = { render: () => <Examples.IconTrigger /> };

export const FunctionTrigger: Story = {
  render: () => <Examples.FunctionTrigger />,
};

export const Composed: Story = { render: () => <Examples.Composed /> };

export const Descriptions: Story = { render: () => <Examples.Descriptions /> };

export const ItemDescriptions: Story = {
  render: () => <Examples.ItemDescriptions />,
};

export const Links: Story = { render: () => <Examples.Links /> };

export const Separators: Story = { render: () => <Examples.Separators /> };

export const Disabled: Story = { render: () => <Examples.Disabled /> };

export const LongLabels: Story = { render: () => <Examples.LongLabels /> };

export const NestedSubmenus: Story = {
  render: () => <Examples.NestedSubmenus />,
};

/* Open each in turn to compare: the popups and rows should read as one kind. */
export const BesideSelect: Story = {
  render: () => (
    <Group gap={4} ay="start">
      <Menu
        trigger={<Button>Actions</Button>}
        items={[
          { label: "Edit", value: "edit" },
          { label: "Duplicate", value: "duplicate", disabled: true },
          { label: "Delete", value: "delete" },
        ]}
      />
      <Select
        aria-label="Action"
        placeholder="Choose an action"
        items={[
          { label: "Edit", value: "edit" },
          { label: "Duplicate", value: "duplicate", disabled: true },
          { label: "Delete", value: "delete" },
        ]}
      />
    </Group>
  ),
};

export const NonModal: Story = { render: () => <Examples.NonModal /> };
