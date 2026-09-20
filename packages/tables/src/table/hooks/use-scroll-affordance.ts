"use client";

import { useEffect, useRef, useState } from "react";

/** Sub-pixel slack — fractional layout and browser zoom leave scroll offsets a
 * hair off their true min/max, which would otherwise pin a shadow on forever. */
const THRESHOLD = 1;

type ScrollEdges = {
  /** Content is scrolled away from the inline start edge. */
  start: boolean;
  /** Content remains past the inline end edge. */
  end: boolean;
};

const NO_EDGES: ScrollEdges = { start: false, end: false };

/**
 * Tracks which inline edges of a scroll container have content beyond them, so
 * the container can render an edge shadow only when there is somewhere to
 * scroll. Returns a ref for the scroll container and the data attributes to
 * spread onto whichever element paints the shadows.
 */
export const useScrollAffordance = () => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState<ScrollEdges>(NO_EDGES);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const measure = () => {
      /* scrollLeft counts up in LTR and down from zero in RTL, so comparing on
         magnitude keeps start/end logical rather than left/right. */
      const offset = Math.abs(scroller.scrollLeft);
      const max = scroller.scrollWidth - scroller.clientWidth;

      setEdges((previous) => {
        const start = offset > THRESHOLD;
        const end = offset < max - THRESHOLD;

        return previous.start === start && previous.end === end
          ? previous
          : { start, end };
      });
    };

    measure();
    scroller.addEventListener("scroll", measure, { passive: true });

    /* Observe the container for viewport changes and its content for width
       changes — rows can be added or removed without the container resizing. */
    const observer = new ResizeObserver(measure);
    observer.observe(scroller);
    if (scroller.firstElementChild)
      observer.observe(scroller.firstElementChild);

    return () => {
      scroller.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, []);

  return {
    scrollerRef,
    scrollState: {
      "data-scroll-start": edges.start || undefined,
      "data-scroll-end": edges.end || undefined,
    },
  };
};
