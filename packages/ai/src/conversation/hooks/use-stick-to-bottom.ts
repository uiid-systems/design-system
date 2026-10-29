"use client";

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";

import { CONVERSATION_SCROLL_THRESHOLD } from "../conversation.constants";
import type { UseStickToBottomReturn } from "../conversation.types";

/**
 * Keeps a scroll container pinned to its newest content until the reader
 * scrolls up, and offers a way back down. Attach `scrollRef` to the element
 * that scrolls and `contentRef` to the element that grows.
 *
 * Pinned state is one boolean. A `ResizeObserver` on both elements jumps to
 * the bottom while pinned, which also performs the initial scroll, since an
 * observer notifies once on `observe()`. A scroll listener applies one rule:
 * within the threshold of the bottom pins; a lower `scrollTop` than the last
 * event's releases; anything else leaves the state alone. That is enough to
 * tell a reader scrolling up from a smooth scroll in progress (which only
 * raises `scrollTop`) and from the browser clamping `scrollTop` after content
 * shrinks (which lands at the bottom).
 */
export const useStickToBottom = (): UseStickToBottomReturn => {
  /* Callback refs into state, so the effect re-runs if the content mounts
     after the container does. */
  const [scroll, setScroll] = useState<HTMLElement | null>(null);
  const [content, setContent] = useState<HTMLElement | null>(null);

  /* The ref is what the listeners read; the state is what renders. */
  const pinned = useRef(true);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const setPinned = useCallback((next: boolean) => {
    if (pinned.current === next) return;
    pinned.current = next;
    setIsAtBottom(next);
  }, []);

  /* A layout effect so the observer attaches before first paint: its initial
     notification then scrolls to the bottom before the reader sees the top. */
  useLayoutEffect(() => {
    if (!scroll || !content) return;

    let lastScrollTop = scroll.scrollTop;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scroll;
      const distance = scrollHeight - scrollTop - clientHeight;

      if (distance <= CONVERSATION_SCROLL_THRESHOLD) setPinned(true);
      else if (scrollTop < lastScrollTop) setPinned(false);

      lastScrollTop = scrollTop;
    };

    const observer = new ResizeObserver(() => {
      if (pinned.current) {
        scroll.scrollTo({ top: scroll.scrollHeight, behavior: "instant" });
      }
    });

    observer.observe(scroll);
    observer.observe(content);
    scroll.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      scroll.removeEventListener("scroll", handleScroll);
    };
  }, [scroll, content, setPinned]);

  /* No `behavior`, so the element's CSS `scroll-behavior` decides. */
  const scrollToBottom = useCallback(() => {
    setPinned(true);
    scroll?.scrollTo({ top: scroll.scrollHeight });
  }, [scroll, setPinned]);

  return useMemo(
    () => ({
      scrollRef: setScroll,
      contentRef: setContent,
      isAtBottom,
      scrollToBottom,
    }),
    [isAtBottom, scrollToBottom],
  );
};
