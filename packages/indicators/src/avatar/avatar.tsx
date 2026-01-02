import { Group, Stack, ConditionalRender } from "@uiid/layout";

import type { AvatarProps } from "./avatar.types";

import {
  AvatarLayers,
  AvatarImage,
  AvatarInitials,
  AvatarName,
  AvatarDescription,
} from "./subcomponents";

export const Avatar = ({
  /** data */
  initials,
  name,
  description,
  /** subcomponents */
  ImageProps,
  InitialsProps,
  NameProps,
  DescriptionProps,
  ...props
}: AvatarProps) => {
  return (
    <Group data-slot="avatar" gap={2} ay="center" {...props}>
      <AvatarLayers>
        <AvatarImage {...ImageProps} />
        <AvatarInitials initials={initials} {...InitialsProps} />
      </AvatarLayers>

      <ConditionalRender condition={!!name} render={<Stack gap={2} />}>
        {name && <AvatarName name={name} {...NameProps} />}
        {description && (
          <AvatarDescription description={description} {...DescriptionProps} />
        )}
      </ConditionalRender>
    </Group>
  );
};
Avatar.displayName = "Avatar";
