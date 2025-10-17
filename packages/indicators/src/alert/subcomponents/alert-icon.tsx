import { Info, Ban, TriangleAlert, CircleCheck } from "@uiid/icons";
import { Stack } from "@uiid/layout";

import "./alert-icon.styles.css";
import { ICON_SIZE } from "../alert.constants";

export type AlertIconProps = {
  type?: "info" | "warning" | "error" | "success";
};

export const AlertIcon = ({ type = "info" }: AlertIconProps) => {
  const Icon = () => {
    if (type === "info") return <Info size={ICON_SIZE} />;
    if (type === "warning") return <TriangleAlert size={ICON_SIZE} />;
    if (type === "error") return <Ban size={ICON_SIZE} />;
    if (type === "success") return <CircleCheck size={ICON_SIZE} />;
    return <Info size={ICON_SIZE} />;
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
