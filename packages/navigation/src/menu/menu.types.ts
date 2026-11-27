import type { Menu as BaseMenu } from "@base-ui/react/menu";
import type { CardContainerProps } from "@uiid/cards";
import type { Icon } from "@uiid/icons";
import type { GroupProps } from "@uiid/layout";
import type { ListItemProps } from "@uiid/lists";
import type { PaletteColor } from "@uiid/tokens";
import type {
  WithLayoutProps,
  WithStringClassName,
  WithTriggerChildren,
} from "@uiid/utils";

export type MenuItemType = {
  /** Drawn before the label. */
  icon?: Icon;
  label: string;
  value: string;
  /** Base UI's `disabled`: the item, or a submenu's trigger, ignores
   * interaction. */
  disabled?: boolean;
  /** Base UI's `onClick` for this item, called after `ItemProps.onClick`.
   * Ignored on an entry with `items`, whose trigger opens the submenu. */
  onClick?: MenuItemProps["onClick"];
  items?: MenuItemType[];
};

export type MenuRootProps = BaseMenu.Root.Props;
export type MenuTriggerProps = WithTriggerChildren<
  BaseMenu.Trigger.Props,
  BaseMenu.Trigger.State
>;
export type MenuPortalProps = BaseMenu.Portal.Props;
export type MenuBackdropProps = WithStringClassName<BaseMenu.Backdrop.Props>;
export type MenuPositionerProps =
  WithStringClassName<BaseMenu.Positioner.Props>;
/*
 * The popup takes the layout props `Card` spreads onto its container, not its
 * content slots (`title`, `footer`, ...): it is a surface for the rows alone.
 */
export type MenuPopupProps = WithLayoutProps<
  WithStringClassName<BaseMenu.Popup.Props>,
  CardContainerProps
> & {
  /**
   * Palette hue for the popup surface, forwarded to the `Card` the popup
   * renders as. Left undefined, `Card` falls back to its own neutral default.
   */
  color?: PaletteColor;
};

/*
 * A row's content, drawn by the `ListItem` inside it. `label` is Base UI's own
 * string prop, which also keys typeahead, so it keeps that type.
 */
type MenuRowContentProps = {
  /** Secondary line, stacked under the label. */
  description?: ListItemProps["description"];
  /** Drawn before the label. */
  icon?: Icon;
  /** Draws the row in place of the `icon` / `label` / `description` block. */
  children?: React.ReactNode;
};

export type MenuGroupProps = BaseMenu.Group.Props;
export type MenuGroupLabelProps = BaseMenu.GroupLabel.Props;

export type MenuItemProps = WithStringClassName<BaseMenu.Item.Props> &
  MenuRowContentProps;
export type SubmenuRootProps = BaseMenu.SubmenuRoot.Props;
export type SubmenuTriggerProps = WithLayoutProps<
  WithStringClassName<BaseMenu.SubmenuTrigger.Props>,
  GroupProps
> &
  MenuRowContentProps;

export type MenuProps = {
  trigger: MenuTriggerProps["children"];
  items: MenuItemType[];
  /**
   * Dims the page behind the open popup, the way a dialog or drawer does, so an
   * open menu is never lost against the content around it.
   *
   * Visual only: Base UI's Root is already `modal` by default, so page scroll
   * is locked and outside pointers are blocked whether or not this is drawn.
   * Only the root menu draws one — a submenu opening over its parent must not
   * darken the page a second time.
   * @default true
   */
  backdrop?: boolean;
  RootProps?: MenuRootProps;
  /** Reaches the trigger. Its content is `trigger`. */
  TriggerProps?: Omit<MenuTriggerProps, "children">;
  BackdropProps?: MenuBackdropProps;
  /** Reaches the root popup. Its content comes from `items`. */
  PopupProps?: Omit<MenuPopupProps, "children">;
  /** Reaches the root positioner. `side` and `align` are set on Menu itself. */
  PositionerProps?: Omit<MenuPositionerProps, "side" | "align" | "children">;
  /**
   * Reaches every item. Each entry's `label` and `icon` are its content, and a
   * row's `description` is its own, never one shared by every row.
   */
  ItemProps?: Omit<
    MenuItemProps,
    "label" | "icon" | "description" | "children"
  >;
  /** Reaches every submenu root. Each entry's `items` fill its submenu. */
  SubmenuRootProps?: Omit<SubmenuRootProps, "children">;
  /**
   * Reaches every submenu trigger. Each entry's `label` and `icon` are its
   * content, and a row's `description` is its own.
   */
  SubmenuTriggerProps?: Omit<
    SubmenuTriggerProps,
    "label" | "icon" | "description" | "children"
  >;
} & Pick<MenuPositionerProps, "side" | "align">;
