import { Button } from "@uiid/buttons";
import { Stack } from "@uiid/layout";
import { SwordsIcon, StarIcon, HeartIcon } from "@uiid/icons";

import styles from "../../profile.module.css";

export const ProfileInfoActions = () => {
  return (
    <Stack gap={2} fullwidth ax="stretch">
      <Button>
        <SwordsIcon />
        Challenge
      </Button>

      <Button>
        <StarIcon className={styles["icon-yellow"]} />
        Follow
      </Button>

      <Button>
        <HeartIcon className={styles["icon-red"]} />
        Favorite
      </Button>
    </Stack>
  );
};
ProfileInfoActions.displayName = "ProfileInfoActions";
