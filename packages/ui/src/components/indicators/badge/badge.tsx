import { Box, Text } from "@uiid/primitives";

import type { BadgeProps } from "./badge.types";
import "./badge.styles.css";

export const Badge = ({ size = "sm", children, ...props }: BadgeProps) => {
  return (
    <Box uiid="badge" data-size={size} {...props}>
      <Text data-slot="badge-text">{children}</Text>
    </Box>
  );
};
Badge.displayName = "Badge";
