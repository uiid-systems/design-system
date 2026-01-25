"use client";

import { useMemo } from "react";
import { Group } from "@uiid/layout";
import { Select } from "@uiid/forms";

import { useComponentLoader } from "@/lib/use-component-loader";

export const ComponentPicker = () => {
  const {
    component,
    variant,
    availableComponents,
    previews,
    selectComponent,
    selectVariant,
  } = useComponentLoader();

  // Build component select items
  const componentItems = useMemo(() => {
    return availableComponents.map((name) => ({
      label: name,
      value: name,
    }));
  }, [availableComponents]);

  // Build variant select items
  const variantItems = useMemo(() => {
    return previews.map((preview) => ({
      label: preview.label,
      value: preview.label,
    }));
  }, [previews]);

  return (
    <Group data-slot="component-picker" gap={2} ay="center">
      <Select
        placeholder="Select component"
        items={componentItems}
        value={component}
        onValueChange={(value) => selectComponent(value ?? null)}
        size="small"
      />
      {component && variantItems.length > 1 && (
        <Select
          placeholder="Select variant"
          items={variantItems}
          value={variant}
          onValueChange={(value) => selectVariant(value ?? null)}
          size="small"
        />
      )}
    </Group>
  );
};
ComponentPicker.displayName = "ComponentPicker";
