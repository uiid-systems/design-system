import type { Meta, StoryObj } from "@storybook/react-vite";
import { CodeBlock, CodeEditor, Group, Stack, Text } from "@uiid/design-system";
import { useState } from "react";

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

/** With no filename there is no bar: the copy button floats in the top-right corner, as on CodeBlock. */
export const Default: Story = {
  args: {
    defaultValue: sampleTypeScript,
    language: "tsx",
    showLineNumbers: false,
    copyable: true,
  },
};

export const WithFilename: Story = {
  args: {
    defaultValue: sampleTypeScript,
    language: "tsx",
    filename: "counter.tsx",
    copyable: true,
  },
};

/** Capped at six rows; the code scrolls inside the frame and the floating copy button stays put. */
export const Rows: Story = {
  args: {
    defaultValue: sampleTypeScript,
    language: "tsx",
    rows: 6,
  },
};

/** Disabled dims the whole frame and takes no input. */
export const Disabled: Story = {
  args: {
    defaultValue: sampleTypeScript,
    language: "tsx",
    filename: "counter.tsx",
    disabled: true,
  },
};

/** Default, read-only and disabled side by side: read-only dashes the frame's border (a visual cue; screen readers read the native `readonly`), disabled is dimmed. The code keeps the same surface in all three. */
export const States: Story = {
  args: { defaultValue: sampleTypeScript },
  render: () => (
    <Stack gap={4} w="full">
      <CodeEditor defaultValue={sampleTypeScript} language="tsx" />
      <CodeEditor defaultValue={sampleTypeScript} language="tsx" readOnly />
      <CodeEditor defaultValue={sampleTypeScript} language="tsx" disabled />
    </Stack>
  ),
};

/** A CodeBlock above an editor with the same code: frame, header, padding, gutter and text line up. */
export const StackedUnderCodeBlock: Story = {
  args: { defaultValue: sampleTypeScript },
  render: () => (
    <Stack gap={4} w="full">
      <CodeBlock
        code={sampleTypeScript}
        language="tsx"
        filename="counter.tsx"
      />
      <CodeEditor
        defaultValue={sampleTypeScript}
        language="tsx"
        filename="counter.tsx"
      />
      <CodeBlock code={sampleTypeScript} language="tsx" showLineNumbers />
      <CodeEditor
        defaultValue={sampleTypeScript}
        language="tsx"
        showLineNumbers
      />
    </Stack>
  ),
};

/* Each container's [data-theme] picks the colors, with no re-highlight. */
export const Themes: Story = {
  args: { defaultValue: sampleTypeScript },
  render: () => (
    <Group gap={4} evenly w="full" ay="start">
      {(["light", "dark"] as const).map((theme) => (
        <Stack key={theme} data-theme={theme} gap={4} p={4} w="full">
          <CodeBlock code={sampleTypeScript} language="tsx" />
          <CodeEditor defaultValue={sampleTypeScript} language="tsx" />
          <CodeEditor
            defaultValue={sampleTypeScript}
            language="tsx"
            filename="counter.tsx"
            showLineNumbers
          />
          <CodeEditor
            defaultValue={sampleTypeScript}
            language="tsx"
            filename="counter.tsx"
            readOnly
          />
          <CodeEditor defaultValue={sampleTypeScript} language="tsx" disabled />
        </Stack>
      ))}
    </Group>
  ),
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

const longLineSample = `const greeting = "hello";
const message = \`\${greeting}, this line is long enough to wrap inside the editor, so the caret, the selection and the colors must wrap at the same point\`;
const docs = "https://example.com/${"averylongpathsegmentwithnobreakpoints/".repeat(8)}end";

console.log(message);`;

/** A line wider than the editor soft-wraps, and the caret stays on the colored text beside the line numbers. */
export const LongLines: Story = {
  args: {
    defaultValue: longLineSample,
    language: "tsx",
    filename: "greeting.tsx",
    showLineNumbers: true,
    copyable: true,
  },
};

/** Read-only dashes the frame's border, a visual cue only; assistive technology reads the textarea's native `readonly`. */
export const ReadOnly: Story = {
  args: {
    defaultValue: sampleTypeScript,
    language: "tsx",
    filename: "counter.tsx",
    readOnly: true,
    copyable: true,
  },
};

/** Focus on the textarea draws the form-control focus ring around the frame, not inside it. */
export const Focused: Story = {
  args: {
    defaultValue: sampleTypeScript,
    language: "tsx",
    filename: "counter.tsx",
    TextareaProps: { autoFocus: true },
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
        <Text size={-1} emphasis="muted">
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
