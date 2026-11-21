import { Breadcrumbs } from "@/components/breadcrumbs";
import { SidebarToggle } from "@/components/sidebar";

import type { HeaderProps } from "./header.types";
import { HeaderGroup, HeaderLinks, HeaderRoot } from "./subcomponents";

/**
 * The docs header: the sidebar toggle and the breadcrumb trail at the leading
 * end, the project's links at the trailing end.
 */
export const Header = (props: HeaderProps) => {
  return (
    <HeaderRoot {...props}>
      <HeaderGroup ay="center">
        <SidebarToggle />
        <Breadcrumbs />
      </HeaderGroup>
      <HeaderLinks />
    </HeaderRoot>
  );
};
Header.displayName = "Header";
