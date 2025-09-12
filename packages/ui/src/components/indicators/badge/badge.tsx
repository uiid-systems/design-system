import { Box } from "../../layout";
import { Text } from "../../typography";

import type { BadgeProps } from "./badge.types";
import "./badge.styles.css";

export const Badge = ({ children, ...props }: BadgeProps) => {
  return (
    <Box uiid="badge" {...props}>
      <Text data-slot="badge-text" level={0}>
        badge
      </Text>
    </Box>
  );
};
Badge.displayName = "Badge";
