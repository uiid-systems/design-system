import type { PreviewConfig } from "../../types";

export const checkboxPreviews: PreviewConfig[] = [
  {
    label: "Agreement",
    tree: {
      root: "checkbox",
      elements: {
        checkbox: {
          key: "checkbox",
          type: "Checkbox",
          props: {
            label: "I agree to the terms of service",
            description: "You must accept before continuing.",
            required: true,
          },
        },
      },
    },
  },
];
