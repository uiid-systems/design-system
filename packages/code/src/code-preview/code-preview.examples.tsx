import { Button } from "@uiid/buttons";
import { CollapsibleRoot } from "@uiid/interactive";
import { Group, Stack } from "@uiid/layout";
import { Reveal, Text } from "@uiid/typography";
import { useState } from "react";

import { CodeBlockContent, CodeBlockCopyButton } from "../code-block";
import { CodePreview } from "./code-preview";
import {
  CodePreviewBar,
  CodePreviewCanvas,
  CodePreviewPanel,
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

/** With no `code` there is no bar and no panel: a framed canvas only. */
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
 * bar and the code still render, and reset tries the example again.
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
 * The parts sit under a `CollapsibleRoot` from `@uiid/interactive`. The
 * monolithic CodePreview adds the frame, the highlighting and the copy button.
 */
export const Composed = () => (
  <CollapsibleRoot>
    <CodePreviewCanvas>
      <Actions />
    </CodePreviewCanvas>
    <CodePreviewBar>
      <CodePreviewTrigger />
      <CodeBlockCopyButton code={SAMPLE} />
    </CodePreviewBar>
    <CodePreviewPanel>
      <CodeBlockContent code={SAMPLE} />
    </CodePreviewPanel>
  </CollapsibleRoot>
);
