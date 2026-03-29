import { Kbd } from "@uiid/indicators";
import { Group, Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

export function KbdPreview() {
  return (
    <Stack gap={3}>
      <Group gap={2} ay="center">
        <Text size={0}>Save</Text>
        <Kbd hotkey={["meta", "s"]} />
      </Group>
      <Group gap={2} ay="center">
        <Text size={0}>Copy</Text>
        <Kbd hotkey={["meta", "c"]} />
      </Group>
      <Group gap={2} ay="center">
        <Text size={0}>Undo</Text>
        <Kbd hotkey={["meta", "z"]} />
      </Group>
    </Stack>
  );
}
