"use client";

import * as React from "react";

import { Button } from "@uiid/buttons";
import { Input, Switch } from "@uiid/forms";
import { XIcon } from "@uiid/icons";
import { Stack, Group } from "@uiid/layout";
import { Modal, type ModalProps } from "@uiid/overlays";

type EditProfileModalProps = ModalProps;

export const EditProfileModal = ({ ...props }: EditProfileModalProps) => {
  const [open, setOpen] = React.useState(false);
  const initialFocusRef = React.useRef<HTMLInputElement>(null);

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      PopupProps={{ initialFocus: initialFocusRef }}
      title="Edit your profile"
      description="Your profile information will be public to the community. It won't be scraped or indexed by search engines or accessible to non-members."
      size="small"
      action={
        <Button
          ghost
          square
          size="xsmall"
          onClick={() => setOpen(false)}
          tooltip="Close"
        >
          <XIcon />
        </Button>
      }
      footer={
        <Group ax="end" fullwidth gap={4}>
          <Button ghost onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button>Save changes</Button>
        </Group>
      }
      {...props}
    >
      <Stack gap={4} my={4} fullwidth ax="stretch">
        <Input
          required
          label="Name"
          size="medium"
          placeholder="Real name preferred, but a nickname is fine."
          ref={initialFocusRef as React.RefObject<HTMLInputElement>}
        />
        <Input
          label="Description"
          size="medium"
          placeholder="Think of it like a yearbook quote."
        />
        <Input
          label="Location"
          size="medium"
          placeholder="Where can people usually find you?"
        />
      </Stack>

      <Stack gap={4} fullwidth ax="stretch" mb={4}>
        <Switch label="Show my profile on the leaderboard" defaultChecked />
        <Switch label="Allow people to friend me" defaultChecked />
      </Stack>
    </Modal>
  );
};
EditProfileModal.displayName = "EditProfileModal";
