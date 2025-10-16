import type { RenderProp } from "@uiid/utils";

// Base button styling and behavior props
type ButtonCoreProps = {
  variant?: "primary" | "secondary" | "tertiary" | "inverted" | "subtle";
  size?: "sm" | "md" | "lg";
  fill?: "solid" | "outline" | "ghost";
  shape?: "rounded" | "pill";
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  iconPosition?: "before" | "after";
  render?: RenderProp;
  children?: React.ReactNode;
};

// Merge button and anchor attributes, making conflicting ones optional
type ButtonOrAnchorAttributes =
  // All button attributes
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type" | "size"> &
    // All anchor attributes
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "type"> & {
      // Handle conflicting 'type' attribute
      type?:
        | React.ButtonHTMLAttributes<HTMLButtonElement>["type"]
        | React.AnchorHTMLAttributes<HTMLAnchorElement>["type"];
      // Optional href - when present, renders as anchor
      href?: string;
      // disabled only valid when href is not present
      disabled?: boolean;
    };

// Icon-only button requires aria-label
type ButtonWithIconOnly = ButtonCoreProps &
  ButtonOrAnchorAttributes & {
    icon: React.ReactNode;
    iconPosition?: undefined;
    "aria-label": string;
  };

// Button with positioned icon
type ButtonWithPositionedIcon = ButtonCoreProps &
  ButtonOrAnchorAttributes & {
    icon?: React.ReactNode;
    iconPosition: "before" | "after";
    "aria-label"?: string;
  };

// Button without icon
type ButtonWithoutIcon = ButtonCoreProps &
  ButtonOrAnchorAttributes & {
    icon?: undefined;
    iconPosition?: undefined;
    "aria-label"?: string;
  };

export type ButtonProps =
  | ButtonWithIconOnly
  | ButtonWithPositionedIcon
  | ButtonWithoutIcon;
