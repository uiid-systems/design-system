import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/layout";
import { ChevronRightIcon } from "@uiid/icons";

import { Menu } from "./menu";
import { MOCK_ITEMS } from "./menu.mocks";

import {
  MenuRoot,
  MenuPopup,
  MenuTrigger,
  MenuPortal,
  MenuItem,
  SubmenuRoot,
  SubmenuTrigger,
  MenuPositioner,
} from "./subcomponents";

const meta: Meta<typeof Menu> = {
  title: "Interactive/Menu",
  component: Menu,
  tags: ["beta"],
  args: {},
  argTypes: {},
  render: (args) => (
    <Stack gap={4}>
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
          <MenuPositioner>
            <MenuPopup>
              <MenuItem>Lorem</MenuItem>
              <MenuItem>Lorem ipsum dolor sit amet</MenuItem>
              <SubmenuRoot>
                <SubmenuTrigger>
                  Lorem ipsum
                  <ChevronRightIcon size={12} />
                </SubmenuTrigger>
                <MenuPortal>
                  <MenuPositioner>
                    <MenuPopup>
                      <MenuItem>Item 3.1</MenuItem>
                      <MenuItem>Item 3.2</MenuItem>
                      <MenuItem>Item 3.3</MenuItem>
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
