"use client";

import React from "react";

import { cx } from "@uiid/utils";
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

  // if (collapsible === "none") {
  //   return (
  //     <div
  //       data-slot="sidebar-static"
  //       className={cx(
  //         "bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col",
  //         className,
  //       )}
  //       {...props}
  //     >
  //       {children}
  //     </div>
  //   );
  // }

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

function SidebarMenuAction({
  className,
  showOnHover = false,
  ...props
}: React.ComponentProps<"button"> & {
  showOnHover?: boolean;
}) {
  return (
    <button
      data-slot="sidebar-menu-action"
      data-sidebar="menu-action"
      className={cx(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 md:after:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0",
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuSub({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cx(
        "border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuSubItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cx("group/menu-sub-item relative", className)}
      {...props}
    />
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
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  SidebarAppContainer,
};
