import { Stack, type StackProps } from "@uiid/layout";
import { Text } from "@uiid/typography";

type ChatMessageEmptyProps = StackProps;

export const ChatMessageEmpty = ({ ...props }: ChatMessageEmptyProps) => {
  return (
    <Stack
      data-slot="chat-sidebar-empty"
      gap={4}
      ay="center"
      fullheight
      {...props}
    >
      <Text family="mono" size={-1} shade="muted">
        {'"Create a login form with email and password"'}
      </Text>
      <Text family="mono" size={-1} shade="muted">
        {'"Build a pricing card with three tiers"'}
      </Text>
      <Text family="mono" size={-1} shade="muted">
        {'"Make a settings panel with toggles"'}
      </Text>
    </Stack>
  );
};
ChatMessageEmpty.displayName = "ChatMessageEmpty";
