"use client";

import { Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";
import * as React from "react";

import { CodeEditor } from "./code-editor";

const SAMPLE = `function greet(name: string) {
  return \`Hello, \${name}!\`;
}`;

export const Default = () => <CodeEditor defaultValue={SAMPLE} />;

export const WithFilename = () => (
  <CodeEditor defaultValue={SAMPLE} filename="greet.ts" />
);

export const LineNumbers = () => (
  <CodeEditor defaultValue={SAMPLE} showLineNumbers />
);

export const ReadOnly = () => (
  <CodeEditor defaultValue={SAMPLE} filename="greet.ts" readOnly />
);

export const Placeholder = () => (
  <CodeEditor placeholder="Write some TypeScript…" copyable={false} />
);

export const Controlled = () => {
  const [value, setValue] = React.useState(SAMPLE);
  return (
    <Stack gap={2}>
      <CodeEditor value={value} onValueChange={setValue} filename="greet.ts" />
      <Text size={-1} shade="muted">
        {value.length} characters
      </Text>
    </Stack>
  );
};

export const Languages = () => (
  <Stack gap={4}>
    <CodeEditor
      defaultValue={`{\n  "name": "@uiid/code"\n}`}
      language="json"
      filename="package.json"
    />
    <CodeEditor
      defaultValue={`def greet(name):\n    return f"Hello, {name}!"`}
      language="python"
      filename="greet.py"
    />
  </Stack>
);
