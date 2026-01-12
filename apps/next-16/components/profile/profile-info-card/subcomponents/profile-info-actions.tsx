import { Button } from "@uiid/buttons";
import { Stack } from "@uiid/layout";
import { SwordsIcon, StarIcon, HeartIcon } from "@uiid/icons";

export const ProfileInfoActions = () => {
  return (
    <Stack gap={2} fullwidth ax="stretch">
      <Button>
        <SwordsIcon />
        Challenge
      </Button>

      <Button>
        <StarIcon className="fill-yellow-400" />
        Follow
      </Button>

      <Button>
        <HeartIcon className="fill-red-400" />
        Favorite
      </Button>
    </Stack>
  );
};
ProfileInfoActions.displayName = "ProfileInfoActions";
