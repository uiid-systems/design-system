"use client";

import { BrainIcon } from "@uiid/icons/brain";
import { ChevronDownIcon } from "@uiid/icons/chevron-down";
import {
  CollapsiblePanel,
  CollapsibleRoot,
  CollapsibleTrigger,
} from "@uiid/interactive";
import { Group } from "@uiid/layout";
import { Shimmer, Text } from "@uiid/typography";
import { cx } from "@uiid/utils";
import { useEffect, useState } from "react";

import { Markdown } from "../markdown/markdown";
import { REASONING_AUTO_CLOSE_DELAY } from "./reasoning.constants";
import type { ReasoningProps } from "./reasoning.types";

import shared from "../shared/collapsible-trigger.module.css";
import styles from "./reasoning.module.css";

const reasoningLabel = (seconds?: number) => {
  if (!seconds) return "Reasoning";
  return `Thought for ${seconds} ${seconds === 1 ? "second" : "seconds"}`;
};

export const Reasoning = ({
  children,
  streaming = false,
  duration,
  open: openProp,
  defaultOpen,
  onOpenChange,
  gap = 2,
  ax = "start",
  ...props
}: ReasoningProps) => {
  const controlled = openProp !== undefined;
  const [localOpen, setLocalOpen] = useState(defaultOpen ?? streaming);
  const open = controlled ? openProp : localOpen;
  const [measured, setMeasured] = useState<number>();

  // An uncontrolled block opens when a stream starts, unless the caller asked
  // for it closed. A controlled `open` is the caller's alone.
  const autoOpen = !controlled && defaultOpen !== false;
  useEffect(() => {
    if (streaming && autoOpen) setLocalOpen(true);
  }, [streaming, autoOpen]);

  // Time the stream: the cleanup runs when `streaming` turns off.
  useEffect(() => {
    if (!streaming) return;
    const start = Date.now();
    return () => setMeasured(Math.ceil((Date.now() - start) / 1000));
  }, [streaming]);

  // Once a stream has ended, close a beat later, so the finished text is seen
  // before it folds away.
  useEffect(() => {
    if (streaming || controlled || measured === undefined) return;
    const id = setTimeout(
      () => setLocalOpen(false),
      REASONING_AUTO_CLOSE_DELAY,
    );
    return () => clearTimeout(id);
  }, [streaming, controlled, measured]);

  const label = reasoningLabel(duration ?? measured);

  return (
    <CollapsibleRoot
      data-slot="reasoning"
      data-streaming={streaming ? "" : undefined}
      open={open}
      onOpenChange={(next, details) => {
        onOpenChange?.(next, details);
        if (!controlled) setLocalOpen(next);
      }}
      gap={gap}
      ax={ax}
      {...props}
    >
      <CollapsibleTrigger
        data-slot="reasoning-trigger"
        nativeButton={false}
        className={cx(shared["trigger"], styles["trigger"])}
        render={<Group gap={2} ay="center" />}
      >
        <BrainIcon />
        {streaming ? <Shimmer>Thinking…</Shimmer> : <Text>{label}</Text>}
        <ChevronDownIcon className={shared["chevron"]} />
      </CollapsibleTrigger>
      <CollapsiblePanel
        data-slot="reasoning-panel"
        fullwidth
        instant={false}
        ax="stretch"
      >
        <Markdown streaming={streaming}>{children}</Markdown>
      </CollapsiblePanel>
    </CollapsibleRoot>
  );
};
