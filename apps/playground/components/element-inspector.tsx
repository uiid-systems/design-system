"use client";

import { useEffect, useRef, useState, useCallback } from "react";

import { Card } from "@uiid/cards";
import type { Icon } from "@uiid/icons";
import {
  BoxIcon,
  TypeIcon,
  MousePointerClickIcon,
  RectangleHorizontalIcon,
  TextCursorInputIcon,
  LayersIcon,
} from "@uiid/icons";
import { Group, Stack } from "@uiid/layout";
import { registry as componentRegistry } from "@uiid/registry";
import { Text } from "@uiid/typography";

import { useChatStore } from "@/lib/store";

const categoryIcons: Record<string, Icon> = {
  layout: BoxIcon,
  typography: TypeIcon,
  buttons: MousePointerClickIcon,
  cards: RectangleHorizontalIcon,
  forms: TextCursorInputIcon,
  overlays: LayersIcon,
};

type InspectedInfo = {
  key: string;
  type: string;
  props: Record<string, unknown>;
  rect: DOMRect;
  cursor: { x: number; y: number };
};

export const ElementInspector = ({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
}) => {
  const inspecting = useChatStore((s) => s.inspecting);
  const toggleInspecting = useChatStore((s) => s.toggleInspecting);
  const tree = useChatStore((s) => s.tree);
  const [info, setInfo] = useState<InspectedInfo | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const handlePointerOver = useCallback(
    (e: PointerEvent) => {
      if (!tree) return;
      const target = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-element-key]",
      );
      if (!target) {
        setInfo(null);
        return;
      }
      const key = target.dataset.elementKey!;
      const element = tree.elements[key];
      if (!element) {
        setInfo(null);
        return;
      }
      setInfo({
        key,
        type: element.type,
        props: element.props as Record<string, unknown>,
        rect: target.getBoundingClientRect(),
        cursor: { x: e.clientX, y: e.clientY },
      });
    },
    [tree],
  );

  const handlePointerMove = useCallback((e: PointerEvent) => {
    setInfo((prev) =>
      prev ? { ...prev, cursor: { x: e.clientX, y: e.clientY } } : prev,
    );
  }, []);

  const handlePointerLeave = useCallback(() => {
    setInfo(null);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!inspecting || !container) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        toggleInspecting();
      }
    };

    container.addEventListener("pointerover", handlePointerOver);
    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      container.removeEventListener("pointerover", handlePointerOver);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    inspecting,
    containerRef,
    handlePointerOver,
    handlePointerMove,
    handlePointerLeave,
    toggleInspecting,
  ]);

  if (!inspecting || !info) return null;

  // Filter out internal/empty props for display
  const displayProps = Object.entries(info.props).filter(
    ([k]) => k !== "children" && !k.startsWith("__"),
  );

  // Look up category icon from the component registry
  const entry = componentRegistry[info.type as keyof typeof componentRegistry];
  const category = entry?.category;
  const CategoryIcon = category ? categoryIcons[category] : undefined;

  // Position the popover above the cursor
  const top = info.cursor.y - 24;
  const left = info.cursor.x;

  return (
    <>
      {/* Highlight overlay */}
      <div
        style={{
          position: "fixed",
          top: info.rect.top,
          left: info.rect.left,
          width: info.rect.width,
          height: info.rect.height,
          border: "2px solid oklch(0.65 0.2 250)",
          backgroundColor: "oklch(0.65 0.2 250 / 0.08)",
          borderRadius: 4,
          zIndex: 9998,
          pointerEvents: "none",
        }}
      />
      {/* Inspector popover */}
      <div
        ref={popoverRef}
        style={{
          position: "fixed",
          top,
          left,
          transform: "translate(-50%, -100%)",
          zIndex: 9999,
          pointerEvents: "none",
          maxWidth: 320,
        }}
      >
        <Card title={info.type} icon={CategoryIcon}>
          {displayProps.length > 0 ? (
            <Stack gap={4} pt={2}>
              {displayProps.map(([key, value]) => (
                <Group key={key} ax="space-between" gap={8} fullwidth>
                  <Text weight="bold">{key}</Text>
                  <Text shade="muted" family="mono">
                    {formatValue(value)}
                  </Text>
                </Group>
              ))}
            </Stack>
          ) : (
            <Text shade="muted" pt={2}>
              No props defined
            </Text>
          )}
        </Card>
      </div>
    </>
  );
};
ElementInspector.displayName = "ElementInspector";

function formatValue(value: unknown): string {
  if (typeof value === "string") return `"${value}"`;
  if (typeof value === "boolean") return String(value);
  if (typeof value === "number") return String(value);
  if (value === null || value === undefined) return String(value);
  if (Array.isArray(value)) return `[${value.length} items]`;
  if (typeof value === "object")
    return `{${Object.keys(value as object).join(", ")}}`;
  return String(value);
}
