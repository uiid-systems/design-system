import type { PreviewConfig } from "../../types";

export const collapsiblePreviews: PreviewConfig[] = [
  {
    label: "FAQ item",
    tree: {
      root: "collapsible",
      elements: {
        collapsible: {
          key: "collapsible",
          type: "Collapsible",
          props: {
            trigger: "What payment methods do you accept?",
          },
          children: ["content"],
        },
        content: {
          key: "content",
          type: "Text",
          props: {
            children:
              "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers. For enterprise customers, we also offer invoicing with NET 30 terms.",
          },
          parentKey: "collapsible",
        },
      },
    },
  },
  {
    label: "Settings section",
    tree: {
      root: "collapsible",
      elements: {
        collapsible: {
          key: "collapsible",
          type: "Collapsible",
          props: {
            trigger: "Advanced settings",
            defaultOpen: true,
          },
          children: ["settings"],
        },
        settings: {
          key: "settings",
          type: "Stack",
          props: { gap: 3, pt: 3 },
          children: ["debug", "analytics"],
          parentKey: "collapsible",
        },
        debug: {
          key: "debug",
          type: "Switch",
          props: {
            label: "Debug mode",
            description: "Show detailed error messages",
          },
          parentKey: "settings",
        },
        analytics: {
          key: "analytics",
          type: "Switch",
          props: {
            label: "Usage analytics",
            description: "Help improve the product with anonymous usage data",
            defaultChecked: true,
          },
          parentKey: "settings",
        },
      },
    },
  },
];
