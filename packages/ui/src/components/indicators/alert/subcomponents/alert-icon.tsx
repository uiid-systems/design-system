import { Info, Ban, TriangleAlert, CircleCheck } from "@uiid/icons";
import { Stack } from "@uiid/primitives";

import "./alert-icon.styles.css";

export type AlertIconProps = {
  type?: "info" | "warning" | "error" | "success";
};

export const AlertIcon = ({ type = "info" }: AlertIconProps) => {
  const Icon = () => {
    if (type === "info") return <Info />;
    if (type === "warning") return <TriangleAlert />;
    if (type === "error") return <Ban />;
    if (type === "success") return <CircleCheck />;
    return <Info />;
  };

  return (
    <Stack
      data-slot="alert-icon"
      render={<aside />}
      aria-label={`${type} alert icon`}
      ay="center"
    >
      <Icon />
    </Stack>
  );
};
AlertIcon.displayName = "AlertIcon";
