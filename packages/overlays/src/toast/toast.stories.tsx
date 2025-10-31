import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/layout";
import { Button } from "@uiid/buttons";

import { ToastProvider, useToastManager, Toaster } from "./toast";

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
    const toastManager = useToastManager();

    const handleClick = () => {
      toastManager.add({
        title: "Toast",
        description: "This is a toast",
      });
    };

    return (
      <Stack gap={4}>
        <Button onClick={handleClick}>custom button</Button>
        <button onClick={handleClick}>native button</button>
        <span onClick={handleClick}>string</span>
      </Stack>
    );
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Toast" };
