"use client";

import type { DialogProps } from "./dialog.types";
import {
  DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogBackdrop,
  DialogViewport,
  DialogPopup,
} from "./subcomponents";

export const Dialog = ({
  open,
  onOpenChange,
  size,
  title,
  description,
  action,
  footer,
  RootProps,
  TriggerProps,
  PortalProps,
  BackdropProps,
  ViewportProps,
  PopupProps,
  trigger,
  children,
}: DialogProps) => {
  // A dialog opened from elsewhere has no trigger. Without one, render no
  // Trigger part at all: Base UI's controlled Root doesn't need it, and the
  // empty focusable span the part would otherwise plant is a tab stop nobody
  // asked for. A caller's own `render` still counts as a trigger.
  return (
    <DialogRoot open={open} onOpenChange={onOpenChange} {...RootProps}>
      {(trigger != null || TriggerProps?.render) && (
        <DialogTrigger {...TriggerProps}>{trigger}</DialogTrigger>
      )}
      <DialogPortal {...PortalProps}>
        <DialogBackdrop {...BackdropProps} />
        <DialogViewport {...ViewportProps}>
          <DialogPopup
            size={size}
            title={title}
            description={description}
            action={action}
            footer={footer}
            {...PopupProps}
          >
            {children}
          </DialogPopup>
        </DialogViewport>
      </DialogPortal>
    </DialogRoot>
  );
};
Dialog.displayName = "Dialog";
