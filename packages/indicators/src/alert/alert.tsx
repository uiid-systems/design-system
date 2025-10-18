"use client";

import { useRef, useState } from "react";

import { Card } from "@uiid/cards";

import type { AlertProps } from "./alert.types";

export const Alert = ({
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
      role="alert"
      variant={variant}
      fullwidth
      onDismiss={handleDismiss}
      ref={alertRef}
      {...props}
    >
      {children}
    </Card>
  );
};
Alert.displayName = "Alert";
