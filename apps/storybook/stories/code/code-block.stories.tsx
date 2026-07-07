import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack, CodeBlock } from "@uiid/design-system";

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
  },
};

export const LongLineWrapOn: Story = {
  args: {
    code: sampleLongLine,
    language: "typescript",
    filename: "long-line.ts",
    defaultWrap: true,
  },
};

export const Fullscreen: Story = {
  args: {
    code: sampleLong,
    language: "typescript",
    filename: "long-file.ts",
  },
};

export const Languages: Story = {
  args: {
    code: sampleTypeScript,
  },
  render: () => (
    <Stack gap={4} ax="stretch" fullwidth>
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

