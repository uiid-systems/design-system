import { Button } from "@uiid/buttons";
import { Group, Stack } from "@uiid/layout";
import { useState } from "react";

import { useHighlight } from "../highlighter";
import { CodeBlock } from "./code-block";
import { CodeBlockContent, CodeBlockHeader } from "./subcomponents";

const SAMPLE = `import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}`;

const LONG_SAMPLE = Array.from(
  { length: 40 },
  (_, i) =>
    `const line${i.toString().padStart(2, "0")} = ${i} * 2; // line ${i + 1}`,
).join("\n");

const LONG_LINE = `const message = "this is an intentionally long string that runs past the width of most containers, to show horizontal scroll against soft wrap";`;

export const Default = () => <CodeBlock code={SAMPLE} language="tsx" />;

export const WithFilename = () => (
  <CodeBlock code={SAMPLE} language="tsx" filename="counter.tsx" />
);

export const LineNumbers = () => (
  <CodeBlock code={SAMPLE} language="tsx" showLineNumbers />
);

export const HighlightLines = () => (
  <CodeBlock
    code={SAMPLE}
    language="tsx"
    showLineNumbers
    highlightLines={[4, 7]}
  />
);

export const Collapsed = () => (
  <CodeBlock code={LONG_SAMPLE} filename="long-file.ts" rows={8} />
);

export const Wrap = () => (
  <Stack gap={4}>
    <CodeBlock code={LONG_LINE} filename="scroll.ts" wrappable />
    <CodeBlock code={LONG_LINE} filename="wrap.ts" wrappable defaultWrap />
  </Stack>
);

export const HeaderActions = () => (
  <Stack gap={4}>
    <CodeBlock code={SAMPLE} filename="copy-only.tsx" />
    <CodeBlock
      code={SAMPLE}
      filename="all-actions.tsx"
      wrappable
      fullscreenable
    />
    <CodeBlock code={SAMPLE} filename="no-actions.tsx" copyable={false} />
  </Stack>
);

/** Wrap, expanded and fullscreen held in the caller's state and set from outside. */
export const Controlled = () => {
  const [wrap, setWrap] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <Stack gap={3}>
      <Group gap={2}>
        <Button size="small" variant="subtle" onClick={() => setWrap(!wrap)}>
          {wrap ? "Unwrap lines" : "Wrap lines"}
        </Button>
        <Button
          size="small"
          variant="subtle"
          aria-expanded={expanded}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Collapse" : "Expand"}
        </Button>
        <Button
          size="small"
          variant="subtle"
          onClick={() => setFullscreen(true)}
        >
          Open fullscreen
        </Button>
      </Group>
      <CodeBlock
        code={`${LONG_LINE}\n${LONG_SAMPLE}`}
        filename="controlled.ts"
        rows={8}
        wrappable
        fullscreenable
        wrap={wrap}
        onWrapChange={setWrap}
        expanded={expanded}
        onExpandedChange={setExpanded}
        fullscreen={fullscreen}
        onFullscreenChange={setFullscreen}
      />
    </Stack>
  );
};

/**
 * A block built from the parts, without CodeBlock. The caller owns the wrap
 * state and the highlighting; there is no row cap or fullscreen view.
 */
export const Composed = () => {
  const [wrap, setWrap] = useState(false);
  const { html } = useHighlight(SAMPLE, "tsx");

  return (
    <Stack w="full" b={1}>
      <CodeBlockHeader
        filename="counter.tsx"
        language="tsx"
        code={SAMPLE}
        wrappable
        wrap={wrap}
        onWrapChange={setWrap}
      />
      <CodeBlockContent html={html || undefined} code={SAMPLE} wrap={wrap} />
    </Stack>
  );
};

export const Languages = () => (
  <Stack gap={4}>
    <CodeBlock
      code={`echo "Installing"\npnpm install`}
      language="bash"
      filename="setup.sh"
    />
    <CodeBlock
      code={`{\n  "name": "@uiid/code"\n}`}
      language="json"
      filename="package.json"
    />
    <CodeBlock
      code={`.button {\n  color: red;\n}`}
      language="css"
      filename="styles.css"
    />
    <CodeBlock code={`Plain text has no colors.`} language="text" />
  </Stack>
);
