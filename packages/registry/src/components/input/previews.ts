import type { PreviewConfig } from "../../types";

export const inputPreviews: PreviewConfig[] = [
  {
    label: "Email field",
    tree: {
      root: "input",
      elements: {
        input: {
          key: "input",
          type: "Input",
          props: {
            label: "Email address",
            placeholder: "you@company.com",
            type: "email",
            required: true,
          },
        },
      },
    },
  },
];
