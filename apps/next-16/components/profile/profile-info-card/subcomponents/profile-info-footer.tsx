import { Button } from "@uiid/buttons";
import { PencilIcon, BanIcon } from "@uiid/icons";
import { Stack } from "@uiid/layout";

import { EditProfileModal } from "@/components/modals";

export const ProfileInfoFooter = () => {
  return (
    <Stack gap={2} fullwidth>
      <EditProfileModal
        trigger={
          <Button variant="subtle" fullwidth>
            <PencilIcon />
            Edit profile
          </Button>
        }
      />

      <Button tone="critical" fullwidth>
        <BanIcon />
        Delete profile
      </Button>
    </Stack>
  );
};
ProfileInfoFooter.displayName = "ProfileInfoFooter";
