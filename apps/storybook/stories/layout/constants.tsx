import type { ArgTypes } from "@storybook/react-vite";
import { Box, type BoxProps } from "@uiid/design-system";

export const EXAMPLE_LAYOUT_GAP: BoxProps["gap"] = 2;

type ExampleBoxProps = BoxProps & {
  bg?: React.CSSProperties["backgroundColor"];
};
export const ExampleBox = ({ bg, ...props }: ExampleBoxProps) => (
  <Box
    h={64}
    w={64}
    bordered
    rounded
    style={{ backgroundColor: bg, ...props.style }}
    {...props}
  />
);

export const toggleControls: ArgTypes = {
  bordered: { control: "boolean", table: { category: "Toggles" } },
  fullwidth: { control: "boolean", table: { category: "Toggles" } },
  fullheight: { control: "boolean", table: { category: "Toggles" } },
  fullscreen: { control: "boolean", table: { category: "Toggles" } },
  evenly: { control: "boolean", table: { category: "Toggles" } },
  rounded: { control: "boolean", table: { category: "Toggles" } },
  square: { control: "boolean", table: { category: "Toggles" } },
};

export const sizeControls: ArgTypes = {
  w: { control: "number", table: { category: "Size" } },
  minw: { control: "number", table: { category: "Size" } },
  maxw: { control: "number", table: { category: "Size" } },
  h: { control: "number", table: { category: "Size" } },
  minh: { control: "number", table: { category: "Size" } },
  maxh: { control: "number", table: { category: "Size" } },
};

export const borderControls: ArgTypes = {
  b: { control: "number", table: { category: "Border" } },
  bx: { control: "number", table: { category: "Border" } },
  bl: { control: "number", table: { category: "Border" } },
  br: { control: "number", table: { category: "Border" } },
  by: { control: "number", table: { category: "Border" } },
  bt: { control: "number", table: { category: "Border" } },
  bb: { control: "number", table: { category: "Border" } },
};

export const paddingControls: ArgTypes = {
  p: { control: "number", table: { category: "Padding" } },
  px: { control: "number", table: { category: "Padding" } },
  py: { control: "number", table: { category: "Padding" } },
  pl: { control: "number", table: { category: "Padding" } },
  pr: { control: "number", table: { category: "Padding" } },
  pt: { control: "number", table: { category: "Padding" } },
  pb: { control: "number", table: { category: "Padding" } },
};

export const marginControls: ArgTypes = {
  m: { control: "number", table: { category: "Margin" } },
  mx: { control: "number", table: { category: "Margin" } },
  my: { control: "number", table: { category: "Margin" } },
  ml: { control: "number", table: { category: "Margin" } },
  mr: { control: "number", table: { category: "Margin" } },
  mt: { control: "number", table: { category: "Margin" } },
  mb: { control: "number", table: { category: "Margin" } },
};

export const alignmentControls: ArgTypes = {
  direction: {
    control: "select",
    options: ["row", "column"],
    table: { category: "Alignment" },
  },
  gap: { control: "number", table: { category: "Alignment" } },
  ax: {
    control: "select",
    options: ["stretch", "center", "start", "end"],
    table: { category: "Alignment" },
  },
  ay: {
    control: "select",
    options: ["stretch", "center", "start", "end"],
    table: { category: "Alignment" },
  },
};

export const disabledControls: ArgTypes = {
  render: { table: { disable: true } },
  children: { table: { disable: true } },
  ref: { table: { disable: true } },
  style: { table: { disable: true } },
  className: { table: { disable: true } },
};

export const boxControls: ArgTypes = {
  ...alignmentControls,
  ...borderControls,
  ...disabledControls,
  ...marginControls,
  ...paddingControls,
  ...sizeControls,
  ...toggleControls,
};
