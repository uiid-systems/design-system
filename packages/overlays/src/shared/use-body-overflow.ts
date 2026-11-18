"use client";

import type { CardProps } from "@uiid/cards";
import { useEffect, useState } from "react";

/** Sub-pixel slack, so fractional layout doesn't read as overflow. */
const THRESHOLD = 1;

/**
 * The props for a popup's scrolling body, Card's inner container. Pair them
 * with `composes-popup-scroll-body` (@uiid/tokens compositions.css). While the
 * body's content is taller than the body, the body is a tab stop, so the
 * keyboard can scroll it, and a region named by `labelledBy`, the popup
 * title's id, so a screen reader announces where it landed. With no title it
 * stays a plain tab stop: a region with no name is not a landmark.
 *
 * One ResizeObserver watches the body, for viewport changes, and its children,
 * for content that grows or shrinks without resizing the body. A
 * MutationObserver adds children appended later, which would otherwise go
 * unmeasured once the body sits at its cap and stops resizing.
 *
 * While focus is inside the body it keeps reporting overflow, since dropping
 * the body's tab stop under focus would send focus to the document. It
 * re-measures when focus leaves, and drops it then.
 *
 * The ref is a callback ref, since the body mounts with the portal, not with
 * the component that calls this.
 */
export const useBodyOverflow = (labelledBy?: string) => {
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
    const resizes = new ResizeObserver(measure);
    resizes.observe(body);
    for (const child of body.children) resizes.observe(child);

    const mutations = new MutationObserver((records) => {
      for (const { addedNodes, removedNodes } of records) {
        for (const node of removedNodes) {
          if (node instanceof Element) resizes.unobserve(node);
        }
        for (const node of addedNodes) {
          if (node instanceof Element) resizes.observe(node);
        }
      }
      measure();
    });
    mutations.observe(body, { childList: true });
    body.addEventListener("focusout", measure);

    return () => {
      resizes.disconnect();
      mutations.disconnect();
      body.removeEventListener("focusout", measure);
    };
  }, [body]);

  const bodyProps: CardProps["InnerContainerProps"] = {
    // The body stretches past the card's padding to its edges, which Card's
    // `w="full"` of the content box would stop short of.
    w: undefined,
    ref: setBody,
    ...(overflows && {
      tabIndex: 0,
      ...(labelledBy && { role: "region", "aria-labelledby": labelledBy }),
    }),
  };

  return bodyProps;
};
