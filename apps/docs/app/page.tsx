import { SiBaseui } from "@icons-pack/react-simple-icons";
import Link from "next/link";

import { Card } from "@uiid/cards";
import { Stack, Group } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { Logo } from "@/components";
import { thumbnails } from "@/components/thumbnails";
import { GITHUB_URL, NPM_URL } from "@/constants";
import {
  getAllComponents,
  getCategories,
  getComponentCount,
} from "@/lib/generate-nav";

export default function HomePage() {
  const components = getAllComponents();
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

      {/* Components grid */}
      <Stack gap={4}>
        <Text size={1} weight="bold">
          Components
        </Text>
        <Group
          gap={4}
          className="[&>*]:min-w-[240px] [&>*]:flex-1 [&>*]:max-w-[360px] flex-wrap"
        >
          {components.map((component) => {
            const Thumbnail = thumbnails[component.slug];
            const displayName = component.name.replace(/(?<!^)([A-Z])/g, " $1");
            const isBaseUI = component.libs?.includes("base-ui");

            return (
              <Card
                key={component.name}
                render={
                  <Link
                    href={component.href}
                    style={{ textDecoration: "none" }}
                  />
                }
                title={displayName}
                description={component.categoryLabel}
                action={isBaseUI ? <SiBaseui size={10} title="Base UI" /> : undefined}
                thumbnail={Thumbnail ? <Thumbnail /> : undefined}
              />
            );
          })}
        </Group>
      </Stack>
    </Stack>
  );
}
