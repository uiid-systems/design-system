import { ToggleButton } from "@uiid/buttons";
import * as React from "react";

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
      shape="square"
      {...props}
    >
      {children}
    </ToggleButton>
  );
};
ToolbarButton.displayName = "ToolbarButton";
