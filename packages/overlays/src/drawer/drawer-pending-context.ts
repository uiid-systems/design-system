"use client";

import { createContext, useContext } from "react";

const DrawerPendingContext = createContext(false);

export const DrawerPendingProvider = DrawerPendingContext.Provider;

/** Whether the surrounding `Drawer` is `pending`, which disables its close controls. */
export const useDrawerPending = () => useContext(DrawerPendingContext);
