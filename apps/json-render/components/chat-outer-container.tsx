import { Group, type GroupProps } from "@uiid/layout";

type ChatOuterContainerProps = GroupProps;

export const ChatOuterContainer = ({
  children,
  ...props
}: ChatOuterContainerProps) => {
  return (
    <Group
      data-slot="chat-outer-container"
      fullscreen
      ay="stretch"
      ax="stretch"
      {...props}
    >
      {children}
    </Group>
  );
};
ChatOuterContainer.displayName = "ChatOuterContainer";
