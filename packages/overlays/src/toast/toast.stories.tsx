import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/layout";

import { Toaster } from "./toast";
import { ToastProvider, useToastManager } from "./toast.hooks";

const meta: Meta<typeof ToastProvider> = {
  title: "Overlays/Toast",
  component: ToastProvider,
  tags: ["danger"],
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
    const toastManager = useToastManager();

    const handleClick = () => {
      toastManager.add({
        title: "Toast",
        description: "This is a toast",
      });
    };

    return (
      <Stack gap={4}>
        <button onClick={handleClick}>native button</button>
        <span onClick={handleClick}>string</span>
      </Stack>
    );
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Toast" };
