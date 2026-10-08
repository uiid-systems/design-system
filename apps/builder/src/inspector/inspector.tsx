import { Button, Group, Stack, Text } from "@uiid/design-system";

import { parentIdOf } from "../document/document";
import { useDocumentStore } from "../document/document.store";
import { manifest } from "../manifest/manifest";
import type { ManifestKey } from "../manifest/manifest";
import { PropField } from "./prop-field";

/** Props of the selected node, one generic field each, plus Delete. */
export function Inspector() {
  const selectedId = useDocumentStore((s) => s.selectedId);
  const type = useDocumentStore((s) =>
    s.selectedId ? s.document.nodes[s.selectedId]?.type : undefined,
  );
  const isRoot = useDocumentStore((s) => s.selectedId === s.document.root);
  const parentId = useDocumentStore((s) =>
    s.selectedId ? parentIdOf(s.document, s.selectedId) : undefined,
  );
  const remove = useDocumentStore((s) => s.remove);
  const select = useDocumentStore((s) => s.select);

  if (!selectedId || !type) {
    return (
      <Stack data-slot="inspector" p={4}>
        <Text shade="muted">Select a node to edit its props.</Text>
      </Stack>
    );
  }

  const doc = manifest[type as ManifestKey];

  return (
    <Stack data-slot="inspector" gap={4} p={4} fullwidth>
      <Group ax="space-between" ay="center" fullwidth>
        <Text weight="semibold">{doc.displayName}</Text>
        <Group gap={1}>
          <Button
            variant="ghost"
            size="small"
            disabled={!parentId}
            onClick={() => parentId && select(parentId)}
          >
            Parent
          </Button>
          <Button
            variant="ghost"
            size="small"
            disabled={isRoot}
            onClick={() => remove(selectedId)}
          >
            Delete
          </Button>
        </Group>
      </Group>
      {Object.values(doc.props).map((prop) => (
        <PropField
          key={`${selectedId}:${prop.name}`}
          nodeId={selectedId}
          prop={prop}
        />
      ))}
    </Stack>
  );
}
