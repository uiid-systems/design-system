import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Box } from "@uiid/layout";

import { Sortable } from "./sortable";

import {
  SortableContent,
  SortableItem,
  SortableOverlay,
  SortableItemHandle,
} from "./subcomponents";

const meta = {
  title: "Interactive/Sortable",
  parameters: {
    layout: "centered",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const itemStyle: React.CSSProperties = {
  padding: "12px 16px",
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const handleStyle: React.CSSProperties = {
  padding: "4px",
  background: "transparent",
  border: "none",
  cursor: "grab",
  display: "flex",
  alignItems: "center",
  color: "var(--color-text-muted)",
};

function GripIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <circle cx="5" cy="4" r="1.5" />
      <circle cx="11" cy="4" r="1.5" />
      <circle cx="5" cy="8" r="1.5" />
      <circle cx="11" cy="8" r="1.5" />
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="11" cy="12" r="1.5" />
    </svg>
  );
}

// Basic vertical list with items as handles
function VerticalSortableDemo() {
  const [items, setItems] = useState([
    { id: "1", label: "Item 1" },
    { id: "2", label: "Item 2" },
    { id: "3", label: "Item 3" },
    { id: "4", label: "Item 4" },
  ]);

  return (
    <Box style={{ width: 300 }}>
      <Sortable
        value={items}
        onValueChange={setItems}
        getItemValue={(item) => item.id}
      >
        <SortableContent>
          <Stack gap={2}>
            {items.map((item) => (
              <SortableItem key={item.id} value={item.id} asHandle>
                <div style={itemStyle}>{item.label}</div>
              </SortableItem>
            ))}
          </Stack>
        </SortableContent>
        <SortableOverlay>
          {({ value }) => {
            const item = items.find((i) => i.id === value);
            return item ? (
              <div
                style={{
                  ...itemStyle,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              >
                {item.label}
              </div>
            ) : null;
          }}
        </SortableOverlay>
      </Sortable>
    </Box>
  );
}

// With separate drag handles
function WithHandlesDemo() {
  const [items, setItems] = useState([
    { id: "a", label: "Drag me by the handle" },
    { id: "b", label: "I have a grip icon" },
    { id: "c", label: "Click and drag the dots" },
  ]);

  return (
    <Box style={{ width: 300 }}>
      <Sortable
        value={items}
        onValueChange={setItems}
        getItemValue={(item) => item.id}
      >
        <SortableContent>
          <Stack gap={2}>
            {items.map((item) => (
              <SortableItem key={item.id} value={item.id}>
                <div style={itemStyle}>
                  <SortableItemHandle style={handleStyle}>
                    <GripIcon />
                  </SortableItemHandle>
                  <span>{item.label}</span>
                </div>
              </SortableItem>
            ))}
          </Stack>
        </SortableContent>
        <SortableOverlay>
          {({ value }) => {
            const item = items.find((i) => i.id === value);
            return item ? (
              <div
                style={{
                  ...itemStyle,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              >
                <div style={handleStyle}>
                  <GripIcon />
                </div>
                <span>{item.label}</span>
              </div>
            ) : null;
          }}
        </SortableOverlay>
      </Sortable>
    </Box>
  );
}

// Horizontal list
function HorizontalDemo() {
  const [items, setItems] = useState(["Red", "Green", "Blue", "Yellow"]);

  const colorStyle = (color: string): React.CSSProperties => ({
    width: 60,
    height: 60,
    background: color.toLowerCase(),
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
    textShadow: "0 1px 2px rgba(0,0,0,0.3)",
  });

  return (
    <Sortable value={items} onValueChange={setItems} orientation="horizontal">
      <SortableContent>
        <div style={{ display: "flex", gap: 8 }}>
          {items.map((color) => (
            <SortableItem key={color} value={color} asHandle>
              <div style={colorStyle(color)}>{color}</div>
            </SortableItem>
          ))}
        </div>
      </SortableContent>
      <SortableOverlay>
        {({ value }) => (
          <div
            style={{
              ...colorStyle(value as string),
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            {value as string}
          </div>
        )}
      </SortableOverlay>
    </Sortable>
  );
}

// With disabled items
function WithDisabledDemo() {
  const [items, setItems] = useState([
    { id: "1", label: "Can be moved", disabled: false },
    { id: "2", label: "Disabled item", disabled: true },
    { id: "3", label: "Can be moved", disabled: false },
    { id: "4", label: "Also disabled", disabled: true },
  ]);

  return (
    <Box style={{ width: 300 }}>
      <Sortable
        value={items}
        onValueChange={setItems}
        getItemValue={(item) => item.id}
      >
        <SortableContent>
          <Stack gap={2}>
            {items.map((item) => (
              <SortableItem
                key={item.id}
                value={item.id}
                asHandle
                disabled={item.disabled}
              >
                <div
                  style={{
                    ...itemStyle,
                    opacity: item.disabled ? 0.5 : 1,
                  }}
                >
                  {item.label}
                </div>
              </SortableItem>
            ))}
          </Stack>
        </SortableContent>
        <SortableOverlay>
          {({ value }) => {
            const item = items.find((i) => i.id === value);
            return item ? (
              <div
                style={{
                  ...itemStyle,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              >
                {item.label}
              </div>
            ) : null;
          }}
        </SortableOverlay>
      </Sortable>
    </Box>
  );
}

export const Default: Story = {
  name: "Sortable",
  render: () => (
    <Stack gap={8}>
      <Stack gap={2}>
        <h3 style={{ margin: 0 }}>Vertical (items as handles)</h3>
        <VerticalSortableDemo />
      </Stack>

      <Stack gap={2}>
        <h3 style={{ margin: 0 }}>With drag handles</h3>
        <WithHandlesDemo />
      </Stack>

      <Stack gap={2}>
        <h3 style={{ margin: 0 }}>Horizontal</h3>
        <HorizontalDemo />
      </Stack>

      <Stack gap={2}>
        <h3 style={{ margin: 0 }}>With disabled items</h3>
        <WithDisabledDemo />
      </Stack>
    </Stack>
  ),
};
