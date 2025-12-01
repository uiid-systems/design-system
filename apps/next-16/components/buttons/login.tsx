"use client";

import { useState } from "react";

import { Button } from "@uiid/buttons";
import { Input } from "@uiid/forms";
import { Stack, Group } from "@uiid/layout";
import { Modal, type ModalProps } from "@uiid/overlays";

export const Login = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={handleOpenChange}
      trigger={<LoginButton />}
    >
      <LoginForm onOpenChange={handleOpenChange} />
    </Modal>
  );
};
Login.displayName = "Login";

const LoginButton = () => {
  return (
    <Button variant="subtle" size="sm">
      Login
    </Button>
  );
};
LoginButton.displayName = "LoginButton";

const LoginForm = ({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <Stack gap={4} ax="stretch" mt={4}>
      <Input label="Email" required />
      <Input label="Password" required />
      <Group gap={2} ax="end" mt={4}>
        <Button variant="subtle" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button>Login</Button>
      </Group>
    </Stack>
  );
};
LoginForm.displayName = "LoginForm";
