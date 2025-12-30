import * as React from "react";

import { ToggleButton } from "@uiid/buttons";

export type ToolbarButtonProps = React.ComponentProps<typeof ToggleButton> & {
  tooltip?: string;
};

export const ToolbarButton = ({
  children,
  tooltip,
  ...props
}: ToolbarButtonProps) => {
  return (
    <ToggleButton
      data-slot="toolbar-button"
      tooltip={tooltip}
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
