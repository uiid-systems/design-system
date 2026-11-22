import { Stack } from "@uiid/design-system";
import { cx } from "@uiid/design-system/utils";

import type { ShellBodyProps } from "../shell.types";

import styles from "../shell.module.css";

/** The viewport. It never scrolls; the sidebar and the content row do. */
export const ShellBody = ({
  className,
  children,
  ...props
}: ShellBodyProps) => {
  return (
    <Stack
      data-slot="shell-body"
      render={<body />}
      className={cx(styles["shell-body"], className)}
      h="screen"
      w="full"
      {...props}
    >
      {children}
    </Stack>
  );
};
ShellBody.displayName = "ShellBody";
