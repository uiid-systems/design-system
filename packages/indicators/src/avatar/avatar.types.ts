import type { GroupProps, LayerProps } from "@uiid/layout";
import type { TextProps } from "@uiid/typography";
import type { VariantProps } from "@uiid/utils";

import { avatarVariants } from "./avatar.variants";

export type AvatarVariants = VariantProps<typeof avatarVariants>;

export type AvatarType = {
  initials: string;
  name: string;
  description: string;
};

export type AvatarContainerProps = Omit<GroupProps, "ax" | "ay"> & {
  orientation?: "horizontal" | "vertical";
};

export type AvatarLayersProps = LayerProps & AvatarVariants;

export type AvatarImageProps = {
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>;

export type AvatarInitialsProps = Pick<AvatarType, "initials"> &
  Omit<TextProps, "size"> &
  Pick<AvatarVariants, "size">;

export type AvatarNameProps = Pick<AvatarType, "name"> &
  Omit<TextProps, "size"> &
  Pick<AvatarVariants, "size">;

export type AvatarDescriptionProps = Pick<AvatarType, "description"> &
  Omit<TextProps, "size"> &
  Pick<AvatarVariants, "size">;

export type AvatarProps = {
  ContainerProps?: AvatarContainerProps;
  ImageProps?: AvatarImageProps;
  InitialsProps?: AvatarInitialsProps;
  NameProps?: AvatarNameProps;
  DescriptionProps?: AvatarDescriptionProps;
} & AvatarType &
  AvatarContainerProps &
  AvatarVariants;
