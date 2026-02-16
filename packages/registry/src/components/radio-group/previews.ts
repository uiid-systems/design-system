import type { PreviewConfig } from "../../types";

export const radioGroupPreviews: PreviewConfig[] = [
  {
    label: "Default",
    tree: {
      root: "radiogroup",
      elements: {
        radiogroup: {
          key: "radiogroup",
          type: "RadioGroup",
          props: {
            label: "Select an option",
            items: [
              { label: "Option 1", value: "option1" },
              { label: "Option 2", value: "option2" },
              { label: "Option 3", value: "option3" },
            ],
          },
        },
      },
    },
  },
  {
    label: "Horizontal",
    tree: {
      root: "radiogroup",
      elements: {
        radiogroup: {
          key: "radiogroup",
          type: "RadioGroup",
          props: {
            label: "Choose one",
            direction: "horizontal",
            items: [
              { label: "Small", value: "small" },
              { label: "Medium", value: "medium" },
              { label: "Large", value: "large" },
            ],
          },
        },
      },
    },
  },
  {
    label: "Bordered",
    tree: {
      root: "radiogroup",
      elements: {
        radiogroup: {
          key: "radiogroup",
          type: "RadioGroup",
          props: {
            label: "Select a plan",
            bordered: true,
            items: [
              { label: "Basic", value: "basic" },
              { label: "Pro", value: "pro" },
              { label: "Enterprise", value: "enterprise" },
            ],
          },
        },
      },
    },
  },
];
