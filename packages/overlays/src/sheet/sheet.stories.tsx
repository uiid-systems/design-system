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
          <Button
            aria-label="Open menu from right"
            icon={<SquareChevronLeft />}
            tooltip="Open menu from right"
            variant="subtle"
          />
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
          <Button
            aria-label="Open menu"
            icon={<SquareChevronRight />}
            tooltip="Open menu from left"
            variant="subtle"
          />
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
          <Button
            variant="subtle"
            icon={<SquareChevronDown />}
            tooltip="Open menu from top"
            aria-label="Open menu from top"
          />
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
          <Button
            variant="subtle"
            icon={<SquareChevronUp />}
            tooltip="Open menu from bottom"
            aria-label="Open menu from bottom"
          />
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
