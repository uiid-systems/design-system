import * as React from "react";
import type { Editor } from "@tiptap/react";

import { ChevronDownIcon } from "@uiid/icons";
import { Group } from "@uiid/layout";

import {
  MenuRoot,
  MenuPopup,
  MenuPortal,
  MenuItem,
  MenuTrigger,
  MenuPositioner,
} from "../../menu/subcomponents";

import type { FormatAction } from "../rich-text-editor.types";
import { getShortcutKey } from "../rich-text-editor.utils";

import { ToolbarButton, type ToolbarButtonProps } from "./toolbar-button";
import { ShortcutKey } from "./shortcut-key";

interface ToolbarSectionProps {
  editor: Editor;
  actions: FormatAction[];
  activeActions?: string[];
  mainActionCount?: number;
  dropdownIcon?: React.ReactNode;
  dropdownTooltip?: string;
  dropdownClassName?: string;
  toolbarButtonProps?: ToolbarButtonProps;
}

export const ToolbarSection: React.FC<ToolbarSectionProps> = ({
  editor,
  actions,
  activeActions = actions.map((action) => action.value),
  mainActionCount = 0,
  dropdownIcon,
  dropdownTooltip = "More options",
  toolbarButtonProps,
}) => {
  const { mainActions, dropdownActions } = React.useMemo(() => {
    const sortedActions = actions
      .filter((action) => activeActions.includes(action.value))
      .sort(
        (a, b) =>
          activeActions.indexOf(a.value) - activeActions.indexOf(b.value),
      );

    return {
      mainActions: sortedActions.slice(0, mainActionCount),
      dropdownActions: sortedActions.slice(mainActionCount),
    };
  }, [actions, activeActions, mainActionCount]);

  const renderToolbarButton = React.useCallback(
    (action: FormatAction) => (
      <ToolbarButton
        key={action.label}
        onClick={() => action.action(editor)}
        disabled={!action.canExecute(editor)}
        tooltip={`${action.label} ${action.shortcuts.map((s) => getShortcutKey(s).symbol).join(" ")}`}
        aria-label={action.label}
        {...toolbarButtonProps}
      >
        {action.icon}
      </ToolbarButton>
    ),
    [editor, toolbarButtonProps],
  );

  const renderDropdownMenuItem = React.useCallback(
    (action: FormatAction) => (
      <MenuItem
        key={action.label}
        aria-label={action.label}
        onClick={() => action.action(editor)}
        disabled={!action.canExecute(editor)}
        render={
          <Group ay="center" ax="space-between" gap={4} fullwidth px={2} />
        }
        style={{
          backgroundColor: action.isActive(editor)
            ? "var(--shade-muted)"
            : undefined,
        }}
      >
        <span>{action.label}</span>
        <ShortcutKey keys={action.shortcuts} />
      </MenuItem>
    ),
    [editor],
  );

  // const isDropdownActive = dropdownActions.some((action) =>
  //   action.isActive(editor),
  // );

  return (
    <>
      {mainActions.map(renderToolbarButton)}
      {dropdownActions.length > 0 && (
        <MenuRoot>
          <MenuTrigger nativeButton={false}>
            <ToolbarButton
              tooltip={dropdownTooltip}
              aria-label={dropdownTooltip}
              {...toolbarButtonProps}
            >
              {dropdownIcon || <ChevronDownIcon size={20} />}
            </ToolbarButton>
          </MenuTrigger>
          <MenuPortal>
            <MenuPositioner align="start" className="w-full">
              <MenuPopup>
                {dropdownActions.map(renderDropdownMenuItem)}
              </MenuPopup>
            </MenuPositioner>
          </MenuPortal>
        </MenuRoot>
      )}
    </>
  );
};

export default ToolbarSection;
