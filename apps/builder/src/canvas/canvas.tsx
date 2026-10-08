import { Box } from "@uiid/design-system";

import { useDocumentStore } from "../document/document.store";
import { CanvasNode } from "./canvas-node";

import styles from "./canvas.module.css";

/** The page being built. Clicking outside every node selects the root. */
export function Canvas() {
  const root = useDocumentStore((s) => s.document.root);
  const select = useDocumentStore((s) => s.select);

  return (
    <Box
      data-slot="canvas"
      className={styles.canvas}
      fullwidth
      fullheight
      onClick={() => select(root)}
    >
      <CanvasNode id={root} />
    </Box>
  );
}
