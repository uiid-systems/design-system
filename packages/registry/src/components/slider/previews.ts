import type { PreviewConfig } from "../../types";

export const sliderPreviews: PreviewConfig[] = [
  {
    label: "Default",
    tree: {
      root: "slider",
      elements: {
        slider: {
          key: "slider",
          type: "Slider",
          props: { defaultValue: 50, label: "Volume" },
        },
      },
    },
  },
  {
    label: "With Range",
    tree: {
      root: "slider",
      elements: {
        slider: {
          key: "slider",
          type: "Slider",
          props: {
            defaultValue: [25, 75],
            min: 0,
            max: 100,
            label: "Price Range",
          },
        },
      },
    },
  },
  {
    label: "With Description",
    tree: {
      root: "slider",
      elements: {
        slider: {
          key: "slider",
          type: "Slider",
          props: {
            defaultValue: 30,
            label: "Brightness",
            description: "Adjust screen brightness",
          },
        },
      },
    },
  },
];
