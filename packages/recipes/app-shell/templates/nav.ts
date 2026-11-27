import type { NavEntry } from "@/lib/nav";

/**
 * Every page the app names, in order. The sidebar and the breadcrumbs are
 * filled from it, so a new page needs an entry here and a route in `app/`.
 * A group's label is also its saved open state's id, so renaming a group
 * resets that state for returning readers.
 */
export const NAV: NavEntry[] = [
  { label: "Home", href: "/" },
  {
    label: "Guides",
    href: "/guides",
    items: [
      { label: "Getting Started", href: "/guides/getting-started" },
      { label: "Next Steps", href: "/guides/next-steps" },
    ],
  },
];
