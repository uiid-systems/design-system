"use client";

import * as React from "react";

/** Sub-pixel slack, so fractional layout doesn't read as overflow. */
const THRESHOLD = 1;

const SCROLLS = new Set(["auto", "scroll"]);

/** Whether `el` scrolls on either axis: it is a scroller with more to show. */
const overflows = (el: HTMLElement) => {
  const style = getComputedStyle(el);
  return (
    (SCROLLS.has(style.overflowX) &&
      el.scrollWidth - el.clientWidth > THRESHOLD) ||
    (SCROLLS.has(style.overflowY) &&
      el.scrollHeight - el.clientHeight > THRESHOLD)
  );
};

/**
 * Whether the element given to `ref` has code to scroll to, sideways or, in the
 * fullscreen view, down. Modelled on `@uiid/overlays`' `useBodyOverflow`, which
 * that package keeps internal.
 *
 * One ResizeObserver watches the element, for container and wrap changes, and
 * its children, for code that grows or shrinks without resizing it. A
 * MutationObserver adds children that replace them, as new highlighted markup
 * does.
 *
 * While focus is inside the element it keeps reporting overflow, since dropping
 * the tab stop under focus would send focus to the document. It re-measures
 * when focus leaves, and drops it then.
 */
export const useScrollOverflow = () => {
  const [node, setNode] = React.useState<HTMLElement | null>(null);
  const [scrolls, setScrolls] = React.useState(false);

  React.useEffect(() => {
    if (!node) return;

    const measure = () => {
      const next = overflows(node);
      if (!next && node.contains(document.activeElement)) return;
      setScrolls(next);
    };

    measure();
    const resizes = new ResizeObserver(measure);
    resizes.observe(node);
    for (const child of node.children) resizes.observe(child);

    const mutations = new MutationObserver((records) => {
      for (const { addedNodes, removedNodes } of records) {
        for (const child of removedNodes) {
          if (child instanceof Element) resizes.unobserve(child);
        }
        for (const child of addedNodes) {
          if (child instanceof Element) resizes.observe(child);
        }
      }
      measure();
    });
    mutations.observe(node, { childList: true });
    node.addEventListener("focusout", measure);

    return () => {
      resizes.disconnect();
      mutations.disconnect();
      node.removeEventListener("focusout", measure);
    };
  }, [node]);

  return { ref: setNode, scrolls };
};
