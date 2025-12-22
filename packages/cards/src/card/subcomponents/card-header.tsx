import { CloseButton } from "@uiid/buttons";
import { Group } from "@uiid/layout";

import type { CardHeaderProps } from "../card.types";

import { CardTitle } from "./card-title";
import { CardIcon } from "./card-icon";

export const CardHeader = ({
  variant,
  showCloseButton,
  onClose,
  title,
  size,
}: CardHeaderProps) => {
  return (
    <Group data-slot="card-header" ay="center" gap={2}>
      {variant && <CardIcon variant={variant} />}
      {title && <CardTitle title={title} size={size} />}
      {showCloseButton && (
        <CloseButton onClick={onClose} style={{ marginInlineStart: "auto" }} />
      )}
    </Group>
  );
};
CardHeader.displayName = "CardHeader";
