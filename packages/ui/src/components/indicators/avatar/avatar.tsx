import { Group, Layer, Stack, ConditionalRender } from "../../layout";
import { Text } from "../../typography";

import type { AvatarProps } from "./avatar.types";
import "./avatar.styles.css";

export const Avatar = ({
  initials,
  name,
  description,
  ...props
}: AvatarProps) => {
  return (
    <Group uiid="avatar" gap={2} ay="center" {...props}>
      <Layer data-slot="avatar-layers" ax="center" ay="center" fullwidth>
        <span data-slot="avatar-image" />
        <Text data-slot="avatar-initials" level={0}>
          {initials}
        </Text>
      </Layer>

      <ConditionalRender condition={!!name} wrapper={<Stack gap={2} />}>
        <Text data-slot="avatar-name" level={0}>
          {name}
        </Text>
        {description && (
          <Text data-slot="avatar-description" level={0}>
            {description}
          </Text>
        )}
      </ConditionalRender>
    </Group>
  );
};
Avatar.displayName = "Avatar";
