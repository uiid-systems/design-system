import { ChevronDownIcon } from "@uiid/icons/chevron-down";
import { WrenchIcon } from "@uiid/icons/wrench";
import { Badge } from "@uiid/indicators";
import {
  CollapsiblePanel,
  CollapsibleRoot,
  CollapsibleTrigger,
} from "@uiid/interactive";
import { Group } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { cxState } from "@uiid/utils";

import { ToolInput, ToolOutput } from "./subcomponents";
import { TOOL_STATES } from "./tool.constants";
import type { ToolPart, ToolProps } from "./tool.types";

import styles from "./tool.module.css";

const toolName = (part: ToolPart) =>
  part.title ?? part.toolName ?? part.type.replace(/^tool-/, "");

export const Tool = ({
  part,
  fullwidth = true,
  b = 1,
  className,
  children,
  ...props
}: ToolProps) => {
  const status = TOOL_STATES[part.state];
  const StatusIcon = status.icon;

  return (
    <CollapsibleRoot
      data-slot="tool"
      data-state={part.state}
      fullwidth={fullwidth}
      b={b}
      className={cxState(styles["tool"], className)}
      {...props}
    >
      <CollapsibleTrigger
        data-slot="tool-trigger"
        nativeButton={false}
        className={styles["trigger"]}
        render={
          <Group fullwidth ax="space-between" ay="center" gap={2} p={3} />
        }
      >
        <Group gap={2} ay="center">
          <WrenchIcon />
          <Text weight="medium">{toolName(part)}</Text>
          <Badge
            data-slot="tool-status"
            size="small"
            color={status.color}
            className={styles["status"]}
          >
            <StatusIcon className={status.spin ? styles["spin"] : undefined} />
            {status.label}
          </Badge>
        </Group>
        <ChevronDownIcon className={styles["chevron"]} />
      </CollapsibleTrigger>
      <CollapsiblePanel
        data-slot="tool-panel"
        instant={false}
        ax="stretch"
        gap={4}
        p={4}
      >
        {children ?? (
          <>
            <ToolInput input={part.input} />
            <ToolOutput output={part.output} errorText={part.errorText} />
          </>
        )}
      </CollapsiblePanel>
    </CollapsibleRoot>
  );
};
Tool.displayName = "Tool";
