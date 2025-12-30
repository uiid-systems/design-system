import { Stack } from "@uiid/layout";
import { Text as TextComponent, type TextProps } from "@uiid/typography";

export function Text() {
  return (
    <Stack gap={8}>
      {Array.from({ length: 9 })
        .reverse()
        .map((_, i) => (
          <TextComponent key={i} size={i as TextProps["level"]}>
            Text level {i}
          </TextComponent>
        ))}
    </Stack>
  );
}
