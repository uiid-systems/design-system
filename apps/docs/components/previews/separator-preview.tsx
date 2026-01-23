import { Separator, Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

export function SeparatorPreview() {
  return (
    <Stack gap={4} ax="center" fullwidth>
      <Text>As Above</Text>
      <Separator />
      <Text>So Below</Text>
    </Stack>
  );
};
