"use client";

import { useEffect, useState } from "react";

/** Sub-pixel slack, so fractional layout doesn't read as overflow. */
const THRESHOLD = 1;

/**
 * Whether the dialog body's content is taller than the body, so it scrolls.
 * One ResizeObserver watches the body, for viewport changes, and its children,
 * for content that grows or shrinks without resizing the body.
 *
 * Returns a callback ref, since the body mounts with the portal, not with the
 * component that calls this.
 */
export const useBodyOverflow = () => {
  const [body, setBody] = useState<HTMLDivElement | null>(null);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    if (!body) return;

    const measure = () =>
      setOverflows(body.scrollHeight - body.clientHeight > THRESHOLD);

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(body);
    for (const child of body.children) observer.observe(child);

    return () => observer.disconnect();
  }, [body]);

  return { ref: setBody, overflows };
};
