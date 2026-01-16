import { Card } from "@uiid/cards";
import type { Icon } from "@uiid/icons";
import { Text } from "@uiid/typography";

export type ProfileStatProps = {
  icon: Icon;
  title: string;
  value: number;
};

export const ProfileStat = ({ icon, title, value }: ProfileStatProps) => {
  return (
    <Card
      icon={icon}
      title={title}
      action={
        <Text size={5} mono>
          {value}
        </Text>
      }
    />
  );
};
ProfileStat.displayName = "ProfileStat";
