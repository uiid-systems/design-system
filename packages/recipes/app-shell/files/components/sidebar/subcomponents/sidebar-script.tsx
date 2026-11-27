import {
  SIDEBAR_ATTRIBUTE,
  SIDEBAR_GROUPS_STORAGE_KEY,
  SIDEBAR_STORAGE_KEY,
} from "../sidebar.constants";
import type { SidebarScriptProps } from "../sidebar.types";
import { noFlashScript } from "../sidebar.utils";

/**
 * Restores the sidebar's and its groups' saved state before the first paint.
 * Render it in `<head>`. It is a plain inline script, so it runs before React
 * hydrates; see sidebar.utils.ts for how it works.
 */
export const SidebarScript = (props: SidebarScriptProps) => {
  return (
    <script
      data-slot="sidebar-script"
      {...props}
      dangerouslySetInnerHTML={{
        __html: noFlashScript({
          sidebarKey: SIDEBAR_STORAGE_KEY,
          sidebarAttribute: SIDEBAR_ATTRIBUTE,
          groupsKey: SIDEBAR_GROUPS_STORAGE_KEY,
        }),
      }}
    />
  );
};
SidebarScript.displayName = "SidebarScript";
