"use client";

import { List, Stack, Text } from "@uiid/design-system";
import type { ListItemOrGroup } from "@uiid/design-system";
import { useCallback, useMemo, useSyncExternalStore } from "react";

type TocNode = {
  id: string;
  label: string;
  children: TocNode[];
};

/** Scans <main> for anchored sections (h2/h3 headings, example frames). */
const scanToc = (): TocNode[] => {
  const main = document.querySelector("main");
  if (!main) return [];

  const nodes = main.querySelectorAll<HTMLElement>(
    "h2[id], h3[id], [data-slot='example'][id]",
  );

  const sections: TocNode[] = [];
  nodes.forEach((node) => {
    const label = node.dataset.title ?? node.textContent ?? node.id;
    const entry: TocNode = { id: node.id, label, children: [] };
    if (node.tagName !== "H2" && sections.length > 0) {
      sections[sections.length - 1].children.push(entry);
    } else {
      sections.push(entry);
    }
  });

  return sections;
};

const TocLink = ({ id, label }: { id: string; label: string }) => (
  <Text render={<a href={`#${id}`} />} size={0} shade="muted">
    {label}
  </Text>
);

/**
 * Table of contents built from the rendered page — anything in <main>
 * with an anchor id shows up here, so pages never declare their own TOC.
 * The DOM is treated as an external store: a MutationObserver re-scans
 * whenever main's content changes (e.g. client-side navigation).
 */
export const OnThisPage = () => {
  const subscribe = useCallback((onChange: () => void) => {
    const main = document.querySelector("main");
    if (!main) return () => {};
    const observer = new MutationObserver(onChange);
    observer.observe(main, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  // Serialized so getSnapshot returns a stable value between mutations.
  const snapshot = useSyncExternalStore(
    subscribe,
    () => JSON.stringify(scanToc()),
    () => "[]",
  );
  const sections = useMemo(() => JSON.parse(snapshot) as TocNode[], [snapshot]);

  if (sections.length === 0) return null;

  const items: ListItemOrGroup[] = sections.map((section) =>
    section.children.length > 0
      ? {
          category: section.label,
          items: section.children.map((child) => ({
            label: <TocLink id={child.id} label={child.label} />,
          })),
        }
      : { label: <TocLink id={section.id} label={section.label} /> },
  );

  return (
    <Stack data-slot="on-this-page" gap={2} ax="stretch">
      <Text weight="bold" size={0}>
        On this page
      </Text>
      <List items={items} gap={1} />
    </Stack>
  );
};
OnThisPage.displayName = "OnThisPage";
