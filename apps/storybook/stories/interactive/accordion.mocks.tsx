import type { AccordionItemData } from "@uiid/design-system";
import { InfoIcon } from "@uiid/icons/info";

export const MOCK_ITEMS: AccordionItemData[] = [
  {
    icon: InfoIcon,
    value: "item-1",
    trigger: "What is UIID?",
    content:
      "UIID is a modular React component library built with React 19, TypeScript, and Base UI primitives.",
  },
  {
    icon: InfoIcon,
    value: "item-2",
    trigger: "How do I install it?",
    content:
      "You can install UIID packages individually via npm or pnpm, e.g., pnpm add @uiid/interactive.",
  },
  {
    icon: InfoIcon,
    value: "item-3",
    trigger: "Is it accessible?",
    content:
      "Yes! UIID is built on Base UI which provides accessible primitives with proper ARIA attributes and keyboard navigation.",
  },
];
