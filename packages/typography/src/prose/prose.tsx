import {
  prepareComponentProps,
  renderWithProps,
  cx,
  spacingPropKeys,
} from "@uiid/utils";

import type { ProseProps } from "./prose.types";

import styles from "./prose.module.css";

export const Prose = ({
  render,
  className,
  children,
  ...props
}: ProseProps) => {
  const preparedProps = prepareComponentProps({
    componentName: "prose",
    styleProps: spacingPropKeys,
    props,
  });

  return renderWithProps({
    fallbackElement: "div",
    props: {
      ...preparedProps,
      className: cx(styles["prose"], className),
    },
    render,
    children,
  });
};
Prose.displayName = "Prose";
