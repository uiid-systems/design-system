import { barrelExports } from "@uiid/config/scripts/barrel-exports.mjs";
// @vitest-environment node
import { describe, expect, it } from "vitest";

import * as navigation from "./index";

// Components, their parts and their prop types. Constants, variant functions
// and the pagination window helpers are internal.
const values = [
  "Accordion",
  "AccordionContent",
  "AccordionHeader",
  "AccordionItem",
  "AccordionPanel",
  "AccordionRoot",
  "AccordionTrigger",
  "Breadcrumbs",
  "BreadcrumbsContainer",
  "BreadcrumbsItem",
  "BreadcrumbsList",
  "BreadcrumbsSeparator",
  "Menu",
  "MenuBackdrop",
  "MenuGroup",
  "MenuGroupLabel",
  "MenuItem",
  "MenuPopup",
  "MenuPortal",
  "MenuPositioner",
  "MenuRoot",
  "MenuTrigger",
  "Pagination",
  "PaginationButton",
  "SubmenuRoot",
  "SubmenuTrigger",
  "Tabs",
  "TabsIndicator",
  "TabsList",
  "TabsPanel",
  "TabsRoot",
  "TabsTab",
];

const types = [
  "AccordionContentProps",
  "AccordionHeaderProps",
  "AccordionItemData",
  "AccordionItemProps",
  "AccordionPanelProps",
  "AccordionProps",
  "AccordionRootProps",
  "AccordionRootVariants",
  "AccordionTriggerProps",
  "AccordionTriggerVariants",
  "BreadcrumbsContainerProps",
  "BreadcrumbsItemData",
  "BreadcrumbsItemProps",
  "BreadcrumbsListProps",
  "BreadcrumbsProps",
  "BreadcrumbsSeparatorProps",
  "MenuBackdropProps",
  "MenuGroupLabelProps",
  "MenuGroupProps",
  "MenuItemProps",
  "MenuItemType",
  "MenuPopupProps",
  "MenuPortalProps",
  "MenuPositionerProps",
  "MenuProps",
  "MenuRootProps",
  "MenuTriggerProps",
  "PaginationButtonProps",
  "PaginationProps",
  "SubmenuRootProps",
  "SubmenuTriggerProps",
  "TabsIndicatorProps",
  "TabsItemData",
  "TabsListProps",
  "TabsListVariants",
  "TabsPanelProps",
  "TabsProps",
  "TabsRootProps",
  "TabsTabProps",
];

describe("@uiid/navigation barrel", () => {
  it("exports exactly the components and parts", () => {
    expect(Object.keys(navigation).sort()).toEqual(values);
  });

  it("exports exactly these names, types included", () => {
    expect(barrelExports(`${import.meta.dirname}/index.ts`)).toEqual(
      [...values, ...types].sort(),
    );
  });
});
