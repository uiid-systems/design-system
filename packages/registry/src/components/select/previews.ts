import type { PreviewConfig } from "../../types";

export const selectPreviews: PreviewConfig[] = [
  {
    label: "Role picker",
    tree: {
      root: "select",
      elements: {
        select: {
          key: "select",
          type: "Select",
          props: {
            label: "Role",
            placeholder: "Choose a role",
            items: [
              { label: "Viewer", value: "viewer" },
              { label: "Editor", value: "editor" },
              { label: "Admin", value: "admin" },
            ],
          },
        },
      },
    },
  },
];
