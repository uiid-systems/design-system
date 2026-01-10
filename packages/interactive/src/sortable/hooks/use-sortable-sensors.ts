import {
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

/**
 * Configures the default sensors for sortable functionality.
 * Includes mouse, touch, and keyboard sensors with sortable-specific
 * keyboard coordinate handling.
 *
 * @returns Configured sensors for use with DndContext
 */
export function useSortableSensors() {
  return useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
}
