// The only overlay example that needs a hook — toasts are triggered
// imperatively through useToastManager rather than by a trigger element.
"use client";

import { Button } from "@uiid/buttons";
import { Progress } from "@uiid/indicators";
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
    <Group gap={2}>{children}</Group>
    <Toaster position={position} />
  </ToastProvider>
);

const AddButton = ({
  label,
  ...options
}: { label: string } & Parameters<
  ReturnType<typeof useToastManager>["add"]
>[0]) => {
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

/**
 * `type` lands on the toast as `data-type`. A `loading` toast shows a spinner
 * and no close button — give it `timeout: 0` and `update()` it when the work
 * settles. Base UI's `promise()` does all of this for you.
 */
export const Types = () => {
  const LoadingButton = ({ fail }: { fail?: boolean }) => {
    const toastManager = useToastManager();
    const run = async () => {
      const id = toastManager.add({
        title: "Saving…",
        type: "loading",
        timeout: 0,
      });
      await wait(1500);
      toastManager.update(
        id,
        fail
          ? { title: "Couldn't save", type: "error", timeout: 5000 }
          : { title: "Saved", type: "success", timeout: 5000 },
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

  return (
    <Demo>
      <LoadingButton />
      <LoadingButton fail />
      <PromiseButton />
    </Demo>
  );
};

/**
 * `data.color` sets the surface hue. The design system maps no type to a hue —
 * the app decides what an error looks like.
 */
export const Color = () => (
  <Demo>
    <AddButton
      label="Red"
      title="Sync failed"
      description="Your session expired. Run `pnpm blunders` to sign in."
      type="error"
      data={{ color: "red" }}
    />
    <AddButton
      label="Green"
      title="Sync complete"
      description="3 new blunders."
      type="success"
      data={{ color: "green" }}
    />
  </Demo>
);

/** `actionProps` renders a button; its `children` is the label. */
export const Action = () => {
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
  return (
    <Demo>
      <UndoButton />
    </Demo>
  );
};

/**
 * `data.children` renders below the text, for anything Base UI has no field
 * for. Here a Progress bar counts categories and the toast turns into a
 * success once they are all done.
 */
export const WithProgress = () => {
  const SyncButton = () => {
    const toastManager = useToastManager();
    const total = 5;
    const progress = (done: number) => (
      <Progress value={(done / total) * 100} size="small" />
    );

    const run = async () => {
      const id = toastManager.add({
        title: "Syncing blunders",
        description: `0 of ${total} categories`,
        type: "loading",
        timeout: 0,
        data: { children: progress(0) },
      });
      for (let done = 1; done <= total; done++) {
        await wait(600);
        toastManager.update(id, {
          description: `${done} of ${total} categories`,
          data: { children: progress(done) },
        });
      }
      toastManager.update(id, {
        title: "3 new blunders",
        description: undefined,
        type: "success",
        timeout: 5000,
        data: {},
        actionProps: {
          children: "View",
          onClick: () => toastManager.close(id),
        },
      });
    };
    return <Button onClick={run}>Start sync</Button>;
  };
  return (
    <Demo>
      <SyncButton />
    </Demo>
  );
};

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
