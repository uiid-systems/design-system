import { Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

export function TextPreview() {
  return (
    <Stack gap={4}>
      <Text size={-1}>You can do hard things</Text>
      <Text size={0}>You can do hard things</Text>
      <Text size={1}>You can do hard things</Text>
      <Text size={2}>You can do hard things</Text>
      <Text size={3}>You can do hard things</Text>
      <Text size={4}>You can do hard things</Text>
      <Text size={5}>You can do hard things</Text>
      <Text size={6}>You can do hard things</Text>
    </Stack>
  );
}
