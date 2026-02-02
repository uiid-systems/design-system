import { Group, Stack } from "@uiid/layout";

import { BlockInfoBar } from "./block-info-bar";
import { HeaderActions } from "./header-actions";

export const Header = () => {
  return (
    <Stack ax="stretch">
      <Group
        data-slot="header"
        ay="center"
        ax="space-between"
        p={2}
        gap={2}
        bb={1}
      >
        <HeaderActions />
      </Group>
      <BlockInfoBar />
    </Stack>
  );
};
