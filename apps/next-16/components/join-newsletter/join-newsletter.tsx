import { SiDiscord } from "@icons-pack/react-simple-icons";

import { Group, Stack } from "@uiid/layout";

import {
  NewsletterList,
  NewsletterSignupCard,
  NewsletterSignupForm,
  NewsletterJoinButton,
  NewsletterLoginButton,
} from "./subcomponents";

export const JoinNewsletter = () => {
  return (
    <Group fullwidth fullheight evenly>
      <Stack fullwidth fullheight ax="center" ay="center">
        <NewsletterSignupCard>
          {/* <NewsletterList /> */}
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
JoinNewsletter.displayName = "JoinNewsletter";
