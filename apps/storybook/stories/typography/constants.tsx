import type { ArgTypes } from "@storybook/react-vite";

const TEXT_SIZES = [-1, 0, 1, 2, 3, 4, 5, 6];
const TEXT_WEIGHTS = ["thin", "light", "normal", "medium", "semibold", "bold"];
const TEXT_FAMILIES = ["sans", "serif", "mono"];
const TEXT_SHADES = [
  "background",
  "surface",
  "accent",
  "halftone",
  "muted",
  "foreground",
];
const TEXT_COLORS = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "indigo",
  "purple",
  "neutral",
];

export const variantControls: ArgTypes = {
  size: {
    control: "select",
    options: TEXT_SIZES,
    table: { category: "Variants" },
  },
  weight: {
    control: "select",
    options: TEXT_WEIGHTS,
    table: { category: "Variants" },
  },
  family: {
    control: "select",
    options: TEXT_FAMILIES,
    table: { category: "Variants" },
  },
  shade: {
    control: "select",
    options: TEXT_SHADES,
    table: { category: "Variants" },
  },
  color: {
    control: "select",
    options: TEXT_COLORS,
    table: { category: "Variants" },
  },
};

export const toggleControls: ArgTypes = {
  balance: { control: "boolean", table: { category: "Toggles" } },
  truncate: { control: "boolean", table: { category: "Toggles" } },
  underline: { control: "boolean", table: { category: "Toggles" } },
  strikethrough: { control: "boolean", table: { category: "Toggles" } },
};

export const spacingControls: ArgTypes = {
  m: { control: "number", table: { category: "Spacing" } },
  mx: { control: "number", table: { category: "Spacing" } },
  my: { control: "number", table: { category: "Spacing" } },
  p: { control: "number", table: { category: "Spacing" } },
  px: { control: "number", table: { category: "Spacing" } },
  py: { control: "number", table: { category: "Spacing" } },
};

export const disabledControls: ArgTypes = {
  render: { table: { disable: true } },
  ref: { table: { disable: true } },
  style: { table: { disable: true } },
  className: { table: { disable: true } },
};

export const textControls: ArgTypes = {
  children: { control: "text", table: { category: "Content" } },
  ...variantControls,
  ...toggleControls,
  ...spacingControls,
  ...disabledControls,
};
