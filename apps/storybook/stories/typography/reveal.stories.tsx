import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Reveal, Stack, type RevealProps } from "@uiid/design-system";
import { useEffect, useRef, useState } from "react";

import * as Examples from "../../../../packages/typography/src/reveal/reveal.examples";
import {
  variantControls,
  spacingControls,
  disabledControls,
} from "./constants";

const SAMPLE =
  "UIID is a registry-first design system. Tokens define the design language, the registry describes it semantically, and blocks compose it into product surfaces.";

const meta = {
  title: "Typography/Reveal",
  component: Reveal,
  args: {
    children: SAMPLE,
    size: 1,
  },
  argTypes: {
    children: { control: "text", table: { category: "Content" } },
    stagger: { control: "number", table: { category: "Animation" } },
    duration: { control: "number", table: { category: "Animation" } },
    blur: { control: "number", table: { category: "Animation" } },
    ...variantControls,
    ...spacingControls,
    ...disabledControls,
  },
} satisfies Meta<typeof Reveal>;

export default meta;
type Story = StoryObj<typeof meta>;

const ReplayDemo = (args: RevealProps) => {
  const [run, setRun] = useState(0);
  return (
    <Stack gap={4} ax="start">
      <Reveal key={run} render={<p />} {...args} />
      <Button
        variant="subtle"
        size="small"
        onClick={() => setRun((r) => r + 1)}
      >
        Replay
      </Button>
    </Stack>
  );
};

export const Playground: Story = {
  render: (args) => <ReplayDemo {...args} />,
};

export const Basic: Story = {
  render: () => <Examples.Basic />,
};

export const SlowStagger: Story = {
  render: () => <Examples.SlowStagger />,
};

export const Styled: Story = {
  render: () => <Examples.Styled />,
};

/**
 * Simulated LLM stream: words arrive in random 1–3 word chunks. Words are
 * keyed by index, so streamed text never re-animates — only new words play
 * the animation. `stagger={0}` because each word's delay is relative to its
 * own mount (see the Reveal README).
 */
const StreamDemo = (args: RevealProps) => {
  const words = args.children.split(/(?<=\s)/);
  const [count, setCount] = useState(0);
  const [run, setRun] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    setCount(0);
    timer.current = setInterval(() => {
      setCount((c) => {
        const next = c + Math.ceil(Math.random() * 3);
        if (next >= words.length && timer.current) {
          clearInterval(timer.current);
        }
        return Math.min(next, words.length);
      });
    }, 120);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [run, words.length]);

  return (
    <Stack gap={4} ax="start">
      <Reveal {...args} render={<p />} stagger={0}>
        {words.slice(0, count).join("")}
      </Reveal>
      <Button
        variant="subtle"
        size="small"
        onClick={() => setRun((r) => r + 1)}
      >
        Restart stream
      </Button>
    </Stack>
  );
};

export const Streaming: Story = {
  render: (args) => <StreamDemo {...args} />,
};
