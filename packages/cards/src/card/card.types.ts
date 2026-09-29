import type { GroupProps, StackProps } from "@uiid/layout";
import type { PaletteColor } from "@uiid/tokens";
import type { TextProps } from "@uiid/typography";

export type CardContainerProps = StackProps;
export type CardHeaderProps = Omit<GroupProps, "children">;
export type CardTitleProps = TextProps;
export type CardDescriptionProps = TextProps;
export type CardActionProps = GroupProps;
export type CardFooterProps = GroupProps;
export type CardThumbnailProps = StackProps;
export type InnerContainerProps = StackProps;

export type CardColor = PaletteColor;

export type CardProps = Omit<StackProps, "title" | "color"> & {
  title?: React.ReactNode;
  variant?: "ghost";
  color?: CardColor;
  description?: React.ReactNode;
  thumbnail?: React.ReactNode;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  ContainerProps?: CardContainerProps;
  HeaderProps?: CardHeaderProps;
  TitleProps?: CardTitleProps;
  DescriptionProps?: CardDescriptionProps;
  ActionProps?: CardActionProps;
  FooterProps?: CardFooterProps;
  ThumbnailProps?: CardThumbnailProps;
  InnerContainerProps?: InnerContainerProps;
};
