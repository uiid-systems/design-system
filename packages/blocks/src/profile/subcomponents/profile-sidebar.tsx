import { Stack, type StackProps } from "@uiid/layout";

import { GRID_GAP, PROFILE_INFO_CARD_MINWIDTH } from "../profile.constants";

export type ProfileSidebarProps = StackProps;

export const ProfileSidebar = ({ children, ...props }: ProfileSidebarProps) => {
  return (
    <Stack
      ax="stretch"
      gap={GRID_GAP}
      style={{ minWidth: PROFILE_INFO_CARD_MINWIDTH }}
      {...props}
    >
      {children}
    </Stack>
  );
};
ProfileSidebar.displayName = "ProfileSidebar";
