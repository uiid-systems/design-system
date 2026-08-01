import { Text, Stack } from "@uiid/design-system";
import Link from "next/link";

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
        <Stack>
          <Text render={<Link href="/">Home</Link>} shade="muted" />
          <Text
            render={<Link href="/changelog">Changelog</Link>}
            shade="muted"
          />
          <SidebarList items={COMPONENTS_SITEMAP} />
        </Stack>
      </SidebarScrollContainer>
    </SidebarContainer>
  );
}
