import { Card } from "@uiid/cards";
import { Layer } from "@uiid/layout";

export function LayerPreview() {
  return (
    <Layer offset={{ x: 16, y: 16 }}>
      <Card tone="negative" title="Negative" />
      <Card tone="warning" title="Warning" />
      <Card tone="positive" title="Positive" />
    </Layer>
  );
};