"use client";

import { Toggle, ToggleGroup } from "@uiid/interactive";

import type { View } from "@/hooks/use-view-state";
import styles from "./view-toggle.module.css";

type ViewToggleProps = {
  view: View;
  onViewChange: (view: View) => void;
};

export const ViewToggle = ({ view, onViewChange }: ViewToggleProps) => {
  return (
    <div className={styles["view-toggle"]}>
      <ToggleGroup
        value={[view]}
        onValueChange={(values) => {
          const next = values[0] as View | undefined;
          if (next) onViewChange(next);
        }}
        size="sm"
      >
        <Toggle value="component">Component</Toggle>
        <Toggle value="code">Code</Toggle>
      </ToggleGroup>
    </div>
  );
};
ViewToggle.displayName = "ViewToggle";
