import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragStartEvent } from "@dnd-kit/core";
import { Button } from "@uiid/design-system";
import { useState } from "react";

import type { ManifestKey } from "../manifest/manifest";
import { deepestContainer, handleDragEnd } from "./canvas-dnd";
import type { DragData } from "./canvas-dnd";

/** Pixels the pointer must travel before a drag starts, so clicks stay clicks. */
const ACTIVATION_DISTANCE = 4;

/**
 * One drag-and-drop boundary around the palette and the canvas. Keyboard
 * dragging is out of scope for the POC, so only the pointer sensor is wired.
 */
export function CanvasDndProvider({ children }: React.PropsWithChildren) {
  const [activeType, setActiveType] = useState<ManifestKey | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: ACTIVATION_DISTANCE },
    }),
  );

  const onDragStart = ({ active }: DragStartEvent) => {
    const data = active.data.current as DragData | undefined;
    setActiveType(data?.kind === "palette" ? data.type : null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={deepestContainer}
      onDragStart={onDragStart}
      onDragEnd={(event) => {
        setActiveType(null);
        handleDragEnd(event);
      }}
      onDragCancel={() => setActiveType(null)}
    >
      {children}
      <DragOverlay dropAnimation={null}>
        {activeType && <Button variant="subtle">{activeType}</Button>}
      </DragOverlay>
    </DndContext>
  );
}
