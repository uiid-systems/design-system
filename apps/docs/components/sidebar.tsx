import Link from "next/link";

import { Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { List } from "@uiid/lists";
import { Input } from "@uiid/forms";
import { SearchIcon } from "@uiid/icons";

import { generateDocsNav } from "@/lib/generate-nav";

export const Sidebar = () => {
  const navItems = generateDocsNav();

  return (
    <Stack br={1} ax="stretch" className="min-w-3xs">
      <Stack ax="stretch" className="sticky top-0 h-screen overflow-y-auto">
        <Text size={3} weight="bold" px={4} py={6}>
          uiid docs
        </Text>
        <Stack
          ax="stretch"
          by={1}
          p={4}
          fullwidth
          className="sticky -top-px bg-(--shade-background) z-1"
        >
          <Input size="small" before={<SearchIcon />} />
        </Stack>
        <List items={navItems} LinkComponent={Link} px={4} pb={36} />
      </Stack>
    </Stack>
  );
};
Sidebar.displayName = "Sidebar";
