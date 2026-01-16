import { Card } from "@uiid/cards";

import { GRID_GAP, PROFILE_INFO_CARD_PADDING_Y } from "../../profile.constants";

import { ProfileInfoFooter } from "./profile-info-footer";

export const ProfileInfoContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Card
      p={PROFILE_INFO_CARD_PADDING_Y}
      gap={GRID_GAP}
      ax="center"
      footer={<ProfileInfoFooter />}
    >
      {children}
    </Card>
  );
};
ProfileInfoContainer.displayName = "ProfileInfoContainer";
