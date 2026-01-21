import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";

import { registry, generateComponentDocs } from "@uiid/registry";

import { toSlug } from "@/constants/urls";
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
  return Object.values(registry).find(
    (entry) => toSlug(entry.name) === slug
  );
}

/**
 * Read the preview source file for a component
 */
function getPreviewSource(componentName: string): string | undefined {
  const slug = toSlug(componentName);
  const previewPath = path.join(
    process.cwd(),
    "components",
    "previews",
    `${slug}-preview.tsx`
  );

  try {
    if (fs.existsSync(previewPath)) {
      return fs.readFileSync(previewPath, "utf-8");
    }
  } catch {
    // File doesn't exist or can't be read
  }

  return undefined;
}

export default async function ComponentPage({ params }: ComponentPageProps) {
  const { category, component } = await params;
  const entry = findComponentBySlug(component);

  if (!entry || entry.category !== category) {
    notFound();
  }

  const docs = generateComponentDocs(entry);
  const sourceCode = getPreviewSource(entry.name);

  return (
    <ComponentDetails
      name={entry.name}
      packageName={entry.package}
      description={entry.description}
      props={docs.props}
      sourceCode={sourceCode}
    />
  );
}
