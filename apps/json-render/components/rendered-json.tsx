import { Button } from "@uiid/buttons";
import { CodeEditor, type CodeEditorProps } from "@uiid/code";
import { Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

export type RenderedJsonProps = Omit<
  CodeEditorProps,
  "language" | "filename"
> & {
  parseError?: string | null;
  onApply?: () => void;
};

export const RenderedJson = ({
  parseError,
  onApply,
  ...props
}: RenderedJsonProps) => {
  return (
    <Stack gap={3} fullwidth>
      <CodeEditor
        language="json"
        filename="ui-tree.json"
        rows={20}
        {...props}
      />
      {parseError && <Text tone="critical">Parse Error: {parseError}</Text>}
      {onApply && (
        <Button onClick={onApply} fullwidth>
          Apply Changes
        </Button>
      )}
    </Stack>
  );
};
RenderedJson.displayName = "RenderedJson";
