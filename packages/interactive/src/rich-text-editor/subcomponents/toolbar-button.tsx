import * as React from "react";

import { ToggleButton } from "@uiid/buttons";

type ToolbarButtonProps = React.ComponentProps<typeof ToggleButton> & {
  isActive?: boolean;
  tooltip?: string;
};

export const ToolbarButton = ({
  isActive,
  children,
  tooltip,
  ...props
}: ToolbarButtonProps) => {
  return (
    <ToggleButton
      tooltip={tooltip}
      style={{ backgroundColor: isActive ? "var(--shade-muted)" : undefined }}
      {...props}
    >
      {children}
    </ToggleButton>
  );
};
ToolbarButton.displayName = "ToolbarButton";
