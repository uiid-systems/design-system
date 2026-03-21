import { Card } from "@uiid/cards";
import { Layer } from "@uiid/layout";

export function LayerPreview() {
  return (
    <Layer offset={{ x: 16, y: 16 }}>
      <Card title="First" />
      <Card title="Second" />
      <Card title="Third" />
    </Layer>
  );
}
