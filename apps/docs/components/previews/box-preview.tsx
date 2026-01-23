import { Box } from "@uiid/layout";
import { Text } from "@uiid/typography";

export function BoxPreview() {
  return (
    <Box p={5} b={5} rounded>
      <Text>What's in the box?</Text>
    </Box>
  );
}
