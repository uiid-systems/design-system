import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/layout";

import { ToastProvider, useToast, Toaster } from "./toast";

const meta: Meta<unknown> = {
  title: "Overlays/Toast",
  args: {},
  argTypes: {},
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
        <Toaster />
      </ToastProvider>
    ),
  ],
  render: () => {
    const toastManager = useToast();

    const handleClick = () => {
      toastManager.add({
        title: "Toast",
        description: "This is a toast",
      });
    };

    return (
      <Stack gap={4}>
        <button onClick={handleClick}>activate toast</button>
      </Stack>
    );
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Toast" };
