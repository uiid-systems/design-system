import Link from "next/link";
import { notFound } from "next/navigation";

import { registry } from "@uiid/registry";
import { Card } from "@uiid/cards";
import { Stack, Group } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { toSlug, urls } from "@/constants/urls";
import {
  getCategories,
  getCategoryIcon,
  getCategoryLabel,
} from "@/lib/generate-nav";

export function generateStaticParams() {
  return getCategories().map((category) => ({
    category,
  }));
}

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const categories = getCategories();

  if (!categories.includes(category)) {
    notFound();
  }

  const Icon = getCategoryIcon(category);
  const label = getCategoryLabel(category);
  const components = Object.values(registry)
    .filter((entry) => entry.category === category)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Stack gap={8} p={8}>
      {/* Header */}
      <Stack gap={4}>
        <Group gap={3}>
          {Icon && <Icon size={32} />}

          <Stack gap={4}>
            <Text render={<h1 />} size={6} weight="bold">
              {label}
            </Text>
            <Text shade="muted" size={1}>
              {components.length} component{components.length !== 1 ? "s" : ""}
            </Text>
          </Stack>
        </Group>
      </Stack>

      {/* Component Cards */}
      <Stack gap={4}>
        {components.map((component) => (
          <Card
            render={
              <Link href={urls.component(category, toSlug(component.name))} />
            }
            title={component.name}
            description={component.description}
          />
        ))}
      </Stack>
    </Stack>
  );
}
