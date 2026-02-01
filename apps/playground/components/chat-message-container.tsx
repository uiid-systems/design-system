import { Stack, StackProps } from "@uiid/layout";

type ChatMessageContainerProps = StackProps;

export const ChatMessageContainer = ({
  children,
  ...props
}: ChatMessageContainerProps) => {
  return (
    <Stack data-slot="chat-message-container" gap={12} py={8} px={4} {...props}>
      {children}
    </Stack>
  );
};
ChatMessageContainer.displayName = "ChatMessageContainer";
