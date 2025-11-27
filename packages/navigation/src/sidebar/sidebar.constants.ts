import type { SidebarProps } from "./sidebar.types";

export const SIDEBAR_MOBILE_BREAKPOINT = 768;

export const SIDEBAR_COOKIE_NAME = "sidebar_state";
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
export const SIDEBAR_WIDTH = "16rem";
export const SIDEBAR_WIDTH_MOBILE = "18rem";
export const SIDEBAR_WIDTH_ICON = "3rem";
export const SIDEBAR_KEYBOARD_SHORTCUT = "b";

export const SIDEBAR_DEFAULT_SIDE: SidebarProps["side"] = "left";
export const SIDEBAR_DEFAULT_VARIANT: SidebarProps["variant"] = "sidebar";
export const SIDEBAR_DEFAULT_COLLAPSIBLE: SidebarProps["collapsible"] =
  "offcanvas";
