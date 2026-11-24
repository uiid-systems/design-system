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
        <AvatarImage src={src} alt={name ? "" : initials} {...ImageProps} />
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
