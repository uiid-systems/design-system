import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToastProvider } from "@uiid/design-system";

import * as Examples from "../../../../packages/overlays/src/toast/toast.examples";

const meta = {
  title: "Overlays/Toast",
  component: ToastProvider,
  args: {},
  argTypes: {},
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Each example is self-contained: a provider, a viewport, and something to fire from. */
export const Playground: Story = { render: () => <Examples.Default /> };

export const TitleAndDescription: Story = {
  render: () => <Examples.TitleAndDescription />,
};

export const Types: Story = { render: () => <Examples.Types /> };

export const Color: Story = { render: () => <Examples.Color /> };

export const Action: Story = { render: () => <Examples.Action /> };

export const WithProgress: Story = { render: () => <Examples.WithProgress /> };

export const Positions: Story = { render: () => <Examples.Positions /> };

export const Stacking: Story = { render: () => <Examples.Stacking /> };
