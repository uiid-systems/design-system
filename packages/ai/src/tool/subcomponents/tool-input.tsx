import { Stack } from "@uiid/layout";

import { TOOL_LABELS } from "../tool.constants";
import { ToolCode } from "./tool-code";
import { ToolHeading } from "./tool-heading";

export const ToolInput = ({ input }: { input: unknown }) => {
  if (input === undefined) return null;

  return (
    <Stack data-slot="tool-input" gap={2} ax="stretch">
      <ToolHeading>{TOOL_LABELS.input}</ToolHeading>
      <ToolCode>{JSON.stringify(input, null, 2)}</ToolCode>
    </Stack>
  );
};
ToolInput.displayName = "ToolInput";
