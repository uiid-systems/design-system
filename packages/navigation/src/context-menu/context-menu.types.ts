import type { ContextMenu as BaseContextMenu } from "@base-ui/react/context-menu";
import type { WithStringClassName } from "@uiid/utils";

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
