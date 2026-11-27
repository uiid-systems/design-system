import { Breadcrumbs } from "@/components/breadcrumbs";
import { SidebarToggle } from "@/components/sidebar";

import type { HeaderProps } from "./header.types";
import { HeaderGroup, HeaderRoot } from "./subcomponents";

/**
 * The docs header: the sidebar toggle and the breadcrumb trail at the leading
 * end, and its `children` at the trailing end.
 */
export const Header = ({ children, ...props }: HeaderProps) => {
  return (
    <HeaderRoot {...props}>
      <HeaderGroup ay="center">
        <SidebarToggle />
        <Breadcrumbs />
      </HeaderGroup>
      {children}
    </HeaderRoot>
  );
};
Header.displayName = "Header";
