/**
 * The shell's state. This is the only file in the shell that imports a state
 * library; the parts take plain props. To use something else, replace this
 * file and the two places that read it (`components/sidebar.tsx` and
 * `components/sidebar-toggle.tsx`).
 *
 * Both atoms start from their defaults on the server and on the first client
 * render, then pick up the saved value once mounted. `no-flash.ts` covers the
 * gap in between.
 */
import { getDefaultStore } from "jotai/vanilla";
import { atomWithStorage } from "jotai/vanilla/utils";

import { SIDEBAR_GROUPS_STORAGE_KEY, SIDEBAR_STORAGE_KEY } from "./constants";

/** Whether the sidebar is open, saved to localStorage. */
export const sidebarOpenAtom = atomWithStorage(SIDEBAR_STORAGE_KEY, true);

/**
 * Which groups the reader has opened or closed, by group id, saved to
 * localStorage. A group that isn't listed has never been touched.
 */
export const sidebarGroupsAtom = atomWithStorage<Record<string, boolean>>(
  SIDEBAR_GROUPS_STORAGE_KEY,
  {},
);

/**
 * Open a group that was saved closed, for the group holding the current page.
 * Call it from an effect. The empty subscription mounts the atom first, which
 * loads the saved value, so the write below can't replace it with the default.
 */
export const openSidebarGroup = (id: string) => {
  const store = getDefaultStore();
  const unmount = store.sub(sidebarGroupsAtom, () => {});

  store.set(sidebarGroupsAtom, (groups) =>
    groups[id] === false ? { ...groups, [id]: true } : groups,
  );
  unmount();
};
