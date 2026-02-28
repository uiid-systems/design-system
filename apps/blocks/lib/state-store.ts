/**
 * State store for json-render live previews.
 *
 * Uses json-render's built-in createStateStore (no external adapter needed)
 * since block preview state is isolated from app state.
 */

import { createStateStore, type StateStore } from "@json-render/react";

let store: StateStore = createStateStore({});

/**
 * Get the current state store instance.
 */
export function getStateStore(): StateStore {
  return store;
}

/**
 * Reset the state store with fresh empty state.
 * Call this when a new block is generated so stale form values don't persist.
 */
export function resetStateStore(): void {
  store = createStateStore({});
}
