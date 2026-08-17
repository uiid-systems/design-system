// The only overlay example that needs a hook — toasts are triggered
// imperatively through useToastManager rather than by a trigger element.
"use client";

import { Button } from "@uiid/buttons";
import { Group } from "@uiid/layout";

import { Toaster } from "./toast";
import { ToastProvider, useToastManager } from "./toast.hooks";
import type { ToasterProps } from "./toast.types";

/** Each example is self-contained: a provider, a viewport, and something to fire from. */
const Demo = ({
  position,
  children,
}: React.PropsWithChildren<Pick<ToasterProps, "position">>) => (
  <ToastProvider>
    {children}
    <Toaster position={position} />
  </ToastProvider>
);

const AddButton = ({
  label,
  description,
}: {
  label: string;
  description: string;
}) => {
  const toastManager = useToastManager();
  return (
    <Button onClick={() => toastManager.add({ description })}>{label}</Button>
  );
};

export const Default = () => (
  <Demo>
    <AddButton label="Show toast" description="Changes saved." />
  </Demo>
);

/** The viewport is anchored to the top or the bottom of the screen. */
export const Positions = () => (
  <Group gap={2}>
    <Demo position="top">
      <AddButton label="Top" description="Anchored to the top." />
    </Demo>
    <Demo position="bottom">
      <AddButton label="Bottom" description="Anchored to the bottom." />
    </Demo>
  </Group>
);

/** Each call stacks another toast into the viewport. */
export const Stacking = () => (
  <Demo>
    <Group gap={2}>
      <AddButton label="First" description="First notification" />
      <AddButton label="Second" description="Second notification" />
      <AddButton label="Third" description="Third notification" />
    </Group>
  </Demo>
);
