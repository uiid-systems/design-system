import { Stack } from "@uiid/layout";

import { CodeBlock } from "./code-block";

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
    <CodeBlock code={LONG_LINE} filename="scroll.ts" />
    <CodeBlock code={LONG_LINE} filename="wrap.ts" defaultWrap />
  </Stack>
);

export const HeaderActions = () => (
  <Stack gap={4}>
    <CodeBlock
      code={SAMPLE}
      filename="copy-only.tsx"
      wrappable={false}
      fullscreenable={false}
    />
    <CodeBlock
      code={SAMPLE}
      filename="no-actions.tsx"
      copyable={false}
      wrappable={false}
      fullscreenable={false}
    />
  </Stack>
);

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
