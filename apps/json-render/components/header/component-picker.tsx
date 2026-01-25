"use client";

import { useMemo, useEffect } from "react";
import { Group } from "@uiid/layout";
import { Select } from "@uiid/forms";

import { useComponentLoader } from "@/lib/use-component-loader";

export const ComponentPicker = () => {
  // #region agent log
  useEffect(() => {
    // Check what's inside the popup and what styles are applied
    const checkStyles = () => {
      const popups = document.querySelectorAll('[data-slot="select-popup"]');
      const selectItems = document.querySelectorAll('[data-slot="select-item"]');
      const listItems = document.querySelectorAll('[data-slot="list-item"]');
      
      // Get all children of first popup
      let popupChildInfo = 'none';
      let firstItemHTML = 'none';
      let firstItemClasses = 'none';
      let firstItemPadding = 'none';
      let firstItemBorderRadius = 'none';
      
      if (popups.length > 0) {
        const popup = popups[0];
        const allChildren = popup.querySelectorAll('*');
        popupChildInfo = `${allChildren.length} children`;
        
        // Find first item-like element
        const firstItem = popup.querySelector('[data-slot="select-item"], [data-slot="list-item"], [role="option"]');
        if (firstItem) {
          firstItemHTML = firstItem.outerHTML.substring(0, 300);
          firstItemClasses = firstItem.className;
          firstItemPadding = getComputedStyle(firstItem).padding;
          firstItemBorderRadius = getComputedStyle(firstItem).borderRadius;
        }
      }
      
      const styleData = {
        popupsFound: popups.length,
        selectItemsFound: selectItems.length,
        listItemsFound: listItems.length,
        popupChildInfo,
        firstItemClasses,
        firstItemPadding,
        firstItemBorderRadius,
        firstItemHTML,
      };
      
      fetch('http://127.0.0.1:7242/ingest/83801fb3-41cc-4a8e-a1bd-20c34a8ecb67',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          location:'component-picker.tsx:checkStyles',
          message:'DOM style check v2',
          data: styleData,
          timestamp:Date.now(),
          sessionId:'debug-session',
          hypothesisId:'H1-missing-lists-css'
        })
      }).catch(()=>{});
    };
    
    // Check on mount and after a delay (for popup to render)
    const timer = setTimeout(checkStyles, 500);
    document.addEventListener('click', () => setTimeout(checkStyles, 100));
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', () => setTimeout(checkStyles, 100));
    };
  }, []);
  // #endregion
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
        value={component ?? undefined}
        onValueChange={(value) => selectComponent(value ?? null)}
        ghost
      />
      {component && variantItems.length > 1 && (
        <Select
          placeholder="Select variant"
          items={variantItems}
          value={variant ?? undefined}
          onValueChange={(value) => selectVariant(value ?? null)}
          ghost
        />
      )}
    </Group>
  );
};
ComponentPicker.displayName = "ComponentPicker";
