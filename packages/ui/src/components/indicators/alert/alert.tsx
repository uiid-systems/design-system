"use client";

import { useRef, useState } from "react";

import { Box, Group, cx } from "@uiid/primitives";

import type { AlertProps } from "./alert.types";
import styles from "./alert.module.css";

import { AlertDismiss, AlertIcon } from "./subcomponents";

export const Alert = ({
  dismissible = true,
  variant,
  onDismiss,
  className,
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
    <Box
      uiid="alert"
      className={cx(styles.alert, className)}
      ref={alertRef}
      role="alert"
      data-variant={variant}
      fullwidth
      {...props}
    >
      <Group ay="center" gap={4} fullwidth>
        {variant && variant !== "inverted" && <AlertIcon type={variant} />}
        {children}
        {dismissible && <AlertDismiss onClick={handleDismiss} />}
      </Group>
    </Box>
  );
};
Alert.displayName = "Alert";
