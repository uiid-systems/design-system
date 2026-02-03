import { notFound } from "next/navigation";

import {
  registry,
  generateComponentDocs,
  type PreviewConfig,
} from "@uiid/registry";
import { Text } from "@uiid/typography";

import { toSlug } from "@/constants/urls";
import { getMdxSource, compileMdxContent } from "@/lib/mdx";
import {
  CodeBlock,
  ComponentLink,
  Preview,
  PropsTable,
  Usage,
} from "@/components/mdx";
import { MdxContent } from "./mdx-content";
import { ComponentDetails } from "./component-details";
import { Stack } from "@uiid/layout";

/**
 * Generate static params for all components in the registry
 */
export function generateStaticParams() {
  return Object.values(registry).map((entry) => ({
    category: entry.category || "uncategorized",
    component: toSlug(entry.name),
  }));
}

type ComponentPageProps = {
  params: Promise<{ category: string; component: string }>;
};

/**
 * Find a component entry by its slug
 */
function findComponentBySlug(slug: string) {
  return Object.values(registry).find((entry) => toSlug(entry.name) === slug);
}

export default async function ComponentPage({ params }: ComponentPageProps) {
  const { category, component } = await params;
  const entry = findComponentBySlug(component);

  if (!entry || entry.category !== category) {
    notFound();
  }

  const docs = generateComponentDocs(entry);
  const previews = (entry.previews as PreviewConfig[] | undefined) ?? undefined;

  // Check for MDX content
  const mdxSource = getMdxSource(category, entry.name);

  if (mdxSource) {
    // Render MDX page
    const { content } = await compileMdxContent(mdxSource, {
      // Map native elements to design system components
      p: (props: Record<string, unknown>) => (
        <Text render={<p />} size={1} balance {...props} />
      ),
      ul: (props: Record<string, unknown>) => (
        <Stack
          render={<ul />}
          gap={2}
          style={{ maxWidth: "40rem" }}
          {...props}
        />
      ),
      ol: (props: Record<string, unknown>) => (
        <Stack
          render={<ol />}
          gap={2}
          style={{ maxWidth: "40rem" }}
          {...props}
        />
      ),
      li: (props: Record<string, unknown>) => (
        <Text render={<li />} size={0} {...props} />
      ),
      pre: (props: Record<string, unknown>) => <CodeBlock {...props} />,
      // Pass components that get data from this page
      Preview: (props: Record<string, unknown>) => (
        <Preview name={entry.name} previews={previews} {...props} />
      ),
      PropsTable: (props: Record<string, unknown>) => (
        <PropsTable props={docs.props} {...props} />
      ),
      Usage: (props: Record<string, unknown>) => (
        <Usage previews={previews} {...props} />
      ),
      ComponentLink,
    });

    return (
      <MdxContent
        name={entry.name}
        description={entry.description}
        packageName={entry.package}
        category={category}
        previews={previews}
      >
        {content}
      </MdxContent>
    );
  }

  // Fallback to legacy component details (no MDX)
  return (
    <ComponentDetails
      name={entry.name}
      packageName={entry.package}
      category={category}
      description={entry.description}
      props={docs.props}
      previews={previews}
    />
  );
}
