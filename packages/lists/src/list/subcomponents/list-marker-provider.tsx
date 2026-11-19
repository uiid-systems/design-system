"use client";

import { ListMarkerContext } from "../list.context";
import type { ListMarker } from "../list.types";

/**
 * @internal Lets a List, which stays a server-safe component, hand its marker
 * to the client rows below it.
 */
export const ListMarkerProvider = ({
  marker,
  children,
}: {
  marker: ListMarker;
  children: React.ReactNode;
}) => <ListMarkerContext value={marker}>{children}</ListMarkerContext>;
ListMarkerProvider.displayName = "ListMarkerProvider";
