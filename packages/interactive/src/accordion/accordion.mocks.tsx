import { Info } from "@uiid/icons";

import type { AccordionItemData } from "./accordion.types";

export const MOCK_ITEMS: AccordionItemData[] = [
  {
    icon: Info,
    value: "item-1",
    trigger: "What is UIID?",
    content:
      "UIID is a modular React component library built with React 19, TypeScript, and Base UI primitives.",
  },
  {
    icon: Info,
    value: "item-2",
    trigger: "How do I install it?",
    content:
      "You can install UIID packages individually via npm or pnpm, e.g., pnpm add @uiid/interactive.",
  },
  {
    icon: Info,
    value: "item-3",
    trigger: "Is it accessible?",
    content:
      "Yes! UIID is built on Base UI which provides accessible primitives with proper ARIA attributes and keyboard navigation.",
  },
];
