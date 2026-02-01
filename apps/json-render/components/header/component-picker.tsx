"use client";

import { useMemo } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "@uiid/icons";
import { Button } from "@uiid/buttons";
import { registry, categories } from "@uiid/registry";
import type { PreviewConfig } from "@uiid/registry";

import {
  MenuRoot,
  MenuTrigger,
  MenuPortal,
  MenuPositioner,
  MenuPopup,
  MenuItem,
  SubmenuRoot,
  SubmenuTrigger,
} from "@uiid/interactive";

import { useComponentLoader } from "@/lib/use-component-loader";

type ComponentWithPreviews = {
  name: string;
  previews: PreviewConfig[];
};

type CategoryGroup = {
  key: string;
  label: string;
  components: ComponentWithPreviews[];
};

export const ComponentPicker = () => {
  const { component, variant, selectComponent, selectVariant } =
    useComponentLoader();

  const grouped = useMemo((): CategoryGroup[] => {
    return categories
      .map((cat) => {
        const components = Object.entries(registry)
          .filter(
            ([, entry]) =>
              entry.category === cat.key &&
              entry.previews &&
              entry.previews.length > 0
          )
          .map(([name, entry]) => ({
            name,
            previews: entry.previews!,
          }));

        return { key: cat.key, label: cat.label, components };
      })
      .filter((group) => group.components.length > 0);
  }, []);

  const triggerLabel = component ?? "Components";

  return (
    <MenuRoot>
      <MenuTrigger
        render={
          <Button size="small" ghost>
            {triggerLabel}
            <ChevronDownIcon size={14} />
          </Button>
        }
      />
      <MenuPortal>
        <MenuPositioner align="start">
          <MenuPopup>
            {grouped.map((group) => (
              <SubmenuRoot key={group.key}>
                <SubmenuTrigger>
                  {group.label}
                  <ChevronRightIcon size={12} />
                </SubmenuTrigger>
                <MenuPortal>
                  <MenuPositioner>
                    <MenuPopup>
                      {group.components.map((comp) =>
                        comp.previews.length > 1 ? (
                          <SubmenuRoot key={comp.name}>
                            <SubmenuTrigger>
                              {comp.name}
                              <ChevronRightIcon size={12} />
                            </SubmenuTrigger>
                            <MenuPortal>
                              <MenuPositioner>
                                <MenuPopup>
                                  {comp.previews.map((preview) => (
                                    <MenuItem
                                      key={preview.label}
                                      onClick={() => {
                                        selectComponent(
                                          comp.name,
                                          preview.label
                                        );
                                      }}
                                    >
                                      {preview.label}
                                    </MenuItem>
                                  ))}
                                </MenuPopup>
                              </MenuPositioner>
                            </MenuPortal>
                          </SubmenuRoot>
                        ) : (
                          <MenuItem
                            key={comp.name}
                            onClick={() => selectComponent(comp.name)}
                          >
                            {comp.name}
                          </MenuItem>
                        )
                      )}
                    </MenuPopup>
                  </MenuPositioner>
                </MenuPortal>
              </SubmenuRoot>
            ))}
          </MenuPopup>
        </MenuPositioner>
      </MenuPortal>
    </MenuRoot>
  );
};
ComponentPicker.displayName = "ComponentPicker";
