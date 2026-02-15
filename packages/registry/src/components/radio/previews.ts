import type { PreviewConfig } from "../../types";

export const radioPreviews: PreviewConfig[] = [
  {
    label: "Default",
    tree: {
      root: "radio",
      elements: {
        radio: {
          key: "radio",
          type: "Radio",
          props: { value: "option1", label: "Option 1" },
        },
      },
    },
  },
  {
    label: "With Description",
    tree: {
      root: "radio",
      elements: {
        radio: {
          key: "radio",
          type: "Radio",
          props: {
            value: "option1",
            label: "Option 1",
            description: "This is the first option",
          },
        },
      },
    },
  },
  {
    label: "Bordered",
    tree: {
      root: "radio",
      elements: {
        radio: {
          key: "radio",
          type: "Radio",
          props: { value: "option1", label: "Bordered Option", bordered: true },
        },
      },
    },
  },
];
