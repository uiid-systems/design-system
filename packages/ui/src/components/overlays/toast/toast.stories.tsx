import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@uiid/primitives";

import { Button } from "../../buttons";

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
        <Button onClick={handleClick}>activate toast</Button>
      </Stack>
    );
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Toast" };
