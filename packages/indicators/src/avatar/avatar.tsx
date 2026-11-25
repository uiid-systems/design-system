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
  src,
  name,
  description,
  orientation = "horizontal",
  color,
  ImageProps,
  InitialsProps,
  NameProps,
  DescriptionProps,
  ...props
}: AvatarProps) => {
  return (
    <AvatarContainer orientation={orientation} {...props}>
      <AvatarLayers color={color}>
        {/* Decorative beside a visible name, which already says who it is. */}
        <AvatarImage
          {...ImageProps}
          src={src}
          alt={ImageProps?.alt ?? (name ? "" : initials)}
        />
        <AvatarInitials {...InitialsProps} initials={initials} />
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
        {name && <AvatarName {...NameProps} name={name} />}
        {description && (
          <AvatarDescription {...DescriptionProps} description={description} />
        )}
      </ConditionalRender>
    </AvatarContainer>
  );
};
Avatar.displayName = "Avatar";
