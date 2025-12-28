import { useState, useCallback, useMemo } from "react";

import { EllipsisIcon } from "@uiid/icons";
import { Group } from "@uiid/layout";
import { cx } from "@uiid/utils";

import {
  MenuRoot,
  MenuPositioner,
  MenuPopup,
  MenuItem,
  MenuTrigger,
  MenuPortal,
} from "../../../../";

import { ActionButton } from "./action-button";
import { ActionItems } from "./action-items";

interface ImageActionsProps {
  shouldMerge?: boolean;
  isLink?: boolean;
  onView?: () => void;
  onDownload?: () => void;
  onCopy?: () => void;
  onCopyLink?: () => void;
}

export const ActionWrapper = ({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div
    className={cx(
      "absolute top-3 right-3 flex flex-row rounded px-0.5 opacity-0 group-hover/node-image:opacity-100",
      "border-[0.5px] bg-[var(--mt-bg-secondary)] [backdrop-filter:saturate(1.8)_blur(20px)]",
      className,
    )}
    {...props}
  >
    {children}
  </div>
);
ActionWrapper.displayName = "ActionWrapper";

export const ImageActions = ({
  shouldMerge = false,
  isLink = false,
  ...actions
}: ImageActionsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = useCallback(
    (e: React.MouseEvent, action: (() => void) | undefined) => {
      e.preventDefault();
      e.stopPropagation();
      action?.();
    },
    [],
  );

  const filteredActions = useMemo(
    () => ActionItems.filter((item) => isLink || !item.isLink),
    [isLink],
  );

  return (
    <ActionWrapper style={{ opacity: isOpen ? 1 : 0 }}>
      {shouldMerge ? (
        <MenuRoot open={isOpen} onOpenChange={setIsOpen}>
          <MenuTrigger
            render={
              <ActionButton
                tooltip="Open menu"
                onClick={(e) => e.preventDefault()}
              >
                <EllipsisIcon />
              </ActionButton>
            }
          />
          <MenuPortal>
            <MenuPositioner align="end">
              <MenuPopup>
                {filteredActions.map(({ key, icon, tooltip }) => (
                  <MenuItem
                    key={key}
                    onClick={(e) => handleAction(e, actions[key])}
                  >
                    <Group ay="center" gap={2}>
                      {icon}
                      <span>{tooltip}</span>
                    </Group>
                  </MenuItem>
                ))}
              </MenuPopup>
            </MenuPositioner>
          </MenuPortal>
        </MenuRoot>
      ) : (
        filteredActions.map(({ key, icon, tooltip }) => (
          <ActionButton
            key={key}
            tooltip={tooltip}
            onClick={(e) => handleAction(e, actions[key])}
          >
            {icon}
          </ActionButton>
        ))
      )}
    </ActionWrapper>
  );
};
ImageActions.displayName = "ImageActions";
