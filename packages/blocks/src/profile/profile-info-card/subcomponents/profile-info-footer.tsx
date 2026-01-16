import { Button } from "@uiid/buttons";
import { PencilIcon, BanIcon } from "@uiid/icons";
import { Stack } from "@uiid/layout";

export const ProfileInfoFooter = () => {
  return (
    <Stack gap={2} fullwidth>
      <Button variant="subtle" fullwidth>
        <PencilIcon />
        Edit profile
      </Button>

      <Button tone="negative" fullwidth>
        <BanIcon />
        Delete profile
      </Button>
    </Stack>
  );
};
ProfileInfoFooter.displayName = "ProfileInfoFooter";
