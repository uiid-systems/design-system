import type { Icon } from "@uiid/icons";
import type { GroupProps, StackProps } from "@uiid/layout";
import type { TextProps } from "@uiid/typography";
import type { RenderProp } from "@uiid/utils";

export type CardContainerProps = StackProps;
export type CardHeaderProps = GroupProps;
export type CardTitleProps = TextProps;
export type CardDescriptionProps = TextProps;
export type CardIconProps = {
  icon?: Icon;
  className?: string;
  render?: RenderProp;
};
export type CardActionProps = GroupProps;
export type CardFooterProps = GroupProps;
export type CardThumbnailProps = StackProps;
export type InnerContainerProps = StackProps;

/**
 * Palette hue for the colored surface treatment. Mirrors the portable palette
 * from `@uiid/typography` (`paletteColorStyles`); one hue resolves the card's
 * background, foreground, and border together.
 */
export type CardColor =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "indigo"
  | "purple"
  | "neutral";

export type CardProps = Omit<StackProps, "title" | "color"> & {
  title?: React.ReactNode;
  /** Palette hue applied as a full bg/fg/border surface treatment. */
  color?: CardColor;
  description?: React.ReactNode;
  thumbnail?: React.ReactNode;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  ContainerProps?: CardContainerProps;
  HeaderProps?: CardHeaderProps;
  TitleProps?: CardTitleProps;
  DescriptionProps?: CardDescriptionProps;
  IconProps?: CardIconProps;
  ActionProps?: CardActionProps;
  FooterProps?: CardFooterProps;
  ThumbnailProps?: CardThumbnailProps;
  InnerContainerProps?: InnerContainerProps;
} & Pick<CardIconProps, "icon">;
