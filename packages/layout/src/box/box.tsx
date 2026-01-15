import { prepareComponentProps, renderWithProps } from "@uiid/utils";

import type { BoxProps } from "./box.types";

import "@uiid/utils/evenly.css";
import "@uiid/utils/fullheight.css";
import "@uiid/utils/fullwidth.css";
import "@uiid/utils/fullscreen.css";

export const Box = ({ render, children, ...props }: BoxProps) => {
  const preparedProps = prepareComponentProps({
    componentName: "box",
    toggleProps: ["evenly", "fullwidth", "fullheight", "fullscreen"],
    styleProps: [
      "ax",
      "ay",
      "direction",
      "gap",
      "m",
      "mx",
      "my",
      "ml",
      "mr",
      "mt",
      "mb",
      "p",
      "px",
      "py",
      "pl",
      "pr",
      "pt",
      "pb",
    ],
    props,
  });

  return renderWithProps({
    fallbackElement: "div",
    props: preparedProps,
    render,
    children,
  });
};
Box.displayName = "Box";
