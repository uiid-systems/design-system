"use client";

import { useState } from "react";

import { Button } from "@uiid/buttons";
import { Input, InputPassword } from "@uiid/forms";
import { Stack, Group, Layer } from "@uiid/layout";
import { Modal } from "@uiid/overlays";
import { Text } from "@uiid/typography";

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
      size="sm"
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
    <Stack gap={8} p={4} ax="stretch">
      <LoginFormHeader />
      <LoginFormSocials />
      <Divider />
      <LoginFormEmail />

      <Group gap={2} ax="end">
        <Button variant="subtle" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button>Login</Button>
      </Group>
    </Stack>
  );
};
LoginForm.displayName = "LoginForm";

const LoginFormHeader = () => {
  return (
    <Stack gap={4} p={2} ax="stretch">
      <Text render={<h2 />} level={2} bold center>
        Welcome back
      </Text>
      <Text render={<p />} level={0} shade="accent" center>
        Login with your Discord or Google account.
      </Text>
    </Stack>
  );
};
LoginFormHeader.displayName = "LoginFormHeader";

const LoginFormSocials = () => {
  return (
    <Stack gap={4} ax="stretch">
      <Button variant="subtle">Login with Discord</Button>
      <Button variant="subtle">Login with Google</Button>
    </Stack>
  );
};
LoginFormSocials.displayName = "LoginFormSocials";

const LoginFormEmail = () => {
  return (
    <Stack gap={4} ax="stretch">
      <Input label="Email" required />
      <InputPassword label="Password" required />
    </Stack>
  );
};
LoginFormEmail.displayName = "LoginFormEmail";

const Divider = () => {
  return (
    <Layer>
      <hr className="w-full border-t border-(--shade-accent) mt-[6px]" />
      <Text
        level={0}
        shade="accent"
        center
        px={2}
        className="bg-(--shade-surface) justify-self-center"
      >
        Or continue with
      </Text>
    </Layer>
  );
};
Divider.displayName = "Divider";
