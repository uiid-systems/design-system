import { Avatar } from "@uiid/indicators";
import { Group, Stack } from "@uiid/layout";

export function AvatarPreview() {
  return (
    <Stack gap={4}>
      <Avatar initials="JD" name="Jane Doe" description="Software Engineer" />
      <Avatar initials="AB" name="Alex Brown" description="Product Manager" orientation="vertical" />
      <Group gap={4} ay="center">
        <Avatar initials="SM" name="Small" description="Small size" size="small" />
        <Avatar initials="MD" name="Medium" description="Medium size" size="medium" />
        <Avatar initials="LG" name="Large" description="Large size" size="large" />
      </Group>
    </Stack>
  );
}
