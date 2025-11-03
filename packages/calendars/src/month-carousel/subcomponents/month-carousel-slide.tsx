import { Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

import styles from "./month-carousel-slide.module.css";

export const MonthCarouselSlide = ({
  month,
}: {
  month: string;
  size?: number;
}) => {
  return (
    <Stack ax="center" className={styles["month-carousel-slide"]}>
      <Text level={0} bold>
        {month}
      </Text>
    </Stack>
  );
};
MonthCarouselSlide.displayName = "MonthCarouselSlide";
