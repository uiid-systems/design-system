import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Avatar } from "@uiid/design-system";

const meta: Meta<typeof Avatar> = {
  title: "Indicators/Avatar",
  component: Avatar,
  tags: ["beta"],
  args: {},
  argTypes: {
    color: {
      control: "select",
      options: [
        undefined,
        "red",
        "orange",
        "yellow",
        "green",
        "blue",
        "indigo",
        "purple",
        "neutral",
      ],
      table: { category: "Variants" },
    },
  },
  render: (args) => (
    <Stack gap={8}>
      <Stack gap={4}>
        <Avatar
          {...args}
          initials="AF"
          name="Adam Fratino"
          description="Software Engineer"
        />
        <Avatar {...args} initials="AF" name="Adam Fratino" />
        <Avatar {...args} initials="AF" />
      </Stack>

      <Stack gap={4}>
        <Avatar
          {...args}
          initials="AF"
          name="Adam Fratino"
          description="Software Engineer"
          orientation="vertical"
        />
        <Avatar
          {...args}
          initials="AF"
          name="Adam Fratino"
          orientation="vertical"
        />
        <Avatar {...args} initials="AF" orientation="vertical" />
      </Stack>
    </Stack>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Avatar" };

const colors = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "indigo",
  "purple",
  "neutral",
] as const;

export const Colors: Story = {
  render: (args) => (
    <Stack gap={2}>
      {colors.map((color) => (
        <Avatar
          key={color}
          {...args}
          color={color}
          initials={color.slice(0, 2).toUpperCase()}
          name={color}
        />
      ))}
    </Stack>
  ),
};

const AVATAR_SRC = "https://avatars.githubusercontent.com/u/9919?v=4";

export const Image: Story = {
  render: (args) => (
    <Stack gap={4}>
      <Avatar {...args} initials="GH" src={AVATAR_SRC} />
      <Avatar
        {...args}
        initials="GH"
        src={AVATAR_SRC}
        name="GitHub"
        description="Loaded image"
      />
      <Avatar
        {...args}
        initials="GH"
        src="/missing-avatar.png"
        name="GitHub"
        description="Failed image keeps the initials"
      />
    </Stack>
  ),
};
