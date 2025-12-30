import type { Meta, StoryObj } from "@storybook/react-vite";

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
  tags: ["beta"],
  parameters: { layout: "centered" },
  render: () => (
    <Group gap={2}>
      <Sheet
        title="Open menu from right"
        trigger={
          <button>
            <SquareChevronLeft />
          </button>
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
          <button>
            <SquareChevronRight />
          </button>
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
          <button>
            <SquareChevronDown />
          </button>
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
          <button>
            <SquareChevronUp />
          </button>
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

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Sheet" };
