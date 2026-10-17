import { Group } from "@uiid/layout";

import type { ProgressHeaderProps } from "../progress.types";

export const ProgressHeader = ({
  gap = 2,
  ay = "center",
  fullwidth = true,
  children,
  ...props
}: ProgressHeaderProps) => {
  return (
    <Group
      data-slot="progress-header"
      gap={gap}
      ay={ay}
      fullwidth={fullwidth}
      {...props}
    >
      {children}
    </Group>
  );
};
ProgressHeader.displayName = "ProgressHeader";
