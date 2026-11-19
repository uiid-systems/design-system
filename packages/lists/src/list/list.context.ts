import { createContext, useContext } from "react";

import type { ListMarker } from "./list.types";

/**
 * The nearest List's `marker`. Rows read it to decide whether they are native
 * list items, and a nested List provides its own, so an unmarked List inside a
 * marked row resets to `"none"`. Outside any List, as in a Select popup, it is
 * `"none"`.
 */
export const ListMarkerContext = createContext<ListMarker>("none");

export const useListMarker = () => useContext(ListMarkerContext);
