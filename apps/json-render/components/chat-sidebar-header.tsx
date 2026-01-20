import { Group } from "@uiid/layout";
import { Text } from "@uiid/typography";

export const ChatSidebarHeader = () => {
  return (
    <Group
      data-slot="chat-sidebar-header"
      gap={4}
      ax="space-between"
      ay="center"
      p={4}
      style={{ borderBottom: "1px solid var(--globals-border-color)" }}
    >
      <Text size={3} weight="bold">
        uiid + json-render
      </Text>
    </Group>
  );
};
ChatSidebarHeader.displayName = "ChatSidebarHeader";
