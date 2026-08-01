import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  Group,
  Number,
  Stack,
  type NumberProps,
} from "@uiid/design-system";
import * as Examples from "../../../../packages/typography/src/number/number.examples";

import {
  variantControls,
  spacingControls,
  disabledControls,
} from "./constants";

const meta = {
  title: "Typography/Number",
  component: Number,
  args: {
    value: 1234,
    size: 4,
    weight: "bold",
  },
  argTypes: {
    value: { control: "number", table: { category: "Content" } },
    prefix: { control: "text", table: { category: "Content" } },
    suffix: { control: "text", table: { category: "Content" } },
    animated: { control: "boolean", table: { category: "Animation" } },
    trend: {
      control: "select",
      options: ["increasing", "decreasing", 0],
      table: { category: "Animation" },
    },
    ...variantControls,
    ...spacingControls,
    ...disabledControls,
  },
} satisfies Meta<typeof Number>;

export default meta;
type Story = StoryObj<typeof meta>;

const CounterDemo = (args: NumberProps) => {
  const [value, setValue] = useState(1234);
  return (
    <Stack gap={4} ax="start">
      <Number {...args} value={value} />
      <Group gap={2}>
        <Button
          variant="subtle"
          size="small"
          onClick={() => setValue((v) => v - 111)}
        >
          −111
        </Button>
        <Button
          variant="subtle"
          size="small"
          onClick={() => setValue((v) => v + 111)}
        >
          +111
        </Button>
        <Button
          variant="ghost"
          size="small"
          onClick={() => setValue(Math.round(Math.random() * 100_000))}
        >
          Randomize
        </Button>
      </Group>
    </Stack>
  );
};

export const Playground: Story = {
  render: (args) => <CounterDemo {...args} />,
};

export const Basic: Story = {
  render: () => <Examples.Basic />,
};

export const Currency: Story = {
  render: () => <Examples.Currency />,
};

export const Percent: Story = {
  render: () => <Examples.Percent />,
};

export const Compact: Story = {
  render: () => <Examples.Compact />,
};
