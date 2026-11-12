// The only overlay example that needs a hook — toasts are triggered
// imperatively through useToastManager rather than by a trigger element.
"use client";

import { Button } from "@uiid/buttons";
import { Progress } from "@uiid/indicators";
import { Group } from "@uiid/layout";

import { ToastProvider } from "./subcomponents";
import { Toaster } from "./toast";
import { useToastManager } from "./toast.hooks";
import type { ToastObject, ToasterProps } from "./toast.types";

/** Each example is self-contained: a provider, a viewport, and something to fire from. */
const Demo = ({
  position,
  children,
}: React.PropsWithChildren<Pick<ToasterProps, "position">>) => (
  <ToastProvider>
    <Group gap={2}>{children}</Group>
    <Toaster position={position} />
  </ToastProvider>
);

const AddButton = ({
  label,
  ...options
}: { label: string } & Pick<
  ToastObject,
  "title" | "description" | "type" | "data"
>) => {
  const toastManager = useToastManager();
  return <Button onClick={() => toastManager.add(options)}>{label}</Button>;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const Default = () => (
  <Demo>
    <AddButton label="Show toast" description="Changes saved." />
  </Demo>
);

/** `title` renders above `description`; either can stand alone. */
export const TitleAndDescription = () => (
  <Demo>
    <AddButton
      label="Show toast"
      title="Profile updated"
      description="Your changes are live."
    />
  </Demo>
);

const LoadingButton = ({ fail }: { fail?: boolean }) => {
  const toastManager = useToastManager();
  const run = async () => {
    const id = toastManager.add({
      title: "Saving…",
      type: "loading",
    });
    await wait(1500);
    toastManager.update(
      id,
      fail
        ? { title: "Couldn't save", type: "error" }
        : { title: "Saved", type: "success" },
    );
  };
  return (
    <Button onClick={run}>
      {fail ? "Load, then fail" : "Load, then succeed"}
    </Button>
  );
};

const PromiseButton = () => {
  const toastManager = useToastManager();
  return (
    <Button
      onClick={() =>
        toastManager.promise(wait(1500), {
          loading: "Uploading…",
          success: "Uploaded",
          error: "Upload failed",
        })
      }
    >
      promise()
    </Button>
  );
};

const TYPES = ["success", "error", "warning", "info"] as const;

/**
 * `type` lands on the toast as `data-type`. `success`, `error`, `warning` and
 * `info` each show an icon on the title's line and color the surface green,
 * red, yellow and blue. Any other type shows no icon on a neutral surface.
 */
export const Types = () => (
  <Demo>
    {TYPES.map((type) => (
      <AddButton
        key={type}
        label={type}
        type={type}
        title={`A ${type} toast`}
        description="The icon and close button stay on the title's line however long this runs."
      />
    ))}
  </Demo>
);

/**
 * A `loading` toast shows a spinner on a neutral surface and no close button,
 * and stays until you `update()` it when the work settles. Base UI's
 * `promise()` does all of this for you.
 */
export const Loading = () => (
  <Demo>
    <LoadingButton />
    <LoadingButton fail />
    <PromiseButton />
  </Demo>
);

/**
 * `data.color` overrides the hue a type gives the surface, or colors a toast
 * whose type has none.
 */
export const Color = () => (
  <Demo>
    <AddButton
      label="Orange error"
      title="Sync failed"
      description="Your session expired. Sign in again to keep syncing."
      type="error"
      data={{ color: "orange" }}
    />
    <AddButton
      label="Indigo, no type"
      title="New feature"
      description="Schedules can now repeat weekly."
      data={{ color: "indigo" }}
    />
  </Demo>
);

const UndoButton = () => {
  const toastManager = useToastManager();
  return (
    <Button
      onClick={() => {
        const id = toastManager.add({
          description: "Message archived.",
          actionProps: {
            children: "Undo",
            onClick: () => toastManager.close(id),
          },
        });
      }}
    >
      Archive
    </Button>
  );
};

/** `actionProps` renders a button; its `children` is the label. */
export const Action = () => (
  <Demo>
    <UndoButton />
  </Demo>
);

const SYNC_STEPS = 5;

const syncProgress = (done: number) => (
  <Progress value={(done / SYNC_STEPS) * 100} size="small" />
);

const SyncButton = () => {
  const toastManager = useToastManager();
  const run = async () => {
    const id = toastManager.add({
      title: "Syncing",
      description: `0 of ${SYNC_STEPS} sources`,
      type: "loading",
      data: { children: syncProgress(0) },
    });
    for (let done = 1; done <= SYNC_STEPS; done++) {
      await wait(600);
      toastManager.update(id, {
        description: `${done} of ${SYNC_STEPS} sources`,
        data: { children: syncProgress(done) },
      });
    }
    toastManager.update(id, {
      title: "3 new items",
      description: undefined,
      type: "success",
      data: {},
      actionProps: {
        children: "View",
        onClick: () => toastManager.close(id),
      },
    });
  };
  return <Button onClick={run}>Start sync</Button>;
};

/**
 * `data.children` renders below the text, for anything Base UI has no field
 * for. Here a Progress bar counts sources and the toast turns into a success
 * once they are all done.
 */
export const WithProgress = () => (
  <Demo>
    <SyncButton />
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
    <AddButton label="First" description="First notification" />
    <AddButton
      label="Second"
      title="Second notification"
      description="Taller than the first, so its content fades while it sits behind."
    />
    <AddButton label="Third" description="Third notification" />
  </Demo>
);
