import { Avatar, type AvatarProps } from "@uiid/indicators";

export type ProfileInfoAvatarProps = Pick<
  AvatarProps,
  "initials" | "name" | "description"
>;

export const ProfileInfoAvatar = ({
  initials,
  name,
  description,
}: ProfileInfoAvatarProps) => {
  return (
    <Avatar
      initials={initials}
      name={name}
      description={description}
      orientation="vertical"
      size="large"
    />
  );
};
ProfileInfoAvatar.displayName = "ProfileInfoAvatar";
