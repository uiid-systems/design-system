"use client";

import { WrenchIcon } from "@uiid/icons/wrench";
import { Badge } from "@uiid/indicators";
import { CollapsiblePanel, CollapsibleRoot } from "@uiid/interactive";
import { Group, Stack } from "@uiid/layout";
import { Prose, Text } from "@uiid/typography";
import { cxState } from "@uiid/utils";
import { Children, Fragment, isValidElement, useMemo } from "react";

import { CollapsibleTrigger } from "../shared/collapsible-trigger/collapsible-trigger";
import { TOOL_STATES } from "./tool.constants";
import type { ToolPart, ToolProps } from "./tool.types";

import styles from "./tool.module.css";

const toolName = (part: ToolPart) =>
  part.title ?? part.toolName ?? part.type.replace(/^tool-/, "");

/* Total: `String` throws on an object with no prototype, which has no
   `toString`. */
const toText = (value: unknown) => {
  try {
    return String(value);
  } catch {
    return "[object Object]";
  }
};

/* `JSON.stringify` throws on a BigInt or a cycle, either of which a hand-built
   part can carry, often as one field among many. The replacer writes a BigInt
   as its digits and a reference back to an ancestor as "[Circular]", so the
   rest of the value still prints. `this` is the object holding `value`, which
   tells how far up the ancestors the walk has come back; a value that merely
   appears twice is printed twice. */
const toJson = (value: unknown) => {
  const ancestors: unknown[] = [];
  function replacer(this: unknown, _key: string, value: unknown) {
    if (typeof value === "bigint") return value.toString();
    if (typeof value !== "object" || value === null) return value;
    while (ancestors.length > 0 && ancestors.at(-1) !== this) ancestors.pop();
    if (ancestors.includes(value)) return "[Circular]";
    ancestors.push(value);
    return value;
  }

  /* `undefined` for a function or a symbol; a `toJSON` can still throw. */
  try {
    return JSON.stringify(value, replacer, 2) ?? toText(value);
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
  <Stack data-slot={slot} gap={2}>
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
        fullwidth
        ax="space-between"
        p={3}
        className={styles["trigger"]}
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
      </CollapsibleTrigger>
      {/* `w="full"` keeps the panel the card's width whatever `ax` the root
          takes, so its code blocks scroll rather than overflow the card. */}
      <CollapsiblePanel data-slot="tool-panel" w="full" instant={false}>
        {/* The padding sits here rather than on the panel, where `border-box`
            would stop the closing height at the padding instead of zero. */}
        <Stack data-slot="tool-body" gap={4} p={4}>
          {isEmpty(children) ? (
            <ToolBody
              input={part.input}
              output={part.output}
              errorText={part.errorText}
            />
          ) : (
            children
          )}
        </Stack>
      </CollapsiblePanel>
    </CollapsibleRoot>
  );
};
Tool.displayName = "Tool";
