import { Button } from "@uiid/buttons";
import { Stack } from "@uiid/layout";
import { SwordsIcon, StarIcon, HeartIcon } from "@uiid/icons";

export const ProfileInfoActions = () => {
  return (
    <Stack gap={2} fullwidth>
      <Button size="small" fullwidth>
        <SwordsIcon />
        Challenge
      </Button>
      <Button size="small" fullwidth>
        <StarIcon className="fill-yellow-400" />
        Follow
      </Button>
      <Button size="small" fullwidth>
        <HeartIcon className="fill-red-400" />
        Favorite
      </Button>
    </Stack>
  );
};
ProfileInfoActions.displayName = "ProfileInfoActions";
