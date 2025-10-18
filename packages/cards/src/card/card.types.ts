import type { ButtonProps } from "@uiid/buttons";
import type { StackProps } from "@uiid/layout";

export type CardActionProps = {
  text: string;
  onClick: () => void;
  variant?: ButtonProps["variant"];
};

type CardWithButtonProps = {
  primaryAction?: CardActionProps;
  secondaryAction?: CardActionProps;
  tertiaryAction?: CardActionProps;
};

type CardAsLinkProps = Pick<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "target" | "rel"
>;

export type CardProps = StackProps & {
  size?: "sm" | "md" | "lg";
  variant?: "info" | "warning" | "error" | "success" | "inverted";
  title?: string;
  onDismiss?: () => void;
  primaryAction?: CardActionProps;
  secondaryAction?: CardActionProps;
  tertiaryAction?: CardActionProps;
} & (CardWithButtonProps | CardAsLinkProps);
