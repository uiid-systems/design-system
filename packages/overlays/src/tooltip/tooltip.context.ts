"use client";

import { createContext, useContext } from "react";

export const HasTooltipProviderContext = createContext(false);

/** Whether a `TooltipProvider` is above this component. */
export const useHasTooltipProvider = () =>
  useContext(HasTooltipProviderContext);
