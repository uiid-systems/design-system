import type { PreviewConfig } from "../../types";

export const groupPreviews: PreviewConfig[] = [
  {
    label: "Toolbar",
    tree: {
      root: "group",
      elements: {
        group: {
          key: "group",
          type: "Group",
          props: {
            ax: "space-between",
            ay: "center",
            p: 4,
            b: 1,
            gap: 2,
            rounded: true,
            fullwidth: true,
          },
          children: ["title", "actions"],
        },
        title: {
          key: "title",
          type: "Text",
          props: { size: 1, weight: "bold", children: "Team members" },
          parentKey: "group",
        },
        actions: {
          key: "actions",
          type: "Group",
          props: { gap: 2 },
          children: ["export", "invite"],
        },
        export: {
          key: "export",
          type: "Button",
          props: { variant: "subtle", size: "small", children: "Export" },
          parentKey: "actions",
        },
        invite: {
          key: "invite",
          type: "Button",
          props: { size: "small", children: "Invite member" },
          parentKey: "actions",
        },
      },
    },
  },
];
