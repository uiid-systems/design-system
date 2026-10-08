import { Group, Stack } from "@uiid/design-system";

import { Canvas } from "./canvas/canvas";
import { CanvasDndProvider } from "./canvas/canvas-dnd-provider";
import { Palette } from "./palette/palette";

/** Palette width in pixels until the resizable shell lands. */
const PALETTE_WIDTH = 220;

export function App() {
  return (
    <CanvasDndProvider>
      <Group fullscreen>
        <Stack w={PALETTE_WIDTH} minw={PALETTE_WIDTH}>
          <Palette />
        </Stack>
        <Canvas />
      </Group>
    </CanvasDndProvider>
  );
}
