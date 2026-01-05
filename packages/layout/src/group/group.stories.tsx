import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box, Group } from "../";

const meta = {
  title: "Layout/Group",
  component: Group,
  tags: ["beta"],
  args: { gap: 2 },
  argTypes: {
    evenly: { control: "boolean", table: { category: "Toggles" } },
    fullwidth: { control: "boolean", table: { category: "Toggles" } },
    gap: { control: "number", table: { category: "Spacing" } },
    ax: {
      control: "select",
      options: ["stretch", "center", "start", "end"],
      table: { category: "Spacing" },
    },
    ay: {
      control: "select",
      options: ["stretch", "center", "start", "end"],
      table: { category: "Spacing" },
    },
    p: { control: "number", table: { category: "Spacing" } },
    px: { control: "number", table: { category: "Spacing" } },
    py: { control: "number", table: { category: "Spacing" } },
    pl: { control: "number", table: { category: "Spacing" } },
    pr: { control: "number", table: { category: "Spacing" } },
    pt: { control: "number", table: { category: "Spacing" } },
    pb: { control: "number", table: { category: "Spacing" } },
    m: { control: "number", table: { category: "Spacing" } },
    mx: { control: "number", table: { category: "Spacing" } },
    my: { control: "number", table: { category: "Spacing" } },
    ml: { control: "number", table: { category: "Spacing" } },
    mr: { control: "number", table: { category: "Spacing" } },
    mt: { control: "number", table: { category: "Spacing" } },
    mb: { control: "number", table: { category: "Spacing" } },

    render: { table: { disable: true } },
    children: { table: { disable: true } },
    ref: { table: { disable: true } },
    style: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  render: (args) => (
    <Group {...args}>
      <Boxes />
    </Group>
  ),
} satisfies Meta<typeof Group>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Group" };

const Boxes = () => (
  <>
    <Box
      style={{ background: "tomato", height: 64, width: 64, borderRadius: 8 }}
    />
    <Box
      style={{ background: "gold", height: 64, width: 64, borderRadius: 8 }}
    />
    <Box
      style={{
        background: "mediumseagreen",
        height: 64,
        width: 64,
        borderRadius: 8,
      }}
    />
  </>
);
