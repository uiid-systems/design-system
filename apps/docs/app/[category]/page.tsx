import { notFound } from "next/navigation";

import { registry } from "@uiid/registry";
import { Card } from "@uiid/cards";
import { Stack, Group } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { fromSlug, toSlug, urls } from "@/constants/urls";
import { CATEGORY_CONFIG, getCategories } from "@/lib/generate-nav";

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

  const config = CATEGORY_CONFIG[category];
  const Icon = config?.icon;
  const components = Object.values(registry)
    .filter((entry) => entry.category === category)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Stack gap={8} p={8}>
      {/* Header */}
      <Stack gap={2}>
        <Group gap={3} ay="center">
          {Icon && <Icon size={32} />}
          <Text render={<h1 />} size={6} weight="bold">
            {config?.label || fromSlug(category)}
          </Text>
        </Group>
        <Text shade="muted" size={1}>
          {components.length} component{components.length !== 1 ? "s" : ""}
        </Text>
      </Stack>

      {/* Component Cards */}
      <Group gap={4} style={{ flexWrap: "wrap" }}>
        {components.map((component) => (
          <a
            key={component.name}
            href={urls.component(category, toSlug(component.name))}
            style={{ textDecoration: "none", flex: "1 1 280px", maxWidth: 360 }}
          >
            <Card
              title={component.name}
              description={component.description}
            />
          </a>
        ))}
      </Group>
    </Stack>
  );
}
