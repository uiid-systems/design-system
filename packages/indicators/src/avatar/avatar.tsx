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
  size = "medium",
  ContainerProps,
  ImageProps,
  InitialsProps,
  NameProps,
  DescriptionProps,
  ...props
}: AvatarProps) => {
  return (
    <AvatarContainer orientation={orientation} {...props} {...ContainerProps}>
      <AvatarLayers size={size}>
        <AvatarImage {...ImageProps} />
        <AvatarInitials initials={initials} size={size} {...InitialsProps} />
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
        {name && <AvatarName name={name} size={size} {...NameProps} />}
        {description && (
          <AvatarDescription
            description={description}
            size={size}
            {...DescriptionProps}
          />
        )}
      </ConditionalRender>
    </AvatarContainer>
  );
};
Avatar.displayName = "Avatar";
