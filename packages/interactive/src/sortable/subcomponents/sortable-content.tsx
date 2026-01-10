"use client";

import { SortableContext } from "@dnd-kit/sortable";
import { renderWithProps } from "@uiid/utils";

import { useSortableContext, SortableContentContext } from "../sortable.context";
import { CONTENT_NAME } from "../sortable.constants";
import type { SortableContentProps } from "../sortable.types";

export const SortableContent = (props: SortableContentProps) => {
  const {
    strategy: strategyProp,
    render,
    withoutSlot,
    children,
    ...contentProps
  } = props;

  const context = useSortableContext(CONTENT_NAME);

  return (
    <SortableContentContext.Provider value={true}>
      <SortableContext
        items={context.items}
        strategy={strategyProp ?? context.strategy}
      >
        {withoutSlot ? (
          children
        ) : (
          renderWithProps({
            render,
            children,
            fallbackElement: "div",
            props: {
              "data-slot": "sortable-content",
              ...contentProps,
            },
          })
        )}
      </SortableContext>
    </SortableContentContext.Provider>
  );
};
SortableContent.displayName = "SortableContent";
