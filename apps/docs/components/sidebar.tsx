import Link from "next/link";
import { Text, Stack } from "@uiid/design-system";

import {
  SidebarContainer,
  SidebarScrollContainer,
  SidebarHeader,
  SidebarList,
} from "@/components/shell";
import { COMPONENTS_SITEMAP } from "@/sitemap";

export function Sidebar() {
  return (
    <SidebarContainer>
      <SidebarScrollContainer>
        <SidebarHeader>uiid docs</SidebarHeader>
        <Stack gap={2}>
          <Text render={<Link href="/">Home</Link>} />
          <SidebarList items={COMPONENTS_SITEMAP} />
        </Stack>
      </SidebarScrollContainer>
    </SidebarContainer>
  );
}
