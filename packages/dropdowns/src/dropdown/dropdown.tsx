import { Button } from "@uiid/buttons";
import { Popover } from "@uiid/overlays";

import type { DropdownProps } from "./dropdown.types";

export const Dropdown = ({
  placeholder,
  size = "md",
  TriggerProps,
  PopupProps,
  children,
  ...props
}: DropdownProps) => {
  if (!placeholder) {
    throw new Error("Add a placeholder to your dropdown!");
  }

  return (
    <Popover
      {...props}
      trigger={
        <Button variant="subtle" grows={false} size={size} {...TriggerProps}>
          {placeholder}
        </Button>
      }
      PopupProps={{
        style: {
          ...PopupProps?.style,
          padding: 4,
          maxHeight: "28rem",
          overflowY: "auto",
        },
      }}
    >
      {children}
    </Popover>
  );
};
Dropdown.displayName = "Dropdown";
