"use client";

import { useRef, useState } from "react";

import { Card, Group } from "@uiid/primitives";

import { AlertDismiss, AlertIcon } from "./subcomponents";
import type { AlertProps } from "./alert.types";

export const Alert = ({
  dismissible = true,
  variant,
  onDismiss,
  children,
  ...props
}: AlertProps) => {
  const alertRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);

    if (
      document.activeElement === alertRef.current ||
      alertRef.current?.contains(document.activeElement)
    ) {
      (document.activeElement as HTMLElement)?.blur();
    }

    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <Card
      uiid="alert"
      ref={alertRef}
      role="alert"
      data-variant={variant}
      fullwidth
      {...props}
    >
      <Group ay="center" gap={2} fullwidth>
        {variant && variant !== "inverted" && <AlertIcon type={variant} />}
        {children}
        {dismissible && <AlertDismiss onClick={handleDismiss} />}
      </Group>
    </Card>
  );
};
Alert.displayName = "Alert";
