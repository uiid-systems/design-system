"use client";

import { BrainIcon } from "@uiid/icons/brain";
import { CollapsiblePanel, CollapsibleRoot } from "@uiid/interactive";
import { Markdown } from "@uiid/markdown";
import { Shimmer, Text } from "@uiid/typography";
import { useEffect, useLayoutEffect, useState } from "react";

import { CollapsibleTrigger } from "../shared/collapsible-trigger/collapsible-trigger";
import { REASONING_AUTO_CLOSE_DELAY } from "./reasoning.constants";
import type { ReasoningProps } from "./reasoning.types";

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

  // Time the stream: the cleanup runs when `streaming` turns off. A layout
  // effect, so the measured label lands before paint instead of a frame of
  // "Reasoning" between "Thinking…" and "Thought for N seconds".
  useLayoutEffect(() => {
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
      // The root is always controlled from here, so Base UI's own skip on
      // `details.cancel()` never reaches `localOpen`; honor it by hand.
      onOpenChange={(next, details) => {
        onOpenChange?.(next, details);
        if (!controlled && !details.isCanceled) setLocalOpen(next);
      }}
      gap={gap}
      ax={ax}
      {...props}
    >
      <CollapsibleTrigger
        data-slot="reasoning-trigger"
        className={styles["trigger"]}
      >
        <BrainIcon aria-hidden />
        {streaming ? <Shimmer>Thinking…</Shimmer> : <Text>{label}</Text>}
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
