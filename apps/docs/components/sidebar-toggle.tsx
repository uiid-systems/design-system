"use client";

import { useSetAtom } from "jotai";

import { clearNoFlash, SidebarToggle } from "@/components/shell";
import { sidebarOpenAtom } from "@/components/shell/store";

export function HeaderSidebarToggle() {
  const setOpen = useSetAtom(sidebarOpenAtom);

  return (
    <SidebarToggle
      onClick={() => {
        clearNoFlash();
        setOpen((open) => !open);
      }}
    />
  );
}
