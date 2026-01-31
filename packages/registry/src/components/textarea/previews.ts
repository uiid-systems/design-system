import type { PreviewConfig } from "../../types";

export const textareaPreviews: PreviewConfig[] = [
  {
    label: "Message field",
    tree: {
      root: "textarea",
      elements: {
        textarea: {
          key: "textarea",
          type: "Textarea",
          props: {
            label: "Message",
            placeholder: "How can we help?",
            rows: 4,
          },
        },
      },
    },
  },
];
