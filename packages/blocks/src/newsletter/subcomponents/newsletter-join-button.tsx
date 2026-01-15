import { Button, type ButtonProps } from "@uiid/buttons";

export type NewsletterJoinButtonProps = ButtonProps & {
  icon?: React.ElementType;
  color?: string;
};

export const NewsletterJoinButton = ({
  children,
  icon,
  color = "#5865F2",
  style,
  ...props
}: NewsletterJoinButtonProps) => {
  const Icon = icon;
  return (
    <Button
      size="small"
      fullwidth
      style={{
        backgroundColor: color,
        borderColor: color,
        color: "var(--white)",
        ...style,
      }}
      {...props}
    >
      {Icon && <Icon />}
      {children}
    </Button>
  );
};
NewsletterJoinButton.displayName = "NewsletterJoinButton";
