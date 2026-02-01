"use client";

import { useState, useEffect } from "react";

import { SIDEBAR_MOBILE_BREAKPOINT } from "./sidebar.constants";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined"
      ? window.innerWidth < SIDEBAR_MOBILE_BREAKPOINT
      : false,
  );

  useEffect(() => {
    const mql = window.matchMedia(
      `(max-width: ${SIDEBAR_MOBILE_BREAKPOINT - 1}px)`,
    );
    const onChange = () => {
      setIsMobile(window.innerWidth < SIDEBAR_MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}
