import { Stack, Group } from "@uiid/layout";
import { Text } from "@uiid/typography";

export type ProfileListProps = {
  items: ProfileListItemProps[];
};
export const ProfileList = ({ items }: ProfileListProps) => {
  return (
    <Stack render={<ul />} gap={4} fullwidth ax="stretch">
      {items.map((item) => (
        <ProfileListItem key={item.label} {...item} />
      ))}
    </Stack>
  );
};
ProfileList.displayName = "ProfileList";

export type ProfileListItemProps = {
  label: string;
  value: string;
};
export const ProfileListItem = ({ label, value }: ProfileListItemProps) => {
  return (
    <Group render={<li />} ax="space-between" fullwidth>
      <Text shade="accent">{label}</Text>
      <Text weight="bold">{value}</Text>
    </Group>
  );
};
ProfileListItem.displayName = "ProfileListItem";
