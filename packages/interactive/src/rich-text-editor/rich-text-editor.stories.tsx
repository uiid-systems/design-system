import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { Content } from "@tiptap/react";

import { RichTextEditor } from "./rich-text-editor";

const meta = {
  title: "Interactive/Rich Text Editor",
  component: RichTextEditor,
  tags: ["new"],
  parameters: {
    layout: "padded",
  },
  args: {
    placeholder: "Start typing...",
    output: "html",
  },
} satisfies Meta<typeof RichTextEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

const RichTextEditorDemo = () => {
  const [value, setValue] = useState<Content>("");

  return (
    <div style={{ maxWidth: 720 }}>
      <RichTextEditor
        value={value}
        onChange={setValue}
        placeholder="Write something amazing..."
        output="html"
        editorContentClassName="p-4 min-h-48"
      />
      <details style={{ marginTop: 16 }}>
        <summary style={{ cursor: "pointer", opacity: 0.7 }}>
          View output
        </summary>
        <pre
          style={{
            padding: 16,
            background: "var(--shade-muted)",
            borderRadius: 8,
            marginTop: 8,
            overflow: "auto",
            fontSize: 12,
          }}
        >
          {typeof value === "string" ? value : JSON.stringify(value, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export const Default: Story = {
  name: "Rich Text Editor",
  render: () => <RichTextEditorDemo />,
};
