"use client";

import { Box, Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { useState } from "react";

import { Resizable } from "./resizable";
import { ResizableHandle, ResizablePanel } from "./subcomponents";

/* Resizable fills its parent, so give the parent a size. */
const Frame = ({ children }: { children: React.ReactNode }) => (
  <Box w="full" h={200} b={1}>
    {children}
  </Box>
);

const Pane = ({ children }: { children: React.ReactNode }) => (
  <Box w="full" h="full" ax="center" ay="center" p={4}>
    <Text weight="bold">{children}</Text>
  </Box>
);

export const Default = () => (
  <Frame>
    <Resizable orientation="horizontal">
      <ResizablePanel defaultSize="50%">
        <Pane>One</Pane>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize="50%">
        <Pane>Two</Pane>
      </ResizablePanel>
    </Resizable>
  </Frame>
);

export const Vertical = () => (
  <Frame>
    <Resizable orientation="vertical">
      <ResizablePanel defaultSize="30%">
        <Pane>Header</Pane>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize="70%">
        <Pane>Content</Pane>
      </ResizablePanel>
    </Resizable>
  </Frame>
);

/*
 * Sizes are strings with `%` for a share of the group, or numbers for pixels.
 * `minSize` and `maxSize` bound the drag.
 */
export const Constraints = () => (
  <Frame>
    <Resizable orientation="horizontal">
      <ResizablePanel defaultSize="25%" minSize="15%" maxSize="40%">
        <Pane>Sidebar</Pane>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <Pane>Content</Pane>
      </ResizablePanel>
    </Resizable>
  </Frame>
);

/* Nest a group in a panel for a split in both directions. */
export const Nested = () => (
  <Frame>
    <Resizable orientation="horizontal">
      <ResizablePanel defaultSize="30%">
        <Pane>Sidebar</Pane>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <Resizable orientation="vertical">
          <ResizablePanel defaultSize="60%">
            <Pane>Editor</Pane>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>
            <Pane>Terminal</Pane>
          </ResizablePanel>
        </Resizable>
      </ResizablePanel>
    </Resizable>
  </Frame>
);

/* `withHandle={false}` drops the grip and leaves the line. */
export const WithoutGrip = () => (
  <Frame>
    <Resizable orientation="horizontal">
      <ResizablePanel>
        <Pane>One</Pane>
      </ResizablePanel>
      <ResizableHandle withHandle={false} />
      <ResizablePanel>
        <Pane>Two</Pane>
      </ResizablePanel>
    </Resizable>
  </Frame>
);

/*
 * A disabled handle cannot be dragged and leaves the tab order. To stop a
 * panel from resizing at all, disable the panel too.
 */
export const Disabled = () => (
  <Frame>
    <Resizable orientation="horizontal">
      <ResizablePanel defaultSize="40%" disabled>
        <Pane>Locked</Pane>
      </ResizablePanel>
      <ResizableHandle disabled />
      <ResizablePanel>
        <Pane>Content</Pane>
      </ResizablePanel>
    </Resizable>
  </Frame>
);

/* `onLayoutChanged` reports each panel's share once a drag ends. */
export const Layout = () => {
  const [layout, setLayout] = useState<Record<string, number>>({});

  return (
    <Stack gap={2} fullwidth>
      <Frame>
        <Resizable orientation="horizontal" onLayoutChanged={setLayout}>
          <ResizablePanel id="left" defaultSize="50%">
            <Pane>Left</Pane>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel id="right" defaultSize="50%">
            <Pane>Right</Pane>
          </ResizablePanel>
        </Resizable>
      </Frame>
      <Text emphasis="muted" size={-1}>
        {Object.entries(layout)
          .map(([id, size]) => `${id} ${Math.round(size)}%`)
          .join(" · ") || "Drag the handle"}
      </Text>
    </Stack>
  );
};
