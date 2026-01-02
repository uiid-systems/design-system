import * as React from "react";

import { ToggleButton } from "@uiid/buttons";

export type ToolbarButtonProps = React.ComponentProps<typeof ToggleButton> & {
  tooltip?: string;
  isActive?: boolean;
};

export const ToolbarButton = ({
  children,
  tooltip,
  isActive,
  ...props
}: ToolbarButtonProps) => {
  return (
    <ToggleButton
      data-slot="toolbar-button"
      tooltip={tooltip}
      pressed={isActive}
      size="small"
      variant="subtle"
      square
      {...props}
    >
      {children}
    </ToggleButton>
  );
};
ToolbarButton.displayName = "ToolbarButton";
