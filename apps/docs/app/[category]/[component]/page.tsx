import { notFound } from "next/navigation";

import {
  registry,
  generateComponentDocs,
  type PreviewConfig,
} from "@uiid/registry";
import { Text } from "@uiid/typography";
import { Box, Separator } from "@uiid/layout";
import { CodeInline } from "@uiid/code";
import { List, ListItem } from "@uiid/lists";

import { toSlug } from "@/constants/urls";
import { getMdxSource, compileMdxContent } from "@/lib/mdx";
import {
  CodeBlock,
  ComponentLink,
  Preview,
  PropsTable,
} from "@/components/mdx";
import { MdxContent } from "./mdx-content";
import { ComponentDetails } from "./component-details";

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
      // Headings
      h1: (props: Record<string, unknown>) => (
        <Text render={<h1 />} size={6} weight="bold" {...props} />
      ),
      h2: (props: Record<string, unknown>) => (
        <Text render={<h2 />} size={4} weight="bold" {...props} />
      ),
      h3: (props: Record<string, unknown>) => (
        <Text
          render={<h3 />}
          size={3}
          mt={12}
          mb={4}
          weight="bold"
          {...props}
        />
      ),
      h4: (props: Record<string, unknown>) => (
        <Text render={<h4 />} size={2} weight="bold" {...props} />
      ),
      // Body text
      p: (props: Record<string, unknown>) => (
        <Text render={<p />} size={1} balance {...props} />
      ),
      // Lists
      ul: (props: Record<string, unknown>) => (
        <List type="unordered" {...props} />
      ),
      ol: (props: Record<string, unknown>) => (
        <List type="ordered" {...props} />
      ),
      li: (props: Record<string, unknown>) => (
        <ListItem
          label={props.children as string}
          value={props.children as string}
          maxw={640}
          {...props}
        />
      ),
      // Links
      a: (props: Record<string, unknown>) => (
        <Text render={<a />} size={1} underline tone="info" {...props} />
      ),
      // Text emphasis
      strong: (props: Record<string, unknown>) => (
        <Text render={<strong />} weight="bold" {...props} />
      ),
      em: (props: Record<string, unknown>) => (
        <Text render={<em />} style={{ fontStyle: "italic" }} {...props} />
      ),
      // Code
      code: (props: Record<string, unknown>) => <CodeInline {...props} />,
      pre: (props: Record<string, unknown>) => <CodeBlock {...props} />,
      // Blockquote
      blockquote: (props: Record<string, unknown>) => (
        <Box
          render={<blockquote />}
          pl={4}
          py={2}
          style={{ borderLeft: "4px solid var(--shade-accent)" }}
          {...props}
        />
      ),
      // Horizontal rule
      hr: () => <Separator my={6} />,
      // Pass components that get data from this page
      Preview: (props: Record<string, unknown>) => (
        <Preview name={entry.name} previews={previews} {...props} />
      ),
      PropsTable: (props: Record<string, unknown>) => (
        <PropsTable props={docs.props} {...props} />
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
