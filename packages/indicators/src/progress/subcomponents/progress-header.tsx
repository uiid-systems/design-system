import { Group } from "@uiid/layout";

import type { ProgressHeaderProps } from "../progress.types";

/* Hoisted so the literal `data-slot` dodges the excess-property check on BoxProps. */
const slot = { "data-slot": "progress-header" } as const;

export const ProgressHeader = ({
  gap = 2,
  ay = "center",
  fullwidth = true,
  children,
  ...props
}: ProgressHeaderProps) => {
  return (
    <Group {...slot} gap={gap} ay={ay} fullwidth={fullwidth} {...props}>
      {children}
    </Group>
  );
};
ProgressHeader.displayName = "ProgressHeader";
