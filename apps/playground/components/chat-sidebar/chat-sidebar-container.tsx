import { Stack, type StackProps } from "@uiid/layout";

type ChatSidebarContainerProps = StackProps;

export const ChatSidebarContainer = ({
  children,
  ...props
}: ChatSidebarContainerProps) => {
  return (
    <Stack
      data-slot="chat-sidebar-container"
      fullheight
      fullwidth
      ax="stretch"
      br={1}
      {...props}
    >
      {children}
    </Stack>
  );
};
ChatSidebarContainer.displayName = "ChatSidebarContainer";
