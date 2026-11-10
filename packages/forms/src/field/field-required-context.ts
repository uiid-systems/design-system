"use client";

import { createContext, useContext } from "react";

// Base UI's Field.Root has no `required`, so Field carries it to the control.
const FieldRequiredContext = createContext(false);

export const FieldRequiredProvider = FieldRequiredContext.Provider;

/** Whether the surrounding `Field` is `required`. */
export const useFieldRequired = () => useContext(FieldRequiredContext);
