import { prepareComponentProps, renderWithProps } from "../../../utils";
import "../../../utils/props/toggles/evenly.css";
import "../../../utils/props/toggles/fullwidth.css";

import type { BoxProps } from "./box.types";

export const Box = ({ render, children, ...props }: BoxProps) => {
  const preparedProps = prepareComponentProps({
    componentName: "box",
    toggleProps: ["evenly", "fullwidth"],
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
