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
import { useEffect, useRef, useState } from "react";

import { Markdown } from "../markdown/markdown";
import {
  REASONING_AUTO_CLOSE_DELAY,
  REASONING_LABELS,
  reasoningLabel,
} from "./reasoning.constants";
import type { ReasoningProps } from "./reasoning.types";

import styles from "./reasoning.module.css";

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
  const startedAt = useRef<number | null>(null);
  const autoClosed = useRef(false);

  // An uncontrolled block opens when a stream starts, unless the caller asked
  // for it closed. A controlled `open` is the caller's alone.
  const autoOpen = !controlled && defaultOpen !== false;
  useEffect(() => {
    if (streaming && autoOpen) setLocalOpen(true);
  }, [streaming, autoOpen]);

  // Time the stream. When it ends, read the duration and close once, a beat
  // later, so the finished text is seen before it folds away.
  useEffect(() => {
    if (streaming) {
      startedAt.current = Date.now();
      return;
    }
    if (startedAt.current === null) return;

    setMeasured(Math.ceil((Date.now() - startedAt.current) / 1000));
    startedAt.current = null;
    if (controlled || autoClosed.current) return;

    const id = setTimeout(() => {
      autoClosed.current = true;
      setLocalOpen(false);
    }, REASONING_AUTO_CLOSE_DELAY);
    return () => clearTimeout(id);
  }, [streaming, controlled]);

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
        className={styles["trigger"]}
        render={<Group gap={2} ay="center" />}
      >
        <BrainIcon />
        {streaming ? (
          <Shimmer>{REASONING_LABELS.thinking}</Shimmer>
        ) : (
          <Text>{label}</Text>
        )}
        <ChevronDownIcon className={styles["chevron"]} />
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
