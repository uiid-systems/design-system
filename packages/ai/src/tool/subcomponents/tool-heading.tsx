import { Text } from "@uiid/typography";

export const ToolHeading = ({ children }: { children: string }) => (
  <Text size={-1} weight="medium" color="neutral" uppercase>
    {children}
  </Text>
);
ToolHeading.displayName = "ToolHeading";
