import type { Icon } from "@uiid/icons";
import type { GroupProps, StackProps } from "@uiid/layout";
import type { TextProps } from "@uiid/typography";
import type { VariantProps } from "@uiid/utils";

import type { cardVariants } from "./card.variants";

export type CardVariantProps = VariantProps<typeof cardVariants>;

export type CardHeaderProps = GroupProps;
export type CardTitleProps = TextProps;
export type CardDescriptionProps = TextProps;
export type CardIconProps = Pick<CardVariantProps, "tone"> & {
  icon?: Icon;
  className?: string;
};
export type CardActionProps = GroupProps;
export type CardFooterProps = GroupProps;

export type CardProps = Omit<StackProps, "size" | "title"> &
  CardVariantProps & {
    title?: string;
    description?: React.ReactNode;
    action?: React.ReactNode;
    footer?: React.ReactNode;
    HeaderProps?: CardHeaderProps;
    TitleProps?: CardTitleProps;
    DescriptionProps?: CardDescriptionProps;
    IconProps?: CardIconProps;
    ActionProps?: CardActionProps;
    FooterProps?: CardFooterProps;
  } & Pick<CardIconProps, "icon">;
