"use client";

import { createContext, useContext } from "react";

const DialogPendingContext = createContext(false);

export const DialogPendingProvider = DialogPendingContext.Provider;

/** Whether the surrounding `Dialog` is `pending`, which disables its close controls. */
export const useDialogPending = () => useContext(DialogPendingContext);
