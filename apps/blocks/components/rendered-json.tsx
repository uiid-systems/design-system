import { CodeEditor, type CodeEditorProps } from "@uiid/code";
import { Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

export type RenderedJsonProps = Omit<
  CodeEditorProps,
  "language" | "filename"
> & {
  parseError?: string | null;
};

export const RenderedJson = ({
  parseError,
  ...props
}: RenderedJsonProps) => {
  return (
    <Stack gap={3} fullwidth>
      <CodeEditor
        language="json"
        filename="ui-tree.json"
        rows={24}
        {...props}
      />
      {parseError && <Text tone="critical">Parse Error: {parseError}</Text>}
    </Stack>
  );
};
RenderedJson.displayName = "RenderedJson";
