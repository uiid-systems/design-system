"use client";

import { Button } from "@uiid/buttons";
import { Group } from "@uiid/layout";
import { Breadcrumbs } from "@uiid/navigation";
import { cx } from "@uiid/utils";

import { SwitchAppearance, Login } from "../buttons";

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
        items={[
          { label: "Home", value: "/" },
          { label: "Dashboard", value: "/dashboard" },
        ]}
      />
      <Group gap={2}>
        <Button size="sm">Sign up</Button>
        <Login />
        <SwitchAppearance />
      </Group>
    </Group>
  );
};
AppHeader.displayName = "AppHeader";
