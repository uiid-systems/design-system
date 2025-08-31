export type BaseButtonProps = Omit<
  React.ComponentProps<"button">,
  "aria-label"
> & {
  variant?: "primary" | "secondary" | "tertiary" | "inverted";
  size?: "sm" | "md" | "lg";
  fill?: "solid" | "outline" | "ghost";
  shape?: "rounded" | "pill";
  loading?: boolean;
  loadingText?: string;
};
