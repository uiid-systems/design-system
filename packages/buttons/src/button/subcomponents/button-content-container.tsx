import { Stack } from "@uiid/layout";

import styles from "./button-content-container.module.css";

type ButtonContentContainerProps = React.PropsWithChildren<{
  shift?: boolean;
}>;

export const ButtonContentContainer = ({
  shift,
  children,
}: ButtonContentContainerProps) => {
  return (
    <Stack
      className={styles["button-content-container"]}
      data-shift={shift ? "true" : undefined}
    >
      {children}
    </Stack>
  );
};
ButtonContentContainer.displayName = "ButtonContentContainer";
