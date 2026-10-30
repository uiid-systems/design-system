import { ChevronDownIcon } from "@uiid/icons/chevron-down";
import { WrenchIcon } from "@uiid/icons/wrench";
import { Badge } from "@uiid/indicators";
import {
  CollapsiblePanel,
  CollapsibleRoot,
  CollapsibleTrigger,
} from "@uiid/interactive";
import { Group, Stack } from "@uiid/layout";
import { Prose, Text } from "@uiid/typography";
import { cx, cxState } from "@uiid/utils";
import { isValidElement } from "react";

import { TOOL_STATES } from "./tool.constants";
import type { ToolPart, ToolProps } from "./tool.types";

import shared from "../shared/collapsible-trigger.module.css";
import styles from "./tool.module.css";

const toolName = (part: ToolPart) =>
  part.title ?? part.toolName ?? part.type.replace(/^tool-/, "");

/* Prose already styles a `pre` the way Markdown renders a fence: the surface
   fill, the mono face and horizontal scroll. So the tool body matches a fenced
   block in the reply above it, at no bundle cost. */
const ToolCode = ({ children }: { children: string }) => (
  <Prose data-slot="tool-code">
    <pre>
      <code>{children}</code>
    </pre>
  </Prose>
);

const ToolSection = ({
  slot,
  heading,
  children,
}: {
  slot: string;
  heading: string;
  children: React.ReactNode;
}) => (
  <Stack data-slot={slot} gap={2} ax="stretch">
    <Text size={-1} weight="medium" color="neutral" uppercase>
      {heading}
    </Text>
    {children}
  </Stack>
);

export const Tool = ({
  part,
  fullwidth = true,
  ax = "stretch",
  b = 1,
  className,
  children,
  ...props
}: ToolProps) => {
  const status = TOOL_STATES[part.state];
  const StatusIcon = status.icon;
  const { input, output, errorText } = part;

  return (
    <CollapsibleRoot
      data-slot="tool"
      data-state={part.state}
      fullwidth={fullwidth}
      ax={ax}
      b={b}
      className={cxState(styles["tool"], className)}
      {...props}
    >
      <CollapsibleTrigger
        data-slot="tool-trigger"
        nativeButton={false}
        className={cx(shared["trigger"], styles["trigger"])}
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
            <StatusIcon data-animate={status.spin ? "spin" : undefined} />
            {status.label}
          </Badge>
        </Group>
        <ChevronDownIcon className={shared["chevron"]} />
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
            {input !== undefined && (
              <ToolSection slot="tool-input" heading="Parameters">
                <ToolCode>{JSON.stringify(input, null, 2)}</ToolCode>
              </ToolSection>
            )}
            {(output !== undefined || errorText) && (
              <ToolSection
                slot="tool-output"
                heading={errorText ? "Error" : "Result"}
              >
                {errorText && <Text color="red">{errorText}</Text>}
                {isValidElement(output)
                  ? output
                  : output !== undefined && (
                      <ToolCode>
                        {typeof output === "string"
                          ? output
                          : JSON.stringify(output, null, 2)}
                      </ToolCode>
                    )}
              </ToolSection>
            )}
          </>
        )}
      </CollapsiblePanel>
    </CollapsibleRoot>
  );
};
Tool.displayName = "Tool";
