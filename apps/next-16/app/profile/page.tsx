import { Button } from "@uiid/buttons";
import { Card } from "@uiid/cards";
import { HeartIcon, MailIcon, PencilIcon, StarIcon } from "@uiid/icons";
import { Avatar, Badge } from "@uiid/indicators";
import { Group, Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

export default function ProfileLayout() {
  return (
    <Group gap={4} fullwidth>
      <Card p={8} gap={8} ax="center" className="min-w-xs">
        <Stack gap={4} ax="center">
          <Avatar
            initials="AF"
            name="Adam Fratino"
            description="Software Engineer"
            orientation="vertical"
            size="large"
          />
          <Badge size="large" tone="positive" hideIndicator>
            Active
          </Badge>
        </Stack>

        <Stack render={<ul />} gap={4} fullwidth ax="stretch">
          <ListItem label="Location" value="Brooklyn, NY" />
          <ListItem label="Member since" value="January 2026" />
          <ListItem label="Matches played" value="21" />
        </Stack>

        <Stack gap={2} fullwidth>
          <Button size="small" fullwidth>
            <MailIcon />
            Message
          </Button>

          <Button size="small" fullwidth>
            <StarIcon className="fill-yellow-400" />
            Follow
          </Button>
          <Button size="small" fullwidth>
            <HeartIcon className="fill-red-400" />
            Favorite
          </Button>

          <Button size="small" variant="subtle" fullwidth>
            <PencilIcon />
            Edit profile
          </Button>
        </Stack>
      </Card>
      <Card title="Profile details" fullwidth />
    </Group>
  );
}

const ListItem = ({ label, value }: { label: string; value: string }) => {
  return (
    <Group render={<li />} ax="space-between" fullwidth>
      <Text shade="accent">{label}</Text>
      <Text weight="bold">{value}</Text>
    </Group>
  );
};
ListItem.displayName = "ListItem";
