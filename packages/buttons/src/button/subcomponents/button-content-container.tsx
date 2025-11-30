import { Stack, type StackProps } from "@uiid/layout";

import styles from "./button-content-container.module.css";

type ButtonContentContainerProps = React.PropsWithChildren<{
  shift?: boolean;
  render?: StackProps["render"];
  asButton?: boolean;
}>;

export const ButtonContentContainer = ({
  shift,
  render,
  asButton = true,
  children,
}: ButtonContentContainerProps) => {
  return (
    <Stack
      role={asButton ? "button" : undefined}
      className={styles["button-content-container"]}
      data-shift={shift ? "true" : undefined}
      render={render}
    >
      {children}
    </Stack>
  );
};
ButtonContentContainer.displayName = "ButtonContentContainer";
