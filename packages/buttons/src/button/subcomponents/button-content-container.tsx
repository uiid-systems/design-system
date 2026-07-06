import { Group } from "@uiid/layout";

import type { ButtonContentContainerProps } from "../button.types";
import styles from "../button.module.css";
import { BUTTON_DEFAULT_GAP } from "../button.constants";

export const ButtonContentContainer = ({
  loading,
  children,
  ...props
}: ButtonContentContainerProps) => {
  return (
    <Group
      data-slot="button-content-container"
      className={styles["button-content-container"]}
      data-loading={loading}
      aria-hidden={loading}
      ay="center"
      gap={BUTTON_DEFAULT_GAP}
      {...props}
    >
      {children}
    </Group>
  );
};
ButtonContentContainer.displayName = "ButtonContentContainer";
