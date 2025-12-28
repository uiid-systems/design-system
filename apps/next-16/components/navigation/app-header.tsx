"use client";

import Link from "next/link";

import { Button } from "@uiid/buttons";
import { Group } from "@uiid/layout";
import { Breadcrumbs } from "@uiid/navigation";
import { cx } from "@uiid/utils";

import { SwitchAppearance } from "../buttons";
import { Login } from "../authentication";

export const AppHeader = () => {
  return (
    <Group
      render={<header />}
      ay="center"
      ax="space-between"
      gap={2}
      px={4}
      fullwidth
      className={cx(
        "sticky top-0 z-1",
        "bg-(--shade-surface) border-b border-(--globals-border-color)",
        "h-(--globals-header-height)",
      )}
    >
      <Breadcrumbs
        linkAs={Link}
        items={[
          { label: "Home", value: "/" },
          { label: "Dashboard", value: "/dashboard" },
        ]}
      />
      <Group gap={2} ay="center">
        <Button size="small">Sign up</Button>
        <Login />
        <div
          role="separator"
          aria-hidden="true"
          className="h-4 w-px bg-(--shade-halftone) mx-2"
        />
        <SwitchAppearance />
      </Group>
    </Group>
  );
};
AppHeader.displayName = "AppHeader";
