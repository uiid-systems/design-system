import {
  Box,
  Resizable,
  ResizableHandle,
  ResizablePanel,
  Tabs,
} from "@uiid/design-system";

import { Canvas } from "./canvas/canvas";
import { CanvasDndProvider } from "./canvas/canvas-dnd-provider";
import { CodePanel } from "./code-panel/code-panel";
import { Inspector } from "./inspector/inspector";
import { Palette } from "./palette/palette";

/** Default column widths, in percent of the shell. */
const PALETTE_SIZE = 18;
const CANVAS_SIZE = 54;
const SIDEBAR_SIZE = 28;

const sidebarTabs = [
  { label: "Props", value: "props", render: <Inspector /> },
  { label: "Code", value: "code", render: <CodePanel /> },
];

export function App() {
  return (
    <CanvasDndProvider>
      <Box fullscreen>
        <Resizable direction="horizontal">
          <ResizablePanel defaultSize={PALETTE_SIZE} minSize={12}>
            <Palette />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={CANVAS_SIZE} minSize={30}>
            <Canvas />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={SIDEBAR_SIZE} minSize={20}>
            {/* Finding, not a fix: TabsProps picks the list's size as required
                through the built declarations, so the default is spelled out. */}
            <Tabs items={sidebarTabs} size="medium" fullwidth />
          </ResizablePanel>
        </Resizable>
      </Box>
    </CanvasDndProvider>
  );
}
