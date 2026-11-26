import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  CodeBlock,
  Dialog,
  Group,
  Stack,
  Text,
} from "@uiid/design-system";
import { useEffect, useState } from "react";

import * as Examples from "../../../../packages/code/src/code-block/code-block.examples";

const meta = {
  title: "Code/Code Block",
  component: CodeBlock,
  tags: ["beta"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    language: {
      control: "select",
      options: [
        "javascript",
        "typescript",
        "jsx",
        "tsx",
        "json",
        "css",
        "html",
        "bash",
        "markdown",
        "python",
      ],
    },
    showLineNumbers: { control: "boolean" },
    copyable: { control: "boolean" },
    wrappable: { control: "boolean" },
    fullscreenable: { control: "boolean" },
    defaultExpanded: { control: "boolean" },
    defaultWrap: { control: "boolean" },
    rows: { control: { type: "number", min: 1, max: 30 } },
  },
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleTypeScript = `import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}`;

const sampleJavaScript = `const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Hello, World!" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});`;

const sampleBash = `#!/bin/bash

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build`;

const sampleJSON = `{
  "name": "@uiid/code",
  "version": "1.0.0",
  "description": "Syntax highlighting components",
  "dependencies": {
    "shiki": "^3.0.0"
  }
}`;

const sampleCSS = `.button {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: var(--primary);
  border-radius: 0.25rem;

  &:hover {
    background-color: var(--primary-hover);
  }
}`;

const sampleLong = Array.from(
  { length: 40 },
  (_, i) =>
    `const line${i.toString().padStart(2, "0")} = ${i} * 2; // line ${i + 1}`,
).join("\n");

const sampleLongLine = `const veryLongConstName = "this is an intentionally long string that exceeds typical container widths so we can demonstrate horizontal scroll versus soft wrap behavior across various layouts";`;

export const Default: Story = {
  args: {
    code: sampleTypeScript,
    language: "typescript",
    filename: "counter.tsx",
    showLineNumbers: false,
  },
};

/* A filename and no language: the bar shows the name alone. */
export const Filename: Story = {
  args: {
    code: sampleTypeScript,
    filename: "counter.tsx",
  },
};

/* No filename and no language: no bar. The copy button floats in the
   top-right corner, centred on the first line. */
export const NoHeader: Story = {
  args: {
    code: sampleTypeScript,
  },
};

/* Each button on its own, with a bar (left) and floating (right). */
export const EachButton: Story = {
  args: {
    code: sampleTypeScript,
  },
  render: () => (
    <Stack gap={4} w="full">
      {(
        [
          ["Copy", { copyable: true }],
          ["Wrap", { copyable: false, wrappable: true }],
          ["Fullscreen", { copyable: false, fullscreenable: true }],
        ] as const
      ).map(([label, flags]) => (
        <Stack key={label} gap={2} w="full">
          <Text size={-1} emphasis="muted">
            {label}
          </Text>
          <Group gap={4} evenly w="full" ay="start">
            <CodeBlock
              code={sampleBash}
              language="bash"
              filename="setup.sh"
              {...flags}
            />
            <CodeBlock code={sampleBash} {...flags} />
          </Group>
        </Stack>
      ))}
    </Stack>
  ),
};

/* All three buttons, with a bar (left) and floating (right). */
export const AllButtons: Story = {
  args: {
    code: sampleTypeScript,
  },
  render: () => (
    <Group gap={4} evenly w="full" ay="start">
      <CodeBlock
        code={sampleTypeScript}
        language="tsx"
        filename="counter.tsx"
        wrappable
        fullscreenable
      />
      <CodeBlock code={sampleTypeScript} wrappable fullscreenable />
    </Group>
  ),
};

/* Floating buttons keep the end of the first line clear. Wrapped (left), the
   first line breaks before them; unwrapped (right), it scrolls beneath them. */
export const FloatingFirstLine: Story = {
  args: {
    code: sampleLongLine,
  },
  render: () => (
    <Group gap={4} evenly w="full" ay="start">
      <CodeBlock
        code={`${sampleLongLine}\n${sampleLongLine}`}
        wrappable
        fullscreenable
        defaultWrap
      />
      <CodeBlock
        code={`${sampleLongLine}\n${sampleLongLine}`}
        wrappable
        fullscreenable
      />
    </Group>
  ),
};

/* Collapsed, no header: the code clips at its rows rather than scrolling, so
   only the first line keeps the buttons' column clear and "Show more" reveals
   the rest. Wrapped (left); unwrapped (right), the lines still scroll sideways. */
export const FloatingCollapsed: Story = {
  args: {
    code: sampleLongLine,
  },
  render: () => (
    <Group gap={4} evenly w="full" ay="start">
      <CodeBlock
        code={Array.from({ length: 12 }, () => sampleLongLine).join("\n")}
        rows={6}
        wrappable
        fullscreenable
        defaultWrap
      />
      <CodeBlock
        code={Array.from({ length: 12 }, () => sampleLongLine).join("\n")}
        rows={6}
        wrappable
        fullscreenable
      />
    </Group>
  ),
};

/* A long filename truncates; the buttons keep their size and row. */
export const LongFilename: Story = {
  args: {
    code: sampleTypeScript,
  },
  render: () => (
    <Stack gap={4} maxw={360}>
      <CodeBlock
        code={sampleTypeScript}
        language="tsx"
        filename="src/components/dashboard/widgets/charts/revenue-by-region-chart.tsx"
        wrappable
        fullscreenable
      />
    </Stack>
  ),
};

/* Each container's [data-theme] picks the colors, with no re-highlight. */
export const Themes: Story = {
  args: {
    code: sampleTypeScript,
  },
  render: () => (
    <Group gap={4} evenly w="full" ay="start">
      {(["light", "dark"] as const).map((theme) => (
        <Stack key={theme} data-theme={theme} gap={4} p={4} w="full">
          <CodeBlock
            code={sampleTypeScript}
            language="tsx"
            filename="counter.tsx"
            wrappable
          />
          <CodeBlock code={sampleTypeScript} wrappable fullscreenable />
          <CodeBlock
            code={sampleLong}
            language="typescript"
            filename="long-file.ts"
            rows={6}
          />
        </Stack>
      ))}
    </Group>
  ),
};

export const WithLineNumbers: Story = {
  args: {
    code: sampleTypeScript,
    language: "typescript",
    filename: "counter.tsx",
    showLineNumbers: true,
  },
};

export const Collapsed: Story = {
  args: {
    code: sampleLong,
    language: "typescript",
    filename: "long-file.ts",
    rows: 8,
  },
};

export const ExpandedByDefault: Story = {
  args: {
    code: sampleLong,
    language: "typescript",
    filename: "long-file.ts",
    rows: 8,
    defaultExpanded: true,
  },
};

export const LongLineWrapOff: Story = {
  args: {
    code: sampleLongLine,
    language: "typescript",
    filename: "long-line.ts",
    wrappable: true,
  },
};

export const LongLineWrapOn: Story = {
  args: {
    code: sampleLongLine,
    language: "typescript",
    filename: "long-line.ts",
    wrappable: true,
    defaultWrap: true,
  },
};

export const Fullscreen: Story = {
  args: {
    code: sampleLong,
    language: "typescript",
    filename: "long-file.ts",
    fullscreenable: true,
  },
};

/** Opened from inside a Dialog, the fullscreen view stacks above it and closes back to it. */
export const FullscreenInDialog: Story = {
  args: {
    code: sampleLong,
    language: "typescript",
    filename: "long-file.ts",
    fullscreenable: true,
    rows: 8,
  },
  render: (args) => (
    <Dialog
      title="Generated config"
      size="large"
      trigger={<Button>Open dialog</Button>}
    >
      <CodeBlock {...args} />
    </Dialog>
  ),
};

export const NoHeaderActions: Story = {
  args: {
    code: sampleTypeScript,
    language: "typescript",
    filename: "counter.tsx",
    copyable: false,
  },
};

export const Languages: Story = {
  args: {
    code: sampleTypeScript,
  },
  render: () => (
    <Stack gap={4} w="full">
      <CodeBlock
        code={sampleTypeScript}
        language="typescript"
        filename="counter.tsx"
      />
      <CodeBlock
        code={sampleJavaScript}
        language="javascript"
        filename="server.js"
      />
      <CodeBlock code={sampleBash} language="bash" filename="setup.sh" />
      <CodeBlock code={sampleJSON} language="json" filename="package.json" />
      <CodeBlock code={sampleCSS} language="css" filename="styles.css" />
    </Stack>
  ),
};

/** Wrap, expanded and fullscreen held in the caller's state and set from outside. */
export const Controlled: Story = {
  args: { code: sampleTypeScript },
  render: () => <Examples.Controlled />,
};

/** A block built from the exported parts, without CodeBlock. */
export const Composed: Story = {
  args: { code: sampleTypeScript },
  render: () => <Examples.Composed />,
};

const sampleStream = Array.from({ length: 6 }, (_, i) =>
  [
    `// Counter ${i + 1}: a labelled button that counts its clicks`,
    `export function Counter${i + 1}({ label = "Clicks" }: { label?: string }) {`,
    `  const [count, setCount] = useState(${i});`,
    "  /* Strings, comments and tags arrive unterminated mid-stream */",
    "  return (",
    `    <button className="counter" onClick={() => setCount(count + 1)}>`,
    "      {label}: {count}",
    "    </button>",
    "  );",
    "}",
  ].join("\n"),
).join("\n\n");

/** Grows `sampleStream` a few characters per frame, as a chat response does. */
const StreamingBlock = () => {
  const [run, setRun] = useState(0);
  const [length, setLength] = useState(0);
  const done = length >= sampleStream.length;

  useEffect(() => {
    if (done) return;
    const frame = requestAnimationFrame(() =>
      setLength((n) => Math.min(n + 6, sampleStream.length)),
    );
    return () => cancelAnimationFrame(frame);
  }, [length, done]);

  return (
    <Stack gap={4} w="full">
      <Group gap={2} ay="center">
        <Button
          size="small"
          variant="subtle"
          onClick={() => {
            setRun((n) => n + 1);
            setLength(0);
          }}
        >
          Replay
        </Button>
        <Text size={-1} emphasis="muted">
          {done ? "Done" : "Streaming…"}
        </Text>
      </Group>
      {/* A new block per run, so a replay starts from empty rather than from
          the last run's markup. */}
      <CodeBlock
        key={run}
        code={sampleStream.slice(0, length)}
        language="tsx"
        filename="counters.tsx"
        rows={16}
      />
    </Stack>
  );
};

/** A file streamed in on load, a few characters per frame. Replay streams it again. */
export const Streaming: Story = {
  args: { code: sampleStream },
  render: () => <StreamingBlock />,
};
