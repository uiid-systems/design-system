"use client";

import "@uiid/tokens/sidebar.tokens.css";

import {
  SIDEBAR_DEFAULT_COLLAPSIBLE,
  SIDEBAR_DEFAULT_SIDE,
  SIDEBAR_DEFAULT_VARIANT,
} from "./sidebar.constants";
import { useSidebar } from "./sidebar.context";
import type { SidebarProps } from "./sidebar.types";

import {
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarGroupContent,
  SidebarInset,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSubButton,
  SidebarMobileSheet,
  SidebarOuter,
  SidebarInner,
  SidebarContainer,
  SidebarAppContainer,
  SidebarList,
} from "./subcomponents";

function Sidebar({
  side = SIDEBAR_DEFAULT_SIDE,
  variant = SIDEBAR_DEFAULT_VARIANT,
  collapsible = SIDEBAR_DEFAULT_COLLAPSIBLE,
  className,
  children,
  ...props
}: SidebarProps) {
  const { isMobile } = useSidebar();

  if (isMobile) {
    return <SidebarMobileSheet {...props}>{children}</SidebarMobileSheet>;
  }

  return (
    <SidebarOuter variant={variant} side={side} collapsible={collapsible}>
      <SidebarContainer
        variant={variant}
        side={side}
        className={className}
        {...props}
      >
        <SidebarInner>{children}</SidebarInner>
      </SidebarContainer>
    </SidebarOuter>
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubButton,
  SidebarTrigger,
  SidebarAppContainer,
  SidebarList,
};
