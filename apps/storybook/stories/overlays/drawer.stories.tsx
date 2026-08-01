import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Stack, Drawer } from "@uiid/design-system";
import { GlobeIcon } from "@uiid/icons";

const meta: Meta<typeof Drawer> = {
  title: "Overlays/Drawer",
  component: Drawer,
  tags: ["beta"],
  args: {
    title: "Drawer Title",
    description: "Drawer Description",
    icon: GlobeIcon,
    action: <Button size="small">Action</Button>,
    footer: "Drawer Footer",
    children:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam ipsa hic, accusamus dolor cum minima pariatur provident vero blanditiis vel! Assumenda ipsum officia autem!",
  },
  argTypes: {
    swipeDirection: {
      control: "select",
      options: ["up", "down", "left", "right"],
      table: { category: "Behavior" },
    },
  },
  render: (args) => (
    <Stack gap={4}>
      <Drawer {...args} trigger={<Button>Open drawer</Button>} />
      <Drawer {...args} trigger="string trigger" />
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Drawer" };

/** Swipe or drag the drawer toward its anchored edge to dismiss it. */
export const SwipeDirections: Story = {
  render: (args) => (
    <Stack gap={4}>
      {(["up", "down", "left", "right"] as const).map((swipeDirection) => (
        <Drawer
          key={swipeDirection}
          {...args}
          swipeDirection={swipeDirection}
          title={`Anchored ${swipeDirection}`}
          trigger={<Button>{swipeDirection}</Button>}
        />
      ))}
    </Stack>
  ),
};

/** Snap points let the drawer rest partway open before expanding. */
export const SnapPoints: Story = {
  render: (args) => (
    <Drawer
      {...args}
      swipeDirection="down"
      snapPoints={[0.3, 0.6, 1]}
      title="Snap points"
      trigger={<Button>Open bottom sheet</Button>}
    />
  ),
};
