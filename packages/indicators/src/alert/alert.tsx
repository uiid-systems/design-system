import { Card } from "@uiid/cards";

import type { AlertProps } from "./alert.types";

export const Alert = ({ tone, children, ...props }: AlertProps) => {
  return (
    <Card data-slot="alert" role="alert" tone={tone} fullwidth {...props}>
      {children}
    </Card>
  );
};
Alert.displayName = "Alert";
