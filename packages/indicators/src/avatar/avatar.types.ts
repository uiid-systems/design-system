import type { LayerProps } from "@uiid/layout";
import type { TextProps } from "@uiid/typography";

export type AvatarType = {
  initials: string;
  name: string;
  description: string;
};

export type AvatarLayersProps = LayerProps;

export type AvatarImageProps = {
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>;

export type AvatarInitialsProps = Pick<AvatarType, "initials"> & TextProps;
export type AvatarNameProps = Pick<AvatarType, "name"> & TextProps;
export type AvatarDescriptionProps = Pick<AvatarType, "description"> &
  TextProps;

export type AvatarProps = {
  ImageProps?: AvatarImageProps;
  InitialsProps?: AvatarInitialsProps;
  NameProps?: AvatarNameProps;
  DescriptionProps?: AvatarDescriptionProps;
} & AvatarType;
