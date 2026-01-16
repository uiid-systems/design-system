import type { Meta, StoryObj } from "@storybook/react-vite";
import { Profile } from "./profile";

const meta: Meta<typeof Profile> = {
  title: "Blocks/Profile",
  component: Profile,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "80rem" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Profile",
};
