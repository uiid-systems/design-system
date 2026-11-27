import type { ContextMenu as BaseContextMenu } from "@base-ui/react/context-menu";
import type { WithStringClassName } from "@uiid/utils";

import type {
  MenuBackdropProps,
  MenuItemType,
  MenuPopupProps,
} from "../menu/menu.types";
import type { MenuItemSlots } from "../menu/render-menu-items";

/*
 * Base UI's ContextMenu adds only these three parts. Its popup, items, groups,
 * separators and submenus are Menu's own, so a context menu composes them from
 * `@uiid/navigation`'s Menu parts rather than from `ContextMenu*` copies.
 */
export type ContextMenuRootProps = BaseContextMenu.Root.Props;
export type ContextMenuTriggerProps =
  WithStringClassName<BaseContextMenu.Trigger.Props>;
export type ContextMenuPositionerProps =
  WithStringClassName<BaseContextMenu.Positioner.Props>;

/*
 * The submenu, item, link and separator slots are Menu's own, documented on
 * `MenuProps`: the rows render through the same function.
 */
export type ContextMenuProps = {
  /** The menu's entries, the same array `Menu` takes. An entry with `items`
   * opens a submenu, one with `href` is a link, and `{ type: "separator" }`
   * draws a line. */
  items: MenuItemType[];
  /** The area that opens the menu on right-click or long-press. */
  children: React.ReactNode;
  /**
   * Dims the page behind the open popup, as Menu's does. Visual only: a
   * context menu is always modal, so outside pointers are blocked and page
   * scroll is locked whether or not this is drawn. Base UI's context menu
   * root takes no `modal`, so this is the only switch.
   * Only the root menu draws one, never a submenu.
   * @default true
   */
  backdrop?: boolean;
  RootProps?: ContextMenuRootProps;
  /** Reaches the trigger, the area around `children`. Pass `render` to make
   * an element the trigger itself. Its content is `children`. */
  TriggerProps?: Omit<ContextMenuTriggerProps, "children">;
  BackdropProps?: MenuBackdropProps;
  /** Reaches the root positioner, which places the popup at the pointer. It
   * holds the root popup. */
  PositionerProps?: Omit<ContextMenuPositionerProps, "children">;
  /** Reaches the root popup. Its content comes from `items`. A context menu
   * has no trigger button to name the popup, so pass an `aria-label` here. */
  PopupProps?: Omit<MenuPopupProps, "children">;
} & MenuItemSlots;
