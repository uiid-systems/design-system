import { X } from "@uiid/icons";

import { Button } from "../button/button";
import type { CloseButtonProps } from "./close-button.types";

export const CloseButton = ({ children, ...props }: CloseButtonProps) => {
  return (
    <Button
      size="icon"
      icon={<X strokeWidth={2} />}
      iconPosition={children ? "before" : undefined}
      aria-label="Close"
      {...props}
    >
      {children}
    </Button>
  );
};
CloseButton.displayName = "CloseButton";
