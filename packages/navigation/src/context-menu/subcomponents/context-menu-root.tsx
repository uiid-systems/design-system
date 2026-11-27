import { ContextMenu as BaseContextMenu } from "@base-ui/react/context-menu";

import type { ContextMenuRootProps } from "../context-menu.types";

export const ContextMenuRoot = ({
  children,
  ...props
}: ContextMenuRootProps) => {
  return <BaseContextMenu.Root {...props}>{children}</BaseContextMenu.Root>;
};
ContextMenuRoot.displayName = "ContextMenuRoot";
