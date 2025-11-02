import type { ButtonProps } from "@uiid/buttons";
import type { StackProps } from "@uiid/layout";
import type { RenderProp } from "@uiid/utils";

export type CardActionProps = {
  text: string;
  onClick: () => void;
  variant?: ButtonProps["variant"];
};

type CardWithButtonProps = {
  primaryAction?: CardActionProps;
  secondaryAction?: CardActionProps;
  tertiaryAction?: CardActionProps;
  onDismiss?: () => void;
};

type CardAsLinkProps = Pick<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "target" | "rel"
>;

export type CardProps = StackProps & {
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "info" | "warning" | "error" | "success" | "inverted";
  title?: string;
  primaryAction?: CardActionProps;
  secondaryAction?: CardActionProps;
  tertiaryAction?: CardActionProps;
  renderDismissButton?: RenderProp;
  renderTitle?: RenderProp;
} & CardWithButtonProps &
  CardAsLinkProps;
