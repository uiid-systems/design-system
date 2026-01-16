import { ProfileList, type ProfileListProps } from "../subcomponents";

import {
  ProfileInfoContainer,
  ProfileInfoAvatar,
  ProfileInfoActions,
  type ProfileInfoAvatarProps,
} from "./subcomponents";

type ProfileInfoCardProps = ProfileInfoAvatarProps & {
  details: ProfileListProps["items"];
};

export const ProfileInfoCard = ({
  name,
  description,
  initials,
  details,
}: ProfileInfoCardProps) => {
  return (
    <ProfileInfoContainer>
      <ProfileInfoAvatar
        name={name}
        description={description}
        initials={initials}
      />
      <ProfileList items={details} />
      <ProfileInfoActions />
    </ProfileInfoContainer>
  );
};
ProfileInfoCard.displayName = "ProfileInfoCard";
