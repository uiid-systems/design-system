import { Card } from "@uiid/cards";

import type { AlertProps } from "./alert.types";

export const Alert = ({ children, ...props }: AlertProps) => {
  return (
    <Card data-slot="alert" role="alert" fullwidth {...props}>
      {children}
    </Card>
  );
};
Alert.displayName = "Alert";
