import type { ComponentEntry, PreviewConfig } from "../types";

import { CardPropsSchema } from "../schemas/cards";

const cardPreviews: PreviewConfig[] = [
  {
    label: "Default",
    tree: {
      root: "card",
      elements: {
        card: {
          key: "card",
          type: "Card",
          props: {
            title: "Acme Corporation",
            description: "The global leader in everything.",
            size: "medium",
            __slot_footer: {
              root: "footer",
              elements: {
                footer: {
                  key: "footer",
                  type: "Group",
                  props: { gap: 2, ax: "end", fullwidth: true },
                  children: ["cancel", "submit"],
                },
                cancel: {
                  key: "cancel",
                  type: "Button",
                  props: { size: "small", ghost: true, children: "Cancel" },
                  parentKey: "footer",
                },
                submit: {
                  key: "submit",
                  type: "Button",
                  props: { size: "small", children: "Complete purchase" },
                  parentKey: "footer",
                },
              },
            },
          },
          children: ["body"],
        },
        body: {
          key: "body",
          type: "Text",
          props: {
            children:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          },
          parentKey: "card",
        },
      },
    },
  },
  {
    label: "Tones",
    tree: {
      root: "group",
      elements: {
        group: {
          key: "group",
          type: "Group",
          props: { gap: 4 },
          children: ["neutral", "positive", "critical"],
        },
        neutral: {
          key: "neutral",
          type: "Card",
          props: { title: "Neutral" },
          parentKey: "group",
        },
        positive: {
          key: "positive",
          type: "Card",
          props: { title: "Positive", tone: "positive" },
          parentKey: "group",
        },
        critical: {
          key: "critical",
          type: "Card",
          props: { title: "Critical", tone: "critical" },
          parentKey: "group",
        },
      },
    },
  },
];

export const CardEntry: ComponentEntry<typeof CardPropsSchema> = {
  name: "Card",
  package: "@uiid/cards",
  hasChildren: true,
  propsSchema: CardPropsSchema,
  description:
    "Container card with title, description, icon, action, and footer slots",
  category: "cards",
  defaults: {},
  previews: cardPreviews,
  slots: {
    title: "Card heading, rendered above the body",
    description: "Subheading beneath the title",
    action: "Action buttons, typically top-right",
    footer: "Footer content at the bottom of the card",
    icon: "Icon displayed in the card header",
  },
  usage:
    "Use Card as a content container. Pass title/description as props, children as body. Use tone for semantic color.",
};
