"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { PreviewConfig } from "@uiid/registry";

type PreviewContextValue = {
  previews: PreviewConfig[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
};

const PreviewContext = createContext<PreviewContextValue | null>(null);

export function usePreviewContext() {
  return useContext(PreviewContext);
}

type PreviewProviderProps = {
  previews: PreviewConfig[];
  children: ReactNode;
};

export function PreviewProvider({ previews, children }: PreviewProviderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <PreviewContext.Provider value={{ previews, activeIndex, setActiveIndex }}>
      {children}
    </PreviewContext.Provider>
  );
}
