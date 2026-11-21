"use client";

import { useAtom } from "jotai";

import { clearNoFlash, SidebarToggle } from "@/components/shell";
import { sidebarOpenAtom } from "@/components/shell/store";

export function HeaderSidebarToggle() {
  const [open, setOpen] = useAtom(sidebarOpenAtom);

  return (
    <SidebarToggle
      aria-expanded={open}
      onClick={() => {
        clearNoFlash();
        setOpen((value) => !value);
      }}
    />
  );
}
