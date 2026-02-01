import type { PreviewConfig } from "@uiid/registry";

import { Stack } from "@uiid/layout";

import { ComponentDetailsHeader } from "@/components/component-details";
import { PreviewProvider } from "@/components/preview-context";

interface MdxContentProps {
  name: string;
  packageName: string;
  category: string;
  previews?: PreviewConfig[];
  children: React.ReactNode;
}

/**
 * Wrapper for MDX content pages.
 * Provides consistent layout, header, and preview context.
 */
export function MdxContent({
  name,
  packageName,
  category,
  previews,
  children,
}: MdxContentProps) {
  return (
    <Stack data-slot="mdx-content" gap={6} p={8} pb={32} fullwidth>
      <ComponentDetailsHeader
        name={name}
        packageName={packageName}
        category={category}
      />
      <PreviewProvider previews={previews ?? []}>
        <article className="prose">{children}</article>
      </PreviewProvider>
    </Stack>
  );
}
