import { Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { isValidElement } from "react";

import { TOOL_LABELS } from "../tool.constants";
import { ToolCode } from "./tool-code";
import { ToolHeading } from "./tool-heading";

const renderOutput = (output: unknown) => {
  if (isValidElement(output)) return output;
  const text =
    typeof output === "string" ? output : JSON.stringify(output, null, 2);
  return <ToolCode>{text}</ToolCode>;
};

export const ToolOutput = ({
  output,
  errorText,
}: {
  output: unknown;
  errorText?: string;
}) => {
  if (output === undefined && !errorText) return null;

  return (
    <Stack data-slot="tool-output" gap={2} ax="stretch">
      <ToolHeading>
        {errorText ? TOOL_LABELS.error : TOOL_LABELS.output}
      </ToolHeading>
      {errorText && <Text color="red">{errorText}</Text>}
      {output !== undefined && renderOutput(output)}
    </Stack>
  );
};
ToolOutput.displayName = "ToolOutput";
