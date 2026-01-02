import type { StackProps } from "@uiid/layout";
import type { TextProps } from "@uiid/typography";
import type { VariantProps } from "@uiid/utils";

import type { cardVariants } from "./card.variants";

export type CardVariantProps = VariantProps<typeof cardVariants>;

export type CardTitleProps = TextProps;
export type CardIconProps = Pick<CardProps, "variant" | "className">;

export type CardProps = Omit<StackProps, "size" | "title"> &
  CardVariantProps & {
    title?: string;
    TitleProps?: CardTitleProps;
    IconProps?: CardIconProps;
  };
