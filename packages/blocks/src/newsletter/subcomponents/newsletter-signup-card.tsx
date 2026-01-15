import { Card, type CardProps } from "@uiid/cards";
import { GlobeIcon } from "@uiid/icons";

import styles from "../newsletter.module.css";

export type NewsletterSignupCardProps = CardProps;
export const NewsletterSignupCard = ({
  children,
  ...props
}: NewsletterSignupCardProps) => {
  return (
    <Card
      data-slot="newsletter-signup-card"
      className={styles["newsletter-signup-card"]}
      icon={GlobeIcon}
      title="Welcome to shuff.club"
      description="Post when you're available for a match or browse the calendar to find available matches. Play a friendly, competitive, or ranked match, and track your progress with match data."
      gap={4}
      p={8}
      {...props}
    >
      {children}
    </Card>
  );
};
NewsletterSignupCard.displayName = "NewsletterSignupCard";
