/**
 * The sidebar's state.
 *
 * The sidebar's open state lives on `<html>`, as `data-sidebar="closed"`,
 * and in localStorage. CSS reads the attribute, so nothing has to render for
 * the sidebar to move, and the inline script in sidebar.utils.ts can set it
 * before the first paint.
 *
 * The groups' state is the one thing in the sidebar that uses a state library,
 * and this is the only file that imports it. To use something else, replace
 * `useSidebarGroups`. It starts from its default on the server and on the
 * first client render, then picks up the saved value once mounted.
 * sidebar.utils.ts covers the gap in between.
 */
import { useAtom } from "jotai";
import { atom } from "jotai/vanilla";
import { atomWithStorage } from "jotai/vanilla/utils";
import { useSyncExternalStore } from "react";

import {
  SIDEBAR_ATTRIBUTE,
  SIDEBAR_GROUPS_STORAGE_KEY,
  SIDEBAR_STORAGE_KEY,
} from "./sidebar.constants";
import type { SidebarGroups } from "./sidebar.types";

const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const isSidebarOpen = () =>
  document.documentElement.getAttribute(SIDEBAR_ATTRIBUTE) !== "closed";

/** Whether the sidebar is open. Reads as open on the server. */
export const useSidebarOpen = () =>
  useSyncExternalStore(subscribe, isSidebarOpen, () => true);

/** Open or close the sidebar, and save the choice as JSON `true` or `false`. */
export const toggleSidebar = () => {
  const open = !isSidebarOpen();

  if (open) document.documentElement.removeAttribute(SIDEBAR_ATTRIBUTE);
  else document.documentElement.setAttribute(SIDEBAR_ATTRIBUTE, "closed");

  try {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(open));
  } catch {
    // Storage is blocked. The sidebar still toggles; it just isn't saved.
  }
  listeners.forEach((listener) => listener());
};

/** Whatever is in localStorage under the groups key, which may not be ours. */
const savedGroupsAtom = atomWithStorage<unknown>(
  SIDEBAR_GROUPS_STORAGE_KEY,
  {},
);

/** Anything that isn't a plain object (`null`, an array, a string) reads as no saved groups. */
const toGroups = (saved: unknown): SidebarGroups =>
  typeof saved === "object" && saved !== null && !Array.isArray(saved)
    ? (saved as SidebarGroups)
    : {};

const sidebarGroupsAtom = atom(
  (get) => toGroups(get(savedGroupsAtom)),
  (get, set, update: (groups: SidebarGroups) => SidebarGroups) => {
    set(savedGroupsAtom, update(toGroups(get(savedGroupsAtom))));
  },
);

/**
 * Which groups the reader has opened or closed, saved to localStorage, and a
 * setter that takes an updater. A group that isn't listed has never been
 * touched.
 */
export const useSidebarGroups = () => useAtom(sidebarGroupsAtom);
