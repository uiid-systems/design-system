import { Group } from "@uiid/layout";
import { Text } from "@uiid/typography";

export type VersusTextProps = {
  opponent: string;
};

export const VersusText = ({ opponent }: VersusTextProps) => (
  <Group ay="center" gap={2}>
    <Text shade="muted" size={0}>
      vs.
    </Text>
    {opponent}
  </Group>
);
VersusText.displayName = "VersusText";
