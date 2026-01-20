import { Stack, type StackProps } from "@uiid/layout";

type ChatInputContainerProps = StackProps;

export const ChatInputContainer = ({
  children,
  ...props
}: ChatInputContainerProps) => {
  return (
    <Stack
      data-slot="chat-sidebar-input-container"
      p={4}
      style={{
        borderTop: "1px solid var(--globals-border-color)",
        marginTop: "auto",
      }}
      {...props}
    >
      {children}
    </Stack>
  );
};
ChatInputContainer.displayName = "ChatInputContainer";
