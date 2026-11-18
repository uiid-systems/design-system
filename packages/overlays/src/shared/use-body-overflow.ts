"use client";

import { useEffect, useState } from "react";

/** Sub-pixel slack, so fractional layout doesn't read as overflow. */
const THRESHOLD = 1;

/**
 * Whether a popup body's content is taller than the body, so it scrolls. Pair
 * it with `composes-popup-scroll-body` (@uiid/tokens compositions.css), and
 * make the body a tab stop while it overflows, so the keyboard can scroll it.
 * One ResizeObserver watches the body, for viewport changes, and its children,
 * for content that grows or shrinks without resizing the body.
 *
 * While focus is inside the body it keeps reporting overflow, since dropping
 * the body's tab stop under focus would send focus to the document. It
 * re-measures when focus leaves, and drops it then.
 *
 * Returns a callback ref, since the body mounts with the portal, not with the
 * component that calls this.
 */
export const useBodyOverflow = () => {
  const [body, setBody] = useState<HTMLDivElement | null>(null);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    if (!body) return;

    const measure = () => {
      const next = body.scrollHeight - body.clientHeight > THRESHOLD;
      if (!next && body.contains(document.activeElement)) return;
      setOverflows(next);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(body);
    for (const child of body.children) observer.observe(child);
    body.addEventListener("focusout", measure);

    return () => {
      observer.disconnect();
      body.removeEventListener("focusout", measure);
    };
  }, [body]);

  return { ref: setBody, overflows };
};
