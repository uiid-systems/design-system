import { registry } from "@uiid/registry";

import { urls, toSlug } from "@/constants/urls";

export interface ComponentLinkProps extends Record<string, unknown> {
  name?: string;
}

/**
 * MDX component that renders an internal link to a component doc page.
 * Resolves the URL automatically from the registry — no hardcoded paths.
 *
 * Usage in MDX: <ComponentLink name="Stack" />
 */
export function ComponentLink({ name }: ComponentLinkProps) {
  if (!name) {
    return null;
  }

  const entry = registry[name as keyof typeof registry];

  if (!entry) {
    return <code>{name}</code>;
  }

  const href = urls.component(entry.category ?? "uncategorized", toSlug(entry.name));

  return <a href={href}>{entry.name}</a>;
}
