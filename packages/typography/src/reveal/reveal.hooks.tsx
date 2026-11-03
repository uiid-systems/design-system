"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, Key, ReactNode } from "react";

import {
  REVEAL_DEFAULT_BLUR,
  REVEAL_DEFAULT_DURATION,
} from "./reveal.constants";
import { splitWords } from "./reveal.utils";

import styles from "./reveal.module.css";

export type StreamRevealOptions = {
  /** Whether text is still arriving. Words keep animating for `duration` after it stops. */
  streaming: boolean;
  /** Duration of each word's fade/blur-in, in ms */
  duration?: number;
  /** Blur radius each word starts from, in px */
  blur?: number;
};

/** Renders one pass over the visible text, in document order. Make a new one per render. */
export type StreamRevealPass = {
  /** One span per word of a plain text run. */
  text: (text: string, key?: Key) => ReactNode;
  /** A run that can't be split, like inline code, revealed as one piece. */
  unit: (children: ReactNode, length: number, key?: Key) => ReactNode;
  /** Text that shows without animating, like a code block, so later words keep their offsets. */
  skip: (length: number) => void;
};

/**
 * Word reveal for text that is re-rendered as it streams, where a renderer may
 * rebuild elements around words the reader has already seen (a run of text
 * becoming bold once its closing `**` lands).
 *
 * A word is identified by its offset in the visible text, not by its React
 * node, and its first appearance is timestamped. A word that remounts resumes
 * its animation from that timestamp instead of fading in again, and a word
 * whose animation is over renders plain.
 */
export const useStreamReveal = ({
  streaming,
  duration = REVEAL_DEFAULT_DURATION,
  blur = REVEAL_DEFAULT_BLUR,
}: StreamRevealOptions) => {
  const seen = useRef(new Map<number, number>());

  // When streaming stops, the last word has only just appeared and earlier ones may still be
  // fading, so stay active for one more duration before dropping the spans.
  const [wasStreaming, setWasStreaming] = useState(streaming);
  const [settling, setSettling] = useState(false);
  if (streaming !== wasStreaming) {
    setWasStreaming(streaming);
    setSettling(!streaming);
  }

  useEffect(() => {
    if (!settling) return;
    const timer = setTimeout(() => setSettling(false), duration);
    return () => clearTimeout(timer);
  }, [settling, duration]);

  const active = streaming || settling;

  // Forget every word once the reveal is over, so text streamed again into the same instance
  // (a regenerated message) animates from scratch.
  useEffect(() => {
    if (!active) seen.current.clear();
  }, [active]);

  // One stable callback for every span, so React calls it only when a span's DOM node mounts,
  // never on a re-render. Commit runs before paint, so the delay lands before the first frame.
  const onMount = useCallback((el: HTMLSpanElement | null) => {
    const offset = el?.dataset.revealOffset;
    if (!el || offset === undefined) return;

    const now = performance.now();
    const key = Number(offset);
    const first = seen.current.get(key) ?? now;
    seen.current.set(key, first);
    // Negative: a remounted word starts partway through, where its first node had got to.
    el.style.animationDelay = `${first - now}ms`;
  }, []);

  const pass = (): StreamRevealPass => {
    let cursor = 0;
    const now = performance.now();

    const span = (children: ReactNode, length: number, key?: Key) => {
      const offset = cursor;
      cursor += length;
      const first = seen.current.get(offset);
      const settled = first !== undefined && now - first >= duration;

      return settled ? (
        <span key={key}>{children}</span>
      ) : (
        <span
          key={key}
          ref={onMount}
          data-reveal-offset={offset}
          className={styles["reveal-stream"]}
        >
          {children}
        </span>
      );
    };

    return {
      text: (text, key) =>
        splitWords(text).map((word, index) =>
          span(
            word,
            word.length,
            key === undefined ? index : `${key}-${index}`,
          ),
        ),
      unit: (children, length, key) => span(children, length, key),
      skip: (length) => {
        cursor += length;
      },
    };
  };

  const style = {
    "--reveal-duration": `${duration}ms`,
    "--reveal-blur": `${blur}px`,
  } as CSSProperties;

  return { active, pass, style };
};
