import { Stack, ConditionalRender } from "@uiid/layout";

import type { AvatarProps } from "./avatar.types";
import {
  AvatarContainer,
  AvatarLayers,
  AvatarImage,
  AvatarInitials,
  AvatarName,
  AvatarDescription,
} from "./subcomponents";

export const Avatar = ({
  initials,
  name,
  description,
  orientation = "horizontal",
  color,
  ContainerProps,
  ImageProps,
  InitialsProps,
  NameProps,
  DescriptionProps,
  ...props
}: AvatarProps) => {
  return (
    <AvatarContainer orientation={orientation} {...props} {...ContainerProps}>
      <AvatarLayers color={color}>
        <AvatarImage {...ImageProps} />
        <AvatarInitials initials={initials} {...InitialsProps} />
      </AvatarLayers>

      <ConditionalRender
        condition={!!name}
        render={
          <Stack
            gap={3}
            ax={orientation === "vertical" ? "center" : undefined}
          />
        }
      >
        {name && <AvatarName name={name} {...NameProps} />}
        {description && (
          <AvatarDescription description={description} {...DescriptionProps} />
        )}
      </ConditionalRender>
    </AvatarContainer>
  );
};
Avatar.displayName = "Avatar";
