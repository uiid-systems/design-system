import { BackgroundGradientBlinds } from "@uiid/backgrounds";

export const NewsletterBackground = () => {
  return (
    <BackgroundGradientBlinds
      gradientColors={["#ff0a0a", "#5227ff"]}
      angle={25}
    />
  );
};
NewsletterBackground.displayName = "NewsletterBackground";
