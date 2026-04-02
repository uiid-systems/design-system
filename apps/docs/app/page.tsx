import { SiBaseui } from "@icons-pack/react-simple-icons";
import Link from "next/link";

import { Card } from "@uiid/cards";
import { Stack, Group } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { Logo } from "@/components";
import { thumbnails } from "@/components/thumbnails";
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
      <Logo width={240} />
      <Stack gap={4} my={4} maxw={520}>
        <Text render={<h1 />} size={4} weight="bold">
          A modular React component library
        </Text>
        <Text size={1} shade="muted">
          <strong>{componentCount}</strong> components across{" "}
          <strong>{categories.length}</strong> categories — built with{" "}
          <strong>TypeScript</strong>, <strong>CSS Modules</strong>, and design
          tokens.
        </Text>
      </Stack>

      {/* Components grid */}
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
              action={
                isBaseUI ? <SiBaseui size={10} title="Base UI" /> : undefined
              }
              thumbnail={Thumbnail ? <Thumbnail /> : undefined}
            />
          );
        })}
      </Group>
    </Stack>
  );
}
