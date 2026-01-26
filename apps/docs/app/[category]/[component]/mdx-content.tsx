import { Stack } from "@uiid/layout";

import { ComponentDetailsHeader } from "@/components/component-details";

interface MdxContentProps {
  name: string;
  packageName: string;
  category: string;
  children: React.ReactNode;
}

/**
 * Wrapper for MDX content pages.
 * Provides consistent layout and header.
 */
export function MdxContent({
  name,
  packageName,
  category,
  children,
}: MdxContentProps) {
  return (
    <Stack data-slot="mdx-content" gap={6} p={8} pb={32} fullwidth>
      <ComponentDetailsHeader
        name={name}
        packageName={packageName}
        category={category}
      />
      <article className="prose">{children}</article>
    </Stack>
  );
}
