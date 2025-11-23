import { Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

export const Headline = () => {
  return (
    <Stack gap={8}>
      <Text render={<h1 />} level={6} bold>
        The UIID Design System
      </Text>

      <Text render={<p />} level={1}>
        The <strong>UIID Design System</strong> is a modern, modular React
        component library built with{" "}
        <strong>
          <a href="https://www.typescriptlang.org/" target="_blank">
            TypeScript
          </a>
          ,{" "}
          <a href="https://vitejs.dev/" target="_blank">
            Vite
          </a>
          , and{" "}
          <a href="https://base-ui.com/" target="_blank">
            Base UI
          </a>
        </strong>
        . Designed for performance, accessibility, and developer experience.
      </Text>
    </Stack>
  );
};
Headline.displayName = "Headline";
