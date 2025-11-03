import { Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

export const MonthCarouselSlide = ({
  month,
}: {
  month: string;
  size?: number;
}) => {
  return (
    <Stack ax="center">
      <Text level={2} bold>
        {month}
      </Text>
    </Stack>
  );
};
MonthCarouselSlide.displayName = "MonthCarouselSlide";
