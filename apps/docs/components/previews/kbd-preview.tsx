import { Kbd } from "@uiid/indicators";
import { Group, Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

export function KbdPreview() {
  return (
    <Stack gap={3}>
      <Group gap={2} ay="center">
        <Text size={0}>Save</Text>
        <Group gap={1}>
          <Kbd>{"\u2318"}</Kbd>
          <Kbd>S</Kbd>
        </Group>
      </Group>
      <Group gap={2} ay="center">
        <Text size={0}>Copy</Text>
        <Group gap={1}>
          <Kbd>{"\u2318"}</Kbd>
          <Kbd>C</Kbd>
        </Group>
      </Group>
      <Group gap={2} ay="center">
        <Text size={0}>Undo</Text>
        <Group gap={1}>
          <Kbd>{"\u2318"}</Kbd>
          <Kbd>Z</Kbd>
        </Group>
      </Group>
    </Stack>
  );
}
