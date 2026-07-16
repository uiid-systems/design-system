import {
  SidebarContainer,
  SidebarScrollContainer,
  SidebarHeader,
  SidebarList,
} from "@/components/shell";
import { COMPONENTS_SITEMAP } from "@/sitemap";
import Link from "next/link";

export function Sidebar() {
  return (
    <SidebarContainer>
      <SidebarScrollContainer>
        <SidebarHeader>uiid docs</SidebarHeader>
        <Link href="/">Home</Link>
        <SidebarList items={COMPONENTS_SITEMAP} />
      </SidebarScrollContainer>
    </SidebarContainer>
  );
}
