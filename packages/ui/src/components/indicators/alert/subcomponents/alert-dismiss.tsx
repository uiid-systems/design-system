import { CircleX } from "@uiid/icons";
import { Stack } from "@uiid/primitives";

import "./alert-dismiss.styles.css";

export type AlertDismissProps = {
  onClick: () => void;
};

export const AlertDismiss = ({ onClick }: AlertDismissProps) => {
  return (
    <Stack
      render={<button onClick={onClick} />}
      data-slot="alert-dismiss"
      aria-label="Close Alert"
      ay="center"
    >
      <CircleX size={16} />
    </Stack>
  );
};
