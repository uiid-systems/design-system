type BaseButtonProps = Omit<React.ComponentProps<"button">, "aria-label"> & {
  variant?: "primary" | "secondary" | "tertiary" | "inverted";
  size?: "sm" | "md" | "lg";
  fill?: "solid" | "outline" | "ghost";
  shape?: "rounded" | "pill";
  loading?: boolean;
  loadingText?: string;
};

type ButtonWithIconOnly = BaseButtonProps & {
  icon: React.ReactNode;
  iconPosition?: undefined;
  "aria-label": string;
};

type ButtonWithPositionedIcon = BaseButtonProps & {
  icon?: React.ReactNode;
  iconPosition: "before" | "after";
  "aria-label"?: string;
};

type ButtonWithoutIcon = BaseButtonProps & {
  icon?: undefined;
  iconPosition?: undefined;
  "aria-label"?: string;
};

export type ButtonProps =
  | ButtonWithIconOnly
  | ButtonWithPositionedIcon
  | ButtonWithoutIcon;
