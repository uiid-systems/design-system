import type { PreviewConfig } from "../../types";

export const cardPreviews: PreviewConfig[] = [
  {
    label: "Settings card",
    tree: {
      root: "card",
      elements: {
        card: {
          key: "card",
          type: "Card",
          props: {
            title: "Notification preferences",
            description: "Choose how and when you'd like to be notified.",
          },
          children: ["body", "footer"],
        },
        body: {
          key: "body",
          type: "Text",
          props: {
            children:
              "Email digests are sent weekly. Push notifications are delivered in real time for mentions and replies.",
          },
          parentKey: "card",
        },
        footer: {
          key: "footer",
          type: "Group",
          props: { gap: 2, ax: "end", fullwidth: true },
          children: ["cancel", "save"],
          parentKey: "card",
          slot: "footer",
        },
        cancel: {
          key: "cancel",
          type: "Button",
          props: { ghost: true, size: "small", children: "Cancel" },
          parentKey: "footer",
        },
        save: {
          key: "save",
          type: "Button",
          props: { size: "small", children: "Save preferences" },
          parentKey: "footer",
        },
      },
    },
  },
];
