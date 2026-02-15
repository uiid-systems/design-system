import type { PreviewConfig } from "../../types";

export const numberFieldPreviews: PreviewConfig[] = [
  {
    label: "Default",
    tree: {
      root: "numberfield",
      elements: {
        numberfield: {
          key: "numberfield",
          type: "NumberField",
          props: { label: "Quantity", defaultValue: 1 },
        },
      },
    },
  },
  {
    label: "With Constraints",
    tree: {
      root: "numberfield",
      elements: {
        numberfield: {
          key: "numberfield",
          type: "NumberField",
          props: {
            label: "Age",
            min: 0,
            max: 120,
            defaultValue: 25,
          },
        },
      },
    },
  },
  {
    label: "With Step",
    tree: {
      root: "numberfield",
      elements: {
        numberfield: {
          key: "numberfield",
          type: "NumberField",
          props: {
            label: "Price",
            step: 0.01,
            min: 0,
            defaultValue: 9.99,
            description: "Enter price in dollars",
          },
        },
      },
    },
  },
];
