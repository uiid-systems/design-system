import type { Icon } from "@uiid/icons";
import type { GroupProps, StackProps } from "@uiid/layout";
import type { TextProps } from "@uiid/typography";
import type { RenderProp, VariantProps } from "@uiid/utils";

import type { cardVariants } from "./card.variants";

export type CardVariantProps = VariantProps<typeof cardVariants>;

export type CardContainerProps = StackProps & CardVariantProps;
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

export type CardProps = Omit<StackProps, "size" | "title"> &
  CardVariantProps & {
    title?: React.ReactNode;
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
  } & Pick<CardIconProps, "icon">;
