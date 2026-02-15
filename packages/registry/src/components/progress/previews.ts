import type { PreviewConfig } from "../../types";

export const progressPreviews: PreviewConfig[] = [
  {
    label: "Default",
    tree: {
      root: "progress",
      elements: {
        progress: {
          key: "progress",
          type: "Progress",
          props: { value: 60 },
        },
      },
    },
  },
  {
    label: "Complete",
    tree: {
      root: "progress",
      elements: {
        progress: {
          key: "progress",
          type: "Progress",
          props: { value: 100 },
        },
      },
    },
  },
  {
    label: "Indeterminate",
    tree: {
      root: "progress",
      elements: {
        progress: {
          key: "progress",
          type: "Progress",
          props: { value: null },
        },
      },
    },
  },
];
