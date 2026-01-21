import { Card } from "@uiid/cards";
import { Stack, Group } from "@uiid/layout";
import { Text } from "@uiid/typography";

import {
  CATEGORY_CONFIG,
  getCategories,
  getCategoryComponentCount,
} from "@/lib/generate-nav";
import { urls } from "@/constants/urls";

export default function HomePage() {
  const categories = getCategories();

  return (
    <Stack gap={8} p={8}>
      {/* Hero */}
      <Stack gap={4}>
        <Text render={<h1 />} size={7} weight="bold">
          UIID Documentation
        </Text>
        <Text shade="muted" size={2}>
          A modern, modular component library built with TypeScript, Vite,
          React, and CSS Modules.
        </Text>
      </Stack>

      {/* Category Cards */}
      <Stack gap={4}>
        <Text render={<h2 />} size={4} weight="bold">
          Components
        </Text>
        <Group gap={4} style={{ flexWrap: "wrap" }}>
          {categories.map((category) => {
            const config = CATEGORY_CONFIG[category];
            const Icon = config?.icon;
            const count = getCategoryComponentCount(category);

            return (
              <a
                key={category}
                href={urls.category(category)}
                style={{ textDecoration: "none", flex: "1 1 280px", maxWidth: 360 }}
              >
                <Card
                  icon={Icon}
                  title={config?.label || category}
                  description={`${count} component${count !== 1 ? "s" : ""}`}
                />
              </a>
            );
          })}
        </Group>
      </Stack>
    </Stack>
  );
}
