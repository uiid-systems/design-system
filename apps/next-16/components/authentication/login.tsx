"use client";

import { useState } from "react";
import { SiDiscord, SiGoogle, SiApple } from "@icons-pack/react-simple-icons";

import { Button, type ButtonProps } from "@uiid/buttons";
import { Input } from "@uiid/forms";
import { XIcon } from "@uiid/icons";
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
      title="Welcome back"
      description="Login with one of your social accounts."
      action={
        <Button
          onClick={() => handleOpenChange(false)}
          size="xsmall"
          ghost
          square
        >
          <XIcon size={14} />
        </Button>
      }
      size="small"
    >
      <LoginForm onOpenChange={handleOpenChange} />
    </Modal>
  );
};
Login.displayName = "Login";

const LoginButton = ({ ...props }: ButtonProps) => {
  return (
    <Button variant="subtle" size="small" {...props}>
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
    <Stack gap={8} p={4} ax="stretch" fullwidth>
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

const LoginFormSocials = () => {
  return (
    <Stack gap={4} ax="stretch">
      <SocialButton>
        <SiDiscord size={14} />
        Login with Discord
      </SocialButton>

      <SocialButton>
        <SiApple size={12} />
        Login with Apple
      </SocialButton>

      <SocialButton>
        <SiGoogle size={12} />
        Login with Google
      </SocialButton>
    </Stack>
  );
};
LoginFormSocials.displayName = "LoginFormSocials";

const LoginFormEmail = () => {
  return (
    <Stack gap={4} ax="stretch">
      <Input label="Email" required />
      <Input label="Password" required />
    </Stack>
  );
};
LoginFormEmail.displayName = "LoginFormEmail";

const Divider = () => {
  return (
    <Layer>
      <hr className="w-full border-t border-(--shade-accent) mt-[6px]" />
      <Text
        size={0}
        shade="accent"
        px={2}
        className="bg-(--shade-surface) justify-self-center"
      >
        Or continue with
      </Text>
    </Layer>
  );
};
Divider.displayName = "Divider";

const SocialButton = ({ children }: React.PropsWithChildren) => {
  return <Button variant="subtle">{children}</Button>;
};
SocialButton.displayName = "SocialButton";
