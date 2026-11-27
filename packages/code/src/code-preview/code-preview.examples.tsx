import { Button } from "@uiid/buttons";
import { Group, Stack } from "@uiid/layout";
import { Reveal, Text } from "@uiid/typography";
import { useState } from "react";

import { CodeBlockContent, CodeBlockHeader } from "../code-block";
import { useHighlight } from "../highlighter/highlighter.hooks";
import { CodePreview } from "./code-preview";
import {
  CodePreviewCanvas,
  CodePreviewPanel,
  CodePreviewRoot,
  CodePreviewTrigger,
} from "./subcomponents";

const SAMPLE = `import { Button, Group } from "@uiid/design-system";

export const Actions = () => (
  <Group gap={2}>
    <Button variant="subtle">Cancel</Button>
    <Button>Save</Button>
  </Group>
);`;

const LONG_SAMPLE = Array.from(
  { length: 40 },
  (_, i) =>
    `const line${i.toString().padStart(2, "0")} = ${i} * 2; // line ${i + 1}`,
).join("\n");

const Actions = () => (
  <Group gap={2}>
    <Button variant="subtle">Cancel</Button>
    <Button>Save</Button>
  </Group>
);

export const Default = () => (
  <CodePreview code={SAMPLE} language="tsx">
    <Actions />
  </CodePreview>
);

export const OpenByDefault = () => (
  <CodePreview code={SAMPLE} language="tsx" defaultOpen>
    <Actions />
  </CodePreview>
);

/** With no `code` there is no code and no footer: a framed canvas only. */
export const NoCode = () => (
  <CodePreview>
    <Actions />
  </CodePreview>
);

export const LongCode = () => (
  <CodePreview code={LONG_SAMPLE} showLineNumbers defaultOpen>
    <Text>A long file opens in full beneath the example.</Text>
  </CodePreview>
);

const STEPS = Array.from({ length: 12 }, (_, i) => `Step ${i + 1}`);

/**
 * An example wider than the frame scrolls inside the canvas, starting at its
 * start edge. The frame keeps its width, and the reset button stays in its
 * corner while the example scrolls beneath it.
 */
export const WideChild = () => (
  <CodePreview code={SAMPLE} language="tsx" resettable>
    <Group gap={2}>
      {STEPS.map((step) => (
        <Button key={step} variant="subtle">
          {step}
        </Button>
      ))}
    </Group>
  </CodePreview>
);

/** A tall example grows the canvas; the code stays beneath it. */
export const TallChild = () => (
  <CodePreview code={SAMPLE} language="tsx" resettable>
    <Stack gap={2} ax="stretch">
      {STEPS.map((step) => (
        <Button key={step} variant="subtle">
          {step}
        </Button>
      ))}
    </Stack>
  </CodePreview>
);

export const Labels = () => (
  <CodePreview
    code={SAMPLE}
    language="tsx"
    showLabel="Source"
    hideLabel="Hide source"
  >
    <Actions />
  </CodePreview>
);

const Counter = () => {
  const [count, setCount] = useState(0);
  return (
    <Button variant="subtle" onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </Button>
  );
};

/**
 * Reset remounts the example: the words reveal again and the count returns
 * to zero. The code panel stays as it was.
 */
export const Resettable = () => (
  <CodePreview code={SAMPLE} language="tsx" resettable>
    <Stack gap={4} ax="center">
      <Reveal size={2}>Every word fades in when the example mounts</Reveal>
      <Counter />
    </Stack>
  </CodePreview>
);

const Broken = (): React.ReactNode => {
  throw new Error("This example throws while rendering.");
};

/**
 * An example that throws shows a short message in the canvas. The frame, the
 * code and the footer still render, and reset tries the example again.
 */
export const Throws = () => (
  <CodePreview code={SAMPLE} language="tsx" resettable>
    <Broken />
  </CodePreview>
);

export const Controlled = () => {
  const [open, setOpen] = useState(false);

  return (
    <Stack gap={2} ax="stretch">
      <Text emphasis="muted">{open ? "Code shown" : "Code hidden"}</Text>
      <CodePreview
        code={SAMPLE}
        language="tsx"
        open={open}
        onOpenChange={setOpen}
      >
        <Actions />
      </CodePreview>
    </Stack>
  );
};

/**
 * The same preview from its parts. `CodePreviewRoot` is the frame, and
 * `useHighlight` colors the code. Unlike CodePreview, this highlights on mount
 * rather than waiting for the first open.
 */
export const Composed = () => {
  const { html } = useHighlight(SAMPLE, "tsx");

  return (
    <CodePreviewRoot>
      <CodePreviewCanvas>
        <Actions />
      </CodePreviewCanvas>
      <CodePreviewPanel>
        {/* No filename, so the copy button floats over the code. */}
        <CodeBlockHeader code={SAMPLE} />
        <CodeBlockContent code={SAMPLE} html={html || undefined} />
      </CodePreviewPanel>
      <CodePreviewTrigger />
    </CodePreviewRoot>
  );
};
