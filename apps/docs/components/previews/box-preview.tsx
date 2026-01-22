import { Box } from "@uiid/layout";
import { Text } from "@uiid/typography";

export const BoxPreview = () => {
  return (
    <Box p={4} b={1} mx={4} fullwidth>
      <Text>Box with padding</Text>
    </Box>
  );
};
BoxPreview.displayName = "BoxPreview";
