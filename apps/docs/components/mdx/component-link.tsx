import { registry } from "@uiid/registry";

import { urls, toSlug } from "@/constants/urls";

interface ComponentLinkProps {
  name: string;
}

/**
 * MDX component that renders an internal link to a component doc page.
 * Resolves the URL automatically from the registry — no hardcoded paths.
 *
 * Usage in MDX: <ComponentLink name="Stack" />
 */
export function ComponentLink({ name }: ComponentLinkProps) {
  const entry = registry[name as keyof typeof registry];

  if (!entry) {
    return <code>{name}</code>;
  }

  const href = urls.component(entry.category ?? "uncategorized", toSlug(entry.name));

  return <a href={href}>{entry.name}</a>;
}
