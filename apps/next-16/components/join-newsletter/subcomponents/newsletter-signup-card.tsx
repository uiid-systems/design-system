import { Card, type CardProps } from "@uiid/cards";
import { GlobeIcon } from "@uiid/icons";

export type NewsletterSignupCardProps = CardProps;
export const NewsletterSignupCard = ({
  children,
  ...props
}: NewsletterSignupCardProps) => {
  return (
    <Card
      icon={GlobeIcon}
      title="Welcome to shuff.club"
      description="Currently in closed beta, we're looking to build a more active, organized and inclusive shuffleboard community."
      gap={4}
      p={8}
      className="min-w-sm min-h-32 max-w-sm"
      {...props}
    >
      {children}
    </Card>
  );
};
NewsletterSignupCard.displayName = "NewsletterSignupCard";
