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
  /**
   * Surface treatment.
   * - `"ghost"` removes the background, border, shadow. Keeps layout properties.
   * - `"shell"` is a page's main content area: `fullwidth`, `p={6}`, no border,
   *   radius or shadow, transparent until `color` is set, a page-heading title
   *   (`<h2>`, size 4, medium) with the title and description capped at 720px,
   *   and `gap={6}` between the header and body and between the body's children.
   */
  variant?: "ghost" | "shell";
  /**
   * Palette hue applied as a full bg/fg/border surface treatment. Defaults to
   * `"neutral"`, except on the "shell" variant, which stays transparent until set.
   */
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
