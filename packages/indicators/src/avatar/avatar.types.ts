import type { Avatar as BaseAvatar } from "@base-ui/react/avatar";
import type { GroupProps, LayerProps } from "@uiid/layout";
import type { TextProps } from "@uiid/typography";
import type { VariantProps, WithStringClassName } from "@uiid/utils";

import { avatarVariants } from "./avatar.variants";

export type AvatarVariants = VariantProps<typeof avatarVariants>;

export type AvatarType = {
  initials: string;
  /**
   * Image shown in place of the initials once it loads. The initials stay
   * when it is missing or fails.
   */
  src?: string;
  name?: string;
  description?: string;
};

export type AvatarContainerProps = Omit<GroupProps, "ax" | "ay"> & {
  orientation?: "horizontal" | "vertical";
};

/** Renders Base UI's `Avatar.Root` as a `Layer`, so it holds the loading status. */
export type AvatarLayersProps = LayerProps & AvatarVariants;

/** Base UI's `Avatar.Image`: an `<img>` mounted only once `src` has loaded. */
export type AvatarImageProps = WithStringClassName<BaseAvatar.Image.Props>;

/** Base UI's `Avatar.Fallback`, rendered as `Text`: shown until the image loads. */
export type AvatarInitialsProps = Pick<AvatarType, "initials"> &
  TextProps &
  Pick<BaseAvatar.Fallback.Props, "delay">;

export type AvatarNameProps = Pick<AvatarType, "name"> & TextProps;

export type AvatarDescriptionProps = Pick<AvatarType, "description"> &
  TextProps;

export type AvatarProps = {
  ImageProps?: AvatarImageProps;
  InitialsProps?: AvatarInitialsProps;
  NameProps?: AvatarNameProps;
  DescriptionProps?: AvatarDescriptionProps;
} & AvatarType &
  AvatarContainerProps &
  AvatarVariants;
