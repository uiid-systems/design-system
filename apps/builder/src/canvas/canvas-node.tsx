import { cx } from "@uiid/design-system";

import { useDocumentStore } from "../document/document.store";
import { components } from "../manifest/components";
import { builderMeta } from "../manifest/manifest";
import type { ManifestKey } from "../manifest/manifest";
import type { CanvasNodeProps } from "./canvas.types";

import styles from "./canvas.module.css";

/**
 * Pixel floor that keeps an empty container visible and clickable. Stack is an
 * inline-flex column aligned to the start, so an empty child has no width of
 * its own at all.
 */
const EMPTY_CONTAINER_SIZE = { minw: 120, minh: 40 };

/**
 * Renders the real UIID component for a node, with selection state and the
 * click handler applied through the component's own props. There is no wrapper
 * element, so the canvas lays out exactly as the emitted page would.
 */
export function CanvasNode({ id }: CanvasNodeProps) {
  const node = useDocumentStore((s) => s.document.nodes[id]);
  const isRoot = useDocumentStore((s) => s.document.root === id);
  const selected = useDocumentStore((s) => s.selectedId === id);
  const select = useDocumentStore((s) => s.select);

  if (!node) return null;

  const type = node.type as ManifestKey;
  const Component = components[type];
  const { container } = builderMeta[type];
  const { children: text, ...props } = node.props;
  const empty = container && node.children.length === 0;

  return (
    <Component
      {...props}
      {...(isRoot && { fullwidth: true, fullheight: true })}
      {...(empty && EMPTY_CONTAINER_SIZE)}
      data-canvas-node={id}
      data-selected={selected || undefined}
      data-empty={empty || undefined}
      className={cx(styles.node)}
      onClick={(event: React.MouseEvent) => {
        event.stopPropagation();
        select(id);
      }}
    >
      {container
        ? node.children.map((childId) => (
            <CanvasNode key={childId} id={childId} />
          ))
        : text}
    </Component>
  );
}
