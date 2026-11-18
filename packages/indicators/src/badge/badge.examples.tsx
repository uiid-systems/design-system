import { Group } from "@uiid/layout";
import { PALETTE_HUES } from "@uiid/tokens";

import { Badge } from "./badge";
import type { BadgeVariants } from "./badge.types";

type Size = NonNullable<BadgeVariants["size"]>;

const SIZES: Size[] = ["small", "medium", "large"];

export const Default = () => <Badge>New</Badge>;

/* The size sets the padding; the label stays on the same small, bold step. */
export const Sizes = () => (
  <Group gap={2} ay="center">
    {SIZES.map((size) => (
      <Badge key={size} size={size}>
        {size}
      </Badge>
    ))}
  </Group>
);

/* A hue turns the badge into a tint, with text and border drawn from it. */
export const Colors = () => (
  <Group gap={2} wrap>
    {PALETTE_HUES.map((color) => (
      <Badge key={color} color={color}>
        {color}
      </Badge>
    ))}
  </Group>
);

/* A bare count says nothing to a screen reader on its own, so name it. */
export const Count = () => (
  <Badge color="red" size="small" role="status" aria-label="3 unread messages">
    3
  </Badge>
);
