import { Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { CodeInline } from "./code-inline";

export const Default = () => <CodeInline>pnpm add @uiid/code</CodeInline>;

export const WithLanguage = () => (
  <CodeInline language="typescript">const x: number = 42;</CodeInline>
);

export const InText = () => (
  <Stack gap={4}>
    <Text>
      Run <CodeInline>pnpm install</CodeInline> to install dependencies.
    </Text>
    <Text>
      The <CodeInline language="typescript">useState</CodeInline> hook holds
      component state.
    </Text>
    <Text>
      Set <CodeInline language="bash">NODE_ENV=production</CodeInline> for
      production builds.
    </Text>
  </Stack>
);
