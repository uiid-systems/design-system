"use client";

import { SortableContext } from "@dnd-kit/sortable";

import { useSortableContext, SortableContentContext } from "../sortable.context";
import { CONTENT_NAME } from "../sortable.constants";
import type { SortableContentProps } from "../sortable.types";

export const SortableContent = ({
  strategy: strategyProp,
  className,
  children,
  ...props
}: SortableContentProps) => {
  const context = useSortableContext(CONTENT_NAME);

  return (
    <SortableContentContext.Provider value={true}>
      <SortableContext
        items={context.items}
        strategy={strategyProp ?? context.strategy}
      >
        <div data-slot="sortable-content" className={className} {...props}>
          {children}
        </div>
      </SortableContext>
    </SortableContentContext.Provider>
  );
};
SortableContent.displayName = "SortableContent";
