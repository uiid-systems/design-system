import { Stack } from "@uiid/design-system";

import type { ShellInnerProps } from "../shell.types";

/** The header stacked over the scrolling content row. */
export const ShellInner = ({ children, ...props }: ShellInnerProps) => {
  return (
    <Stack data-slot="shell-inner" grow {...props}>
      {children}
    </Stack>
  );
};
ShellInner.displayName = "ShellInner";
