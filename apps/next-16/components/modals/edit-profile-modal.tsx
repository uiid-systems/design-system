"use client";

import * as React from "react";

import { Button } from "@uiid/buttons";
import { Input } from "@uiid/forms";
import { XIcon } from "@uiid/icons";
import { Stack, Group } from "@uiid/layout";
import { Modal, type ModalProps } from "@uiid/overlays";

type EditProfileModalProps = ModalProps;

export const EditProfileModal = ({ ...props }: EditProfileModalProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Edit your profile"
      description="Your profile information will be displayed publicly, it's used to help others in your community identify you."
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
          <Button ghost>Cancel</Button>
          <Button>Save changes</Button>
        </Group>
      }
      {...props}
    >
      <Stack gap={4} my={4} fullwidth ax="stretch">
        <Input
          required
          label="Name"
          placeholder="Real name preferred, but a nickname is fine."
        />
        <Input
          label="Description"
          placeholder="Think of it like a yearbook quote."
        />
        <Input
          label="Location"
          placeholder="Where can people usually find you?"
        />
      </Stack>
    </Modal>
  );
};
EditProfileModal.displayName = "EditProfileModal";
