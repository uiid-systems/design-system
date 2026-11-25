import { CodeInline, Stack, Text } from "@uiid/design-system";
import type { MDXComponents } from "mdx/types";

import { slugify } from "@/components/docs";

const headingId = (children: React.ReactNode) =>
  typeof children === "string" ? slugify(children) : undefined;

const components: MDXComponents = {
  wrapper: ({ children }) => (
    <Stack data-slot="mdx-page" pb={8} gap={6} w="full">
      {children}
    </Stack>
  ),
  h1: ({ children }) => (
    <Text render={<h1 />} size={5} weight="semibold">
      {children}
    </Text>
  ),
  h2: ({ children }) => (
    <Text render={<h2 />} id={headingId(children)} size={4} weight="semibold">
      {children}
    </Text>
  ),
  h3: ({ children }) => (
    <Text render={<h3 />} id={headingId(children)} size={2} weight="semibold">
      {children}
    </Text>
  ),
  p: ({ children }) => <Text render={<p />}>{children}</Text>,
  code: ({ children }) => <CodeInline>{children}</CodeInline>,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
