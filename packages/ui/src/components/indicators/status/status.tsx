import { Group } from "../../layout";
import { Text } from "../../typography";

import type { StatusProps } from "./status.types";
import "./status.styles.css";

export const Status = ({ variant, children }: StatusProps) => {
  return (
    <Group uiid="status" ay="center" gap={2} data-variant={variant}>
      <span data-slot="status-dot" />
      <Text data-slot="status-text" level={0}>
        {children}
      </Text>
    </Group>
  );
};
Status.displayName = "Status";
