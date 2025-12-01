import { Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

export const Headline = () => {
  return (
    <Stack gap={8}>
      <Text render={<h1 />} level={6} bold>
        The UIID Design System
      </Text>

      <Text render={<p />} level={1}>
        A modern, modular component library built with{" "}
        <strong>
          <a href="https://www.typescriptlang.org/" target="_blank">
            TypeScript
          </a>
          ,{" "}
          <a href="https://vitejs.dev/" target="_blank">
            Vite
          </a>
          , and{" "}
          <a href="https://nextjs.org/" target="_blank">
            Next.js
          </a>
        </strong>
        .
      </Text>
    </Stack>
  );
};
Headline.displayName = "Headline";
