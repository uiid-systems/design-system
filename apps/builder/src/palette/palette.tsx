import { Stack } from "@uiid/design-system";

import { manifest } from "../manifest/manifest";
import type { ManifestKey } from "../manifest/manifest";
import { PaletteItem } from "./palette-item";

const types = Object.keys(manifest) as ManifestKey[];

/** One draggable per manifest entry. Dropping one on a canvas container inserts it. */
export function Palette() {
  return (
    <Stack data-slot="palette" gap={2} p={4} fullwidth>
      {types.map((type) => (
        <PaletteItem key={type} type={type} />
      ))}
    </Stack>
  );
}
