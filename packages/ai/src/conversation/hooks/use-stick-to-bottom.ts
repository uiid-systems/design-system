"use client";

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";

import {
  CONVERSATION_BOTTOM_EPSILON,
  CONVERSATION_SCROLL_THRESHOLD,
} from "../conversation.constants";
import type { UseStickToBottomReturn } from "../conversation.types";

/**
 * Keeps a scroll container pinned to its newest content until the reader
 * scrolls up, and offers a way back down. Attach `scrollRef` to the element
 * that scrolls and `contentRef` to the element that grows.
 *
 * Pinned state is one boolean. A `ResizeObserver` on both elements jumps to
 * the bottom while pinned, which also performs the initial scroll, since an
 * observer notifies once on `observe()`. A scroll listener applies one rule:
 * a lower `scrollTop` than the last event's, short of the bottom, releases;
 * otherwise within the threshold of the bottom pins; anything else leaves the
 * state alone. Release comes first so a small step up (an arrow key, a slow
 * trackpad) lets go before the next resize jumps back down. That is enough to
 * tell a reader scrolling up from a smooth scroll in progress (which only
 * raises `scrollTop`) and from the browser clamping `scrollTop` after content
 * shrinks (which lands at the bottom).
 *
 * A resize can also bring a released reader to the bottom without moving
 * `scrollTop` (the viewport grows, or content shrinks until it fits), and no
 * scroll event follows, so the observer re-pins in that case itself.
 */
export const useStickToBottom = (): UseStickToBottomReturn => {
  /* Callback refs into state, so the effect re-runs if the content mounts
     after the container does. */
  const [scroll, setScroll] = useState<HTMLElement | null>(null);
  const [content, setContent] = useState<HTMLElement | null>(null);

  /* The ref is what the listeners read; the state is what renders. */
  const pinned = useRef(true);
  const [isAtBottom, setIsAtBottom] = useState(true);

  /* The scroll listener's direction baseline. Every instant jump refreshes it,
     since the jump's scroll event is queued: if the reader scrolls up before it
     runs, comparing against the pre-jump position would miss the release. */
  const lastScrollTop = useRef(0);

  const setPinned = useCallback((next: boolean) => {
    if (pinned.current === next) return;
    pinned.current = next;
    setIsAtBottom(next);
  }, []);

  /* A layout effect so the observer attaches before first paint: its initial
     notification then scrolls to the bottom before the reader sees the top. */
  useLayoutEffect(() => {
    if (!scroll || !content) return;

    lastScrollTop.current = scroll.scrollTop;

    const distanceFromBottom = () =>
      scroll.scrollHeight - scroll.scrollTop - scroll.clientHeight;

    const handleScroll = () => {
      const { scrollTop } = scroll;
      const distance = distanceFromBottom();

      if (
        scrollTop < lastScrollTop.current &&
        distance > CONVERSATION_BOTTOM_EPSILON
      ) {
        setPinned(false);
      } else if (distance <= CONVERSATION_SCROLL_THRESHOLD) {
        setPinned(true);
      }

      lastScrollTop.current = scrollTop;
    };

    const observer = new ResizeObserver(() => {
      if (!pinned.current) {
        if (distanceFromBottom() > CONVERSATION_BOTTOM_EPSILON) return;
        setPinned(true);
      }
      scroll.scrollTo({ top: scroll.scrollHeight, behavior: "instant" });
      lastScrollTop.current = scroll.scrollTop;
    });

    observer.observe(scroll);
    observer.observe(content);
    scroll.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      scroll.removeEventListener("scroll", handleScroll);
    };
  }, [scroll, content, setPinned]);

  /* No `behavior`, so the element's CSS `scroll-behavior` decides. Under
     reduced motion that is an instant jump, so the baseline is refreshed after
     it; a smooth scroll hasn't moved yet, which leaves the baseline as it was. */
  const scrollToBottom = useCallback(() => {
    setPinned(true);
    if (!scroll) return;
    scroll.scrollTo({ top: scroll.scrollHeight });
    lastScrollTop.current = scroll.scrollTop;
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
