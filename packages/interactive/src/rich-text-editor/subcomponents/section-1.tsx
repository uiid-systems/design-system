import type { Editor } from "@tiptap/react";
import { useMemo, useCallback } from "react";

import { ChevronDownIcon, ALargeSmallIcon, type Icon } from "@uiid/icons";
import { Group } from "@uiid/layout";
import { Text } from "@uiid/typography";

import {
  MenuRoot,
  MenuPortal,
  MenuPopup,
  MenuItem,
  MenuTrigger,
  MenuPositioner,
} from "../../menu/subcomponents";

import type { FormatAction } from "../rich-text-editor.types";

import { ToolbarButton } from "./toolbar-button";
import { ShortcutKey } from "./shortcut-key";

type Level = 1 | 2 | 3 | 4 | 5 | 6;
interface TextStyle
  extends Omit<
    FormatAction,
    "value" | "icon" | "action" | "isActive" | "canExecute"
  > {
  element: keyof React.JSX.IntrinsicElements;
  level?: Level;
  icon?: Icon;
}

const formatActions: TextStyle[] = [
  {
    label: "Paragraph",
    element: "p",
    shortcuts: ["mod", "alt", "0"],
  },
  {
    label: "Heading 1",
    element: "h1",
    level: 1,
    shortcuts: ["mod", "alt", "1"],
  },
  {
    label: "Heading 2",
    element: "h2",
    level: 2,
    shortcuts: ["mod", "alt", "2"],
  },
  {
    label: "Heading 3",
    element: "h3",
    level: 3,
    shortcuts: ["mod", "alt", "3"],
  },
  {
    label: "Heading 4",
    element: "h4",
    level: 4,
    shortcuts: ["mod", "alt", "4"],
  },
  {
    label: "Heading 5",
    element: "h5",
    level: 5,
    shortcuts: ["mod", "alt", "5"],
  },
  {
    label: "Heading 6",
    element: "h6",
    level: 6,
    shortcuts: ["mod", "alt", "6"],
  },
];

interface Section1Props {
  editor: Editor;
  activeLevels?: Level[];
}

export const Section1 = ({
  editor,
  activeLevels = [1, 2, 3, 4, 5, 6],
}: Section1Props) => {
  const filteredActions = useMemo(
    () =>
      formatActions.filter(
        (action) => !action.level || activeLevels.includes(action.level),
      ),
    [activeLevels],
  );

  const handleStyleChange = useCallback(
    (level?: Level) => {
      if (level) {
        editor.chain().focus().toggleHeading({ level }).run();
      } else {
        editor.chain().focus().setParagraph().run();
      }
    },
    [editor],
  );

  const renderMenuItem = useCallback(
    ({ label, element: Element, level, shortcuts }: TextStyle) => (
      <MenuItem
        key={label}
        render={
          <Group ax="space-between" ay="center" gap={8} px={2} fullwidth />
        }
        onClick={() => handleStyleChange(level)}
        aria-label={label}
        style={{
          backgroundColor:
            editor.isActive("heading", { level }) ||
            editor.isActive("paragraph")
              ? "var(--shade-accent)"
              : undefined,
        }}
      >
        <Text render={<Element />}>{label}</Text>
        <ShortcutKey keys={shortcuts} />
      </MenuItem>
    ),
    [editor, handleStyleChange],
  );

  return (
    <MenuRoot>
      <MenuTrigger
        render={
          <ToolbarButton
            tooltip="Text styles"
            aria-label="Text styles"
            disabled={editor.isActive("codeBlock")}
            square={false}
            ghost
          >
            <ALargeSmallIcon size={20} />
            <ChevronDownIcon size={20} />
          </ToolbarButton>
        }
      >
        {filteredActions.map(renderMenuItem)}
      </MenuTrigger>
      <MenuPortal>
        <MenuPositioner align="start">
          <MenuPopup>{filteredActions.map(renderMenuItem)}</MenuPopup>
        </MenuPositioner>
      </MenuPortal>
    </MenuRoot>
  );
};
Section1.displayName = "Section1";
