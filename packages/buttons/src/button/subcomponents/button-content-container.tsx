import { Stack } from "@uiid/layout";

import styles from "./button-content-container.module.css";

type ButtonContentContainerProps = React.PropsWithChildren<{
  loading?: boolean;
}>;

export const ButtonContentContainer = ({
  loading,
  children,
}: ButtonContentContainerProps) => {
  return (
    <Stack
      className={styles["button-content-container"]}
      data-shift={loading ? "true" : undefined}
    >
      {children}
    </Stack>
  );
};
ButtonContentContainer.displayName = "ButtonContentContainer";
