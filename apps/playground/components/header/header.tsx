import { Group, Stack } from "@uiid/layout";

import { BlockInfo } from "./block-info";
import { HeaderActions } from "./header-actions";

export const Header = () => {
  return (
    <Stack ax="stretch">
      <Group data-slot="header" ay="center" p={2} gap={2} bb={1}>
        <BlockInfo />
        <HeaderActions />
      </Group>
    </Stack>
  );
};
