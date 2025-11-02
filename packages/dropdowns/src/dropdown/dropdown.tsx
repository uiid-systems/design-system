import { Button } from "@uiid/buttons";
import { Popover } from "@uiid/overlays";

import type { DropdownProps } from "./dropdown.types";

export const Dropdown = ({
  placeholder,
  size = "md",
  TriggerProps,
  children,
  ...props
}: DropdownProps) => {
  if (!placeholder) {
    throw new Error("Add a placeholder to your dropdown!");
  }

  return (
    <Popover
      {...props}
      PopupProps={{ style: { maxWidth: "fit-content" } }}
      trigger={
        <Button variant="subtle" grows={false} size={size} {...TriggerProps}>
          {placeholder}
        </Button>
      }
    >
      {children}
    </Popover>
  );
};
Dropdown.displayName = "Dropdown";
