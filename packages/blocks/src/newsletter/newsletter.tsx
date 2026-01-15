import { SiDiscord } from "@icons-pack/react-simple-icons";

import { Group, Stack } from "@uiid/layout";

import {
  NewsletterBackground,
  NewsletterSignupCard,
  NewsletterSignupForm,
  NewsletterJoinButton,
  NewsletterLoginButton,
} from "./subcomponents";

export const Newsletter = () => {
  return (
    <Group fullscreen evenly>
      <NewsletterBackground />

      <Stack fullwidth fullheight ax="center" ay="center">
        <NewsletterSignupCard>
          <NewsletterSignupForm />
          <NewsletterJoinButton color="#5865F2" icon={SiDiscord}>
            Join the Discord
          </NewsletterJoinButton>
          <NewsletterLoginButton />
        </NewsletterSignupCard>
      </Stack>
    </Group>
  );
};
Newsletter.displayName = "Newsletter";
