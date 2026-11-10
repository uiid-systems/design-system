"use client";

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
import { Children, Fragment, isValidElement, useMemo } from "react";

import { TOOL_STATES } from "./tool.constants";
import type { ToolPart, ToolProps } from "./tool.types";

import shared from "../shared/collapsible-trigger.module.css";
import styles from "./tool.module.css";

const toolName = (part: ToolPart) =>
  part.title ?? part.toolName ?? part.type.replace(/^tool-/, "");

/* `String` throws on an object with no prototype, which has no `toString`. */
const toText = (value: unknown) => {
  try {
    return String(value);
  } catch {
    return Object.prototype.toString.call(value);
  }
};

/* `JSON.stringify` throws on a BigInt or a cycle and returns `undefined` for a
   function or a symbol, any of which a hand-built part can carry. */
const toJson = (value: unknown) => {
  try {
    return JSON.stringify(value, null, 2) ?? toText(value);
  } catch {
    return toText(value);
  }
};

/* Children whose value holds nothing to render keep the default body, so
   `{state === "x" && <Controls />}` doesn't empty the panel. `toArray` drops
   null, undefined and booleans and flattens arrays, but keeps fragments, so
   those are checked through. A component that renders null can't be seen
   without rendering it, so it still replaces the body. */
const isEmpty = (node: React.ReactNode): boolean =>
  Children.toArray(node).every(
    (child) =>
      child === "" ||
      (isValidElement<{ children?: React.ReactNode }>(child) &&
        child.type === Fragment &&
        isEmpty(child.props.children)),
  );

/* Prose already styles a `pre` the way Markdown renders a fence: the surface
   fill, the mono face and horizontal scroll. So the tool body matches a fenced
   block in the reply above it, at no bundle cost. `tabIndex` lets keyboard
   users reach the `pre` and scroll a long line in Safari, which does not make
   a scroll container focusable on its own. */
const ToolCode = ({ children }: { children: string }) => (
  <Prose data-slot="tool-code">
    <pre tabIndex={0}>
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

/* Its own component so the JSON is only built while the panel is mounted, and
   only again when the part's input or output changes. An element output has no
   text: it renders as itself. */
const ToolBody = ({
  input,
  output,
  errorText,
}: Pick<ToolPart, "input" | "output" | "errorText">) => {
  const inputText = useMemo(
    () => (input === undefined ? undefined : toJson(input)),
    [input],
  );
  const outputText = useMemo(() => {
    if (output === undefined || isValidElement(output)) return undefined;
    return typeof output === "string" ? output : toJson(output);
  }, [output]);

  return (
    <>
      {inputText !== undefined && (
        <ToolSection slot="tool-input" heading="Parameters">
          <ToolCode>{inputText}</ToolCode>
        </ToolSection>
      )}
      {(output !== undefined || errorText) && (
        <ToolSection
          slot="tool-output"
          heading={errorText ? "Error" : "Result"}
        >
          {errorText && (
            <Text color="red" className={styles["error"]}>
              {errorText}
            </Text>
          )}
          {isValidElement(output) && output}
          {outputText !== undefined && <ToolCode>{outputText}</ToolCode>}
        </ToolSection>
      )}
    </>
  );
};

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
        {/* `minw={0}` lets the row shrink below a long name, so the name wraps
            instead of pushing the badge and chevron out of the card. */}
        <Group gap={2} ay="center" minw={0}>
          <WrenchIcon />
          <Text weight="medium" className={styles["name"]}>
            {toolName(part)}
          </Text>
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
        {isEmpty(children) ? (
          <ToolBody
            input={part.input}
            output={part.output}
            errorText={part.errorText}
          />
        ) : (
          children
        )}
      </CollapsiblePanel>
    </CollapsibleRoot>
  );
};
Tool.displayName = "Tool";
