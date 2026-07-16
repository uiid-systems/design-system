import {
  SidebarContainer,
  SidebarScrollContainer,
  SidebarHeader,
  SidebarList,
} from "@/components/shell";
import { SITEMAP, COMPONENTS_SITEMAP } from "@/sitemap";

export function Sidebar() {
  return (
    <SidebarContainer>
      <SidebarScrollContainer>
        <SidebarHeader>uiid docs</SidebarHeader>
        <SidebarList items={SITEMAP} />
        <SidebarList items={COMPONENTS_SITEMAP} category="Components" />
      </SidebarScrollContainer>
    </SidebarContainer>
  );
}
