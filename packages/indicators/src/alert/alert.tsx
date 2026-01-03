import { Card } from "@uiid/cards";

import type { AlertProps } from "./alert.types";

export const Alert = ({
  variant,
  // onDismiss,
  children,
  ...props
}: AlertProps) => {
  return (
    <Card data-slot="alert" role="alert" variant={variant} fullwidth {...props}>
      {children}
    </Card>
  );
};
Alert.displayName = "Alert";
