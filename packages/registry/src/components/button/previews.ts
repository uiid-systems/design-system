import type { PreviewConfig } from "../../types";

export const buttonPreviews: PreviewConfig[] = [
  {
    label: "Action bar",
    tree: {
      root: "group",
      elements: {
        group: {
          key: "group",
          type: "Group",
          props: { gap: 2, ay: "center" },
          children: ["delete", "cancel", "save"],
        },
        delete: {
          key: "delete",
          type: "Button",
          props: { tone: "critical", ghost: true, children: "Delete" },
          parentKey: "group",
        },
        cancel: {
          key: "cancel",
          type: "Button",
          props: { variant: "subtle", children: "Cancel" },
          parentKey: "group",
        },
        save: {
          key: "save",
          type: "Button",
          props: { children: "Save changes" },
          parentKey: "group",
        },
      },
    },
  },
];
