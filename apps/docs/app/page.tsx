import Link from "next/link";

import { Card } from "@uiid/cards";
import { Stack, Group } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { Logo } from "@/components";
import { GITHUB_URL, NPM_URL } from "@/constants";
import {
  getCategories,
  getCategoryComponentCount,
  getCategoryIcon,
  getCategoryLabel,
  getComponentCount,
} from "@/lib/generate-nav";
import { urls } from "@/constants/urls";

export default function HomePage() {
  const categories = getCategories();
  const componentCount = getComponentCount();

  return (
    <Stack gap={8} p={8}>
      {/* Hero */}
      <Stack gap={4}>
        <Logo width={120} />
        <Text render={<h1 />} size={4} weight="bold">
          A modular React component library
        </Text>
        <Text size={1} shade="muted">
          {componentCount} components across {categories.length} categories —
          built with TypeScript, CSS Modules, and design tokens.
        </Text>
      </Stack>

      {/* Quick links */}
      <Stack gap={3}>
        <Text size={1} weight="bold">
          Get started
        </Text>
        <Group gap={3}>
          <Text
            size={0}
            shade="muted"
            render={<Link href={GITHUB_URL} target="_blank" />}
          >
            GitHub
          </Text>
          <Text size={0} shade="halftone">
            ·
          </Text>
          <Text
            size={0}
            shade="muted"
            render={<Link href={NPM_URL} target="_blank" />}
          >
            npm
          </Text>
        </Group>
      </Stack>

      {/* Categories */}
      <Stack gap={4}>
        <Text size={1} weight="bold">
          Browse by category
        </Text>
        <Stack gap={3}>
          {categories.map((category) => {
            const Icon = getCategoryIcon(category);
            const count = getCategoryComponentCount(category);

            return (
              <Card
                key={category}
                render={<Link href={urls.category(category)} />}
                title={getCategoryLabel(category)}
                description={`${count} component${count !== 1 ? "s" : ""}`}
                icon={Icon}
              />
            );
          })}
        </Stack>
      </Stack>
    </Stack>
  );
}
