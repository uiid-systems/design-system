"use client";

import { useEffect, useMemo } from "react";
import { useQueryStates, parseAsString } from "nuqs";
import { registry, componentNames } from "@uiid/registry";
import type { PreviewConfig } from "@uiid/registry";

import { useChatStore } from "./store";

/**
 * Hook for loading component previews via URL query params.
 *
 * Syncs ?component=X&variant=Y with Zustand store.
 * Uses history: 'push' so browser back/forward works.
 */
export function useComponentLoader() {
  const setTree = useChatStore((s) => s.setTree);
  const clear = useChatStore((s) => s.clear);

  const [params, setParams] = useQueryStates(
    {
      component: parseAsString,
      variant: parseAsString,
    },
    {
      history: "push",
      shallow: true,
    }
  );

  const { component, variant } = params;

  // Get available components (those with previews)
  const availableComponents = useMemo(() => {
    return componentNames.filter((name) => {
      const entry = registry[name];
      return entry.previews && entry.previews.length > 0;
    });
  }, []);

  // Get previews for the selected component
  const previews = useMemo((): PreviewConfig[] => {
    if (!component) return [];
    const entry = registry[component];
    return entry?.previews ?? [];
  }, [component]);

  // Get the selected preview
  const selectedPreview = useMemo(() => {
    if (!variant || previews.length === 0) return previews[0] ?? null;
    return previews.find((p) => p.label === variant) ?? previews[0] ?? null;
  }, [variant, previews]);

  // Load tree when component/variant changes
  useEffect(() => {
    if (selectedPreview?.tree) {
      setTree(selectedPreview.tree);
    }
  }, [selectedPreview, setTree]);

  // Select a component (and optionally a variant)
  const selectComponent = (name: string | null, variantLabel?: string) => {
    if (!name) {
      setParams({ component: null, variant: null });
      return;
    }

    const entry = registry[name];
    const firstVariant = entry?.previews?.[0]?.label ?? null;

    setParams({
      component: name,
      variant: variantLabel ?? firstVariant,
    });
  };

  // Select a variant for the current component
  const selectVariant = (variantLabel: string | null) => {
    setParams({ variant: variantLabel });
  };

  // Clear component selection and tree
  const clearSelection = () => {
    setParams({ component: null, variant: null });
    clear();
  };

  return {
    // Current selection
    component,
    variant,
    selectedPreview,

    // Available options
    availableComponents,
    previews,

    // Actions
    selectComponent,
    selectVariant,
    clearSelection,
  };
}
