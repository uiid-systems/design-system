import type { PreviewConfig } from "../../types";

export const checkboxGroupPreviews: PreviewConfig[] = [
  {
    label: "Default",
    tree: {
      root: "checkboxgroup",
      elements: {
        checkboxgroup: {
          key: "checkboxgroup",
          type: "CheckboxGroup",
          props: {
            label: "Select options",
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
      root: "checkboxgroup",
      elements: {
        checkboxgroup: {
          key: "checkboxgroup",
          type: "CheckboxGroup",
          props: {
            label: "Select features",
            direction: "horizontal",
            items: [
              { label: "Dark mode", value: "dark" },
              { label: "Notifications", value: "notifications" },
              { label: "Auto-save", value: "autosave" },
            ],
          },
        },
      },
    },
  },
  {
    label: "Bordered",
    tree: {
      root: "checkboxgroup",
      elements: {
        checkboxgroup: {
          key: "checkboxgroup",
          type: "CheckboxGroup",
          props: {
            label: "Select add-ons",
            bordered: true,
            items: [
              { label: "Extended warranty", value: "warranty" },
              { label: "Premium support", value: "support" },
              { label: "Priority shipping", value: "shipping" },
            ],
          },
        },
      },
    },
  },
];
