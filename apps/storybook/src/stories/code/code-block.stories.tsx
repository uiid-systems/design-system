import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/layout";
import { CodeBlock } from "@uiid/code";

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

export const Default: Story = {
  args: {
    code: sampleTypeScript,
    language: "typescript",
    filename: "counter.tsx",
    showLineNumbers: false,
    copyable: true,
  },
};

export const WithLineNumbers: Story = {
  args: {
    code: sampleTypeScript,
    language: "typescript",
    filename: "counter.tsx",
    showLineNumbers: true,
    copyable: true,
  },
};

export const WithoutHeader: Story = {
  args: {
    code: sampleTypeScript,
    language: "typescript",
    copyable: false,
  },
};

export const Languages: Story = {
  args: {
    code: sampleTypeScript,
  },
  render: () => (
    <Stack gap={4}>
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
