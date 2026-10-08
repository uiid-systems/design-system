import { useDraggable } from "@dnd-kit/core";
import { Button } from "@uiid/design-system";

import { paletteDragId } from "../canvas/canvas-dnd";
import type { PaletteDragData } from "../canvas/canvas-dnd";
import type { ManifestKey } from "../manifest/manifest";

import styles from "./palette.module.css";

export function PaletteItem({ type }: { type: ManifestKey }) {
  const data: PaletteDragData = { kind: "palette", type };
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: paletteDragId(type),
    data,
  });

  return (
    <Button
      ref={setNodeRef}
      variant="subtle"
      fullwidth
      data-palette-item={type}
      data-dragging={isDragging || undefined}
      className={styles.item}
      {...attributes}
      {...listeners}
    >
      {type}
    </Button>
  );
}
