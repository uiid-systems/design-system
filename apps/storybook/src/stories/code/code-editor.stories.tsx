import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { CodeEditor } from "@uiid/code";

const meta = {
  title: "Code/Code Editor",
  component: CodeEditor,
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
      table: { category: "Options" },
    },
    showLineNumbers: { control: "boolean", table: { category: "Toggles" } },
    copyable: { control: "boolean", table: { category: "Toggles" } },
    readOnly: { control: "boolean", table: { category: "Toggles" } },
    disabled: { control: "boolean", table: { category: "Toggles" } },
    filename: { control: "text", table: { category: "Text" } },
    placeholder: { control: "text", table: { category: "Text" } },
  },
} satisfies Meta<typeof CodeEditor>;

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

const samplePython = `def fibonacci(n):
    """Generate Fibonacci sequence up to n."""
    a, b = 0, 1
    result = []
    while a < n:
        result.append(a)
        a, b = b, a + b
    return result

# Print first 10 Fibonacci numbers
print(fibonacci(100))`;

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

const sampleJSON = `{
  "name": "@uiid/code",
  "version": "1.0.0",
  "description": "Code editing and syntax highlighting",
  "dependencies": {
    "shiki": "^3.0.0"
  }
}`;

export const Default: Story = {
  args: {
    defaultValue: sampleTypeScript,
    language: "tsx",
    filename: "counter.tsx",
    showLineNumbers: false,
    copyable: true,
  },
};

export const WithLineNumbers: Story = {
  args: {
    defaultValue: sampleTypeScript,
    language: "tsx",
    filename: "counter.tsx",
    showLineNumbers: true,
    copyable: true,
  },
};

export const ReadOnly: Story = {
  args: {
    defaultValue: sampleTypeScript,
    language: "tsx",
    filename: "counter.tsx",
    readOnly: true,
    copyable: true,
  },
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: "// Start typing your code here...",
    language: "typescript",
    filename: "untitled.ts",
    copyable: false,
  },
};

export const Controlled: Story = {
  render: () => {
    const [code, setCode] = useState(sampleTypeScript);

    return (
      <Stack gap={4}>
        <CodeEditor
          value={code}
          onValueChange={setCode}
          language="typescript"
          filename="controlled.tsx"
        />
        <Text size={-1} shade="accent">
          Character count: {code.length}
        </Text>
      </Stack>
    );
  },
};

export const Languages: Story = {
  render: () => (
    <Stack gap={4}>
      <CodeEditor
        defaultValue={sampleTypeScript}
        language="typescript"
        filename="example.tsx"
      />
      <CodeEditor
        defaultValue={sampleJavaScript}
        language="javascript"
        filename="server.js"
      />
      <CodeEditor
        defaultValue={samplePython}
        language="python"
        filename="fibonacci.py"
      />
      <CodeEditor
        defaultValue={sampleCSS}
        language="css"
        filename="styles.css"
      />
      <CodeEditor
        defaultValue={sampleJSON}
        language="json"
        filename="package.json"
      />
    </Stack>
  ),
};
