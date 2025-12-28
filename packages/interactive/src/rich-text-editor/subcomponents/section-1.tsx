import type { Editor } from "@tiptap/react";
import * as React from "react";
import type { FormatAction } from "../rich-text-editor.types";

import { ChevronDownIcon, AArrowUpIcon } from "@uiid/icons";

import {
  MenuRoot,
  MenuPortal,
  MenuPopup,
  MenuItem,
  MenuTrigger,
  MenuPositioner,
} from "../../menu/subcomponents";

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
  className: string;
}

const formatActions: TextStyle[] = [
  {
    label: "Normal Text",
    element: "span",
    className: "grow",
    shortcuts: ["mod", "alt", "0"],
  },
  {
    label: "Heading 1",
    element: "h1",
    level: 1,
    className: "m-0 grow text-3xl font-extrabold",
    shortcuts: ["mod", "alt", "1"],
  },
  {
    label: "Heading 2",
    element: "h2",
    level: 2,
    className: "m-0 grow text-xl font-bold",
    shortcuts: ["mod", "alt", "2"],
  },
  {
    label: "Heading 3",
    element: "h3",
    level: 3,
    className: "m-0 grow text-lg font-semibold",
    shortcuts: ["mod", "alt", "3"],
  },
  {
    label: "Heading 4",
    element: "h4",
    level: 4,
    className: "m-0 grow text-base font-semibold",
    shortcuts: ["mod", "alt", "4"],
  },
  {
    label: "Heading 5",
    element: "h5",
    level: 5,
    className: "m-0 grow text-sm font-normal",
    shortcuts: ["mod", "alt", "5"],
  },
  {
    label: "Heading 6",
    element: "h6",
    level: 6,
    className: "m-0 grow text-sm font-normal",
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
  const filteredActions = React.useMemo(
    () =>
      formatActions.filter(
        (action) => !action.level || activeLevels.includes(action.level),
      ),
    [activeLevels],
  );

  const handleStyleChange = React.useCallback(
    (level?: Level) => {
      if (level) {
        editor.chain().focus().toggleHeading({ level }).run();
      } else {
        editor.chain().focus().setParagraph().run();
      }
    },
    [editor],
  );

  const renderMenuItem = React.useCallback(
    ({ label, element: Element, level, className, shortcuts }: TextStyle) => (
      <MenuItem
        key={label}
        onClick={() => handleStyleChange(level)}
        aria-label={label}
        style={{
          backgroundColor:
            editor.isActive("heading", { level }) ||
            editor.isActive("paragraph")
              ? "var(--shade-muted)"
              : undefined,
        }}
      >
        <Element className={className}>{label}</Element>
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
            isActive={editor.isActive("heading")}
            tooltip="Text styles"
            aria-label="Text styles"
            pressed={editor.isActive("heading")}
            disabled={editor.isActive("codeBlock")}
          >
            <AArrowUpIcon size={20} />
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
