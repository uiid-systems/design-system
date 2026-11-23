// The complete lucide icon set plus uiid additions — the single source of truth
// and single version for icons across the design system. Import icons from here
// rather than depending on `lucide-react` directly.
//
// Every icon is exposed only under its canonical `*Icon` name (`GlobeIcon`,
// never `Globe`), and every one is reachable as its own module:
//
//   import { GlobeIcon } from "@uiid/icons/globe";  // parses 1 lucide module
//   import { GlobeIcon } from "@uiid/icons";        // the barrel
//
// Inside this repo, prefer the subpath — see README.md.
export * from "./lucide-icons.generated";

export type { Icon, IconProps } from "./icon-type";

export * from "./custom";
