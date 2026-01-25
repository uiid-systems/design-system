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
      ax="stretch"
      style={{
        width: "400px",
        minWidth: "400px",
        borderRight: "1px solid var(--globals-border-color)",
      }}
      {...props}
    >
      {children}
    </Stack>
  );
};
ChatSidebarContainer.displayName = "ChatSidebarContainer";
