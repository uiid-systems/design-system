import { Group } from "@uiid/layout";
import { Text } from "@uiid/typography";

export const ChatSidebarHeader = () => {
  return (
    <Group
      data-slot="chat-sidebar-header"
      gap={4}
      ax="space-between"
      ay="center"
      py={8}
      px={4}
    >
      <Text size={3} weight="bold">
        uiid blocks
      </Text>
    </Group>
  );
};
ChatSidebarHeader.displayName = "ChatSidebarHeader";
