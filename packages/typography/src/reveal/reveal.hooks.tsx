"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, Key, ReactNode } from "react";

import {
  REVEAL_DEFAULT_BLUR,
  REVEAL_DEFAULT_DURATION,
  REVEAL_STREAM_CATCH_UP,
  REVEAL_STREAM_EASE,
} from "./reveal.constants";
import {
  advanceWords,
  completeLength,
  countWords,
  splitWords,
} from "./reveal.utils";

import styles from "./reveal.module.css";

/**
 * Shows streamed text a whole word at a time, at an even pace, instead of in
 * the bursts it arrives in. The interval between words is set so that what has
 * arrived but not been shown clears in about `REVEAL_STREAM_CATCH_UP` ms: it
 * speeds up as a burst lands and slows as the backlog drains. While streaming,
 * the unfinished last word is never shown. Once streaming stops the rest drains
 * at the same pace, and the returned `streaming` stays true until it has.
 *
 * Text that no longer starts with what has been shown is a new stream, like a
 * regenerated message, and starts over from nothing. Each new stream increments
 * the returned `streamId`; hand it to `useStreamReveal` so the new words animate.
 */
export const useStreamPace = (text: string, streaming: boolean) => {
  // The text released so far, kept as text so a growing stream changes no state during render:
  // only a new stream does, and each render-phase update makes React render the caller twice.
  const [shown, setShown] = useState(() => (streaming ? "" : text));
  const [streamId, setStreamId] = useState(0);
  if (!text.startsWith(shown)) {
    setShown(streaming ? "" : text);
    setStreamId(streamId + 1);
  }

  const limit = streaming ? completeLength(text) : text.length;
  const from = Math.min(shown.length, limit);
  const backlog = countWords(text, from, limit);
  // While streaming, a list marker, `##` or `>` with no word after it yet waits for that word:
  // shown alone it renders an empty block that unmounts again once the word arrives. When
  // streaming stops nothing more is coming, so it shows.
  const end = backlog || streaming ? from : limit;

  // When this stream's last word went out, and the pace it went out at, in words per ms.
  const last = useRef<{ streamId: number; at: number; rate: number } | null>(
    null,
  );

  useEffect(() => {
    if (!backlog) return;

    const lastRelease =
      last.current?.streamId === streamId ? last.current : null;
    const now = performance.now();
    const target = backlog / REVEAL_STREAM_CATCH_UP;
    // Ease toward the pace the backlog asks for. Jumping to it would swing the gap between words
    // as the backlog moves between one word and a few.
    const rate = lastRelease
      ? lastRelease.rate + (target - lastRelease.rate) * REVEAL_STREAM_EASE
      : target;
    const interval = 1 / rate;
    // The first word goes out at once, as does one arriving after a lull longer than an interval.
    // Every chunk re-runs this effect, so a later word's deadline counts from the last release:
    // counted from `now`, chunks arriving faster than the interval would keep pushing it back.
    const due = lastRelease ? Math.max(lastRelease.at + interval, now) : now;

    const timer = setTimeout(() => {
      const fired = performance.now();
      // Only a timer that fires late (a throttled tab) releases more than one word.
      const count = 1 + Math.floor(Math.max(0, fired - due) / interval);
      last.current = { streamId, at: fired, rate };
      setShown(text.slice(0, advanceWords(text, from, limit, count)));
    }, due - now);

    return () => clearTimeout(timer);
  }, [text, from, limit, backlog, streamId]);

  return {
    text: text.slice(0, end),
    streaming: streaming || end < text.length,
    streamId,
  };
};

export type StreamRevealOptions = {
  /** Whether text is still arriving. Words keep animating for `duration` after it stops. */
  streaming: boolean;
  /** Duration of each word's fade/blur-in, in ms */
  duration?: number;
  /** Blur radius each word starts from, in px */
  blur?: number;
  /**
   * Identifies the stream the text belongs to, like `useStreamPace`'s `streamId`. When it
   * changes every word is forgotten, so a new stream that replaces one still animating fades
   * in from the start.
   */
  streamId?: number;
};

/**
 * Renders one pass over the visible text, in document order. Make a new one per render.
 * While the reveal is inactive, every method hands its content back unchanged.
 */
export type StreamRevealPass = {
  /** One span per word of a plain text run. */
  text: (text: string, key?: Key) => ReactNode;
  /** A run that can't be split, like inline code, revealed as one piece. */
  unit: (children: ReactNode, length: number, key?: Key) => ReactNode;
  /** Text that shows without animating, like a code block, so later words keep their offsets. */
  skip: (length: number) => void;
};

/** The pass used while the reveal is inactive: text renders as it is. */
const plainPass: StreamRevealPass = {
  text: (text) => text,
  unit: (children) => children,
  skip: () => {},
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
  streamId = 0,
}: StreamRevealOptions) => {
  // Each word's first appearance by offset. Mutated in place as words mount; replaced whole when
  // a new stream starts, since its offsets name different words.
  const [seen, setSeen] = useState(() => ({
    streamId,
    words: new Map<number, number>(),
  }));
  if (seen.streamId !== streamId) {
    setSeen({ streamId, words: new Map() });
  }

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
    if (!active) seen.words.clear();
  }, [active, seen]);

  // One stable callback for every span in a stream, so React calls it only when a span's DOM
  // node mounts, never on a re-render. Commit runs before paint, so the delay lands before the
  // first frame.
  const onMount = useCallback(
    (el: HTMLSpanElement | null) => {
      const offset = el?.dataset.revealOffset;
      if (!el || offset === undefined) return;

      const now = performance.now();
      const key = Number(offset);
      const first = seen.words.get(key) ?? now;
      seen.words.set(key, first);
      // Negative: a remounted word starts partway through, where its first node had got to.
      el.style.animationDelay = `${first - now}ms`;
    },
    [seen],
  );

  const pass = (): StreamRevealPass => {
    if (!active) return plainPass;

    let cursor = 0;
    const now = performance.now();

    const span = (children: ReactNode, length: number, key?: Key) => {
      const offset = cursor;
      cursor += length;
      const first = seen.words.get(offset);
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

  const style = active
    ? ({
        "--reveal-duration": `${duration}ms`,
        "--reveal-blur": `${blur}px`,
      } as CSSProperties)
    : undefined;

  return { active, pass, style };
};
