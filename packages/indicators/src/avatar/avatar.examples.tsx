import { Group, Stack } from "@uiid/layout";
import { PALETTE_HUES } from "@uiid/tokens";

import { Avatar } from "./avatar";
import {
  AvatarContainer,
  AvatarDescription,
  AvatarImage,
  AvatarInitials,
  AvatarLayers,
  AvatarName,
} from "./subcomponents";

const AVATAR_SRC = "https://avatars.githubusercontent.com/u/9919?v=4";

export const Default = () => <Avatar initials="AF" />;

/* A name, and optionally a description, sit beside the avatar. */
export const WithName = () => (
  <Stack gap={4}>
    <Avatar initials="AF" name="Adam Fratino" />
    <Avatar initials="AF" name="Adam Fratino" description="Engineer" />
  </Stack>
);

/* Vertical stacks the name under the avatar and centres both. */
export const Vertical = () => (
  <Group gap={8}>
    <Avatar initials="AF" orientation="vertical" />
    <Avatar initials="AF" name="Adam Fratino" orientation="vertical" />
    <Avatar
      initials="AF"
      name="Adam Fratino"
      description="Engineer"
      orientation="vertical"
    />
  </Group>
);

/* A hue tints the avatar the way it tints a Badge. */
export const Colors = () => (
  <Group gap={2} wrap>
    {PALETTE_HUES.map((color) => (
      <Avatar
        key={color}
        color={color}
        initials={color.slice(0, 2).toUpperCase()}
      />
    ))}
  </Group>
);

/*
 * The image replaces the initials once it loads. A missing or broken image
 * leaves the initials in place.
 */
export const Image = () => (
  <Stack gap={4}>
    <Avatar initials="GH" src={AVATAR_SRC} />
    <Avatar initials="GH" src={AVATAR_SRC} name="GitHub" />
    <Avatar
      initials="GH"
      src="/missing-avatar.png"
      name="GitHub"
      description="The image failed, so the initials stay"
    />
  </Stack>
);

/* The parts compose without the monolith, for layouts it does not cover. */
export const Composed = () => (
  <AvatarContainer gap={3}>
    <AvatarLayers color="indigo">
      <AvatarImage src={AVATAR_SRC} alt="" />
      <AvatarInitials initials="GH" delay={300} />
    </AvatarLayers>
    <Stack gap={1}>
      <AvatarName name="GitHub" />
      <AvatarDescription description="Initials wait 300ms before showing" />
    </Stack>
  </AvatarContainer>
);
