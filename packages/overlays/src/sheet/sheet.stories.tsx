import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@uiid/buttons";
import {
  SquareChevronLeft,
  SquareChevronRight,
  SquareChevronUp,
  SquareChevronDown,
} from "@uiid/icons";
import { Group } from "@uiid/layout";

import { Sheet } from "./sheet";

const meta: Meta<typeof Sheet> = {
  title: "Overlays/Sheet",
  component: Sheet,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Sheet",
  render: () => (
    <Group gap={2}>
      <Sheet
        title="Open menu from right"
        trigger={
          <Button tooltip="Open menu from right" variant="subtle">
            <SquareChevronLeft />
          </Button>
        }
      >
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam
          ipsa hic, accusamus dolor cum minima pariatur provident vero
          blanditiis vel! Assumenda ipsum officia autem!
        </p>
      </Sheet>

      <Sheet
        title="Open menu from left"
        side="left"
        trigger={
          <Button tooltip="Open menu from left" variant="subtle">
            <SquareChevronRight />
          </Button>
        }
      >
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam
          ipsa hic, accusamus dolor cum minima pariatur provident vero
          blanditiis vel!
        </p>
      </Sheet>

      <Sheet
        title="Notifications"
        side="top"
        trigger={
          <Button tooltip="Open menu from top" variant="subtle">
            <SquareChevronDown />
          </Button>
        }
      >
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam
          ipsa hic, accusamus dolor cum minima pariatur provident vero
          blanditiis vel!
        </p>
      </Sheet>

      <Sheet
        title="Settings"
        side="bottom"
        trigger={
          <Button tooltip="Open menu from bottom" variant="subtle">
            <SquareChevronUp />
          </Button>
        }
      >
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam
          ipsa hic, accusamus dolor cum minima pariatur provident vero
          blanditiis vel!
        </p>
      </Sheet>
    </Group>
  ),
};
