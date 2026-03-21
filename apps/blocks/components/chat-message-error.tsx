import { Card, type CardProps } from "@uiid/cards";
import { Text } from "@uiid/typography";

type ChatMessageErrorProps = CardProps;

export const ChatMessageError = ({
  children,
  ...props
}: ChatMessageErrorProps) => {
  return (
    <Card {...props}>
      <Text>{children}</Text>
    </Card>
  );
};
ChatMessageError.displayName = "ChatMessageError";
