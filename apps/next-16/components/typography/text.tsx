import { Stack } from "@uiid/layout";
import { Text as TextComponent, type TextProps } from "@uiid/typography";

export function Text() {
  return (
    <Stack gap={4}>
      {Array.from({ length: 8 }).map((_, i) => (
        <TextComponent key={i} level={i as TextProps["level"]}>
          TKTKTKTK
        </TextComponent>
      ))}
    </Stack>
  );
}
