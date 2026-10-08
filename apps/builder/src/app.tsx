import { Group, Stack } from "@uiid/design-system";

import { Canvas } from "./canvas/canvas";
import { CanvasDndProvider } from "./canvas/canvas-dnd-provider";
import { Inspector } from "./inspector/inspector";
import { Palette } from "./palette/palette";

/** Side pane widths in pixels until the resizable shell lands. */
const PALETTE_WIDTH = 220;
const INSPECTOR_WIDTH = 300;

export function App() {
  return (
    <CanvasDndProvider>
      <Group fullscreen>
        <Stack w={PALETTE_WIDTH} minw={PALETTE_WIDTH}>
          <Palette />
        </Stack>
        <Canvas />
        <Stack w={INSPECTOR_WIDTH} minw={INSPECTOR_WIDTH}>
          <Inspector />
        </Stack>
      </Group>
    </CanvasDndProvider>
  );
}
