"use client";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Input } from "../input/input";

import type { InputPasswordProps } from "./input-password.types";
import "./input-password.styles.css";

const ICON_SIZE = 12;

export const InputPassword = ({ ...props }: InputPasswordProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((p) => !p);
  };

  return (
    <Input
      {...props}
      type={showPassword ? "text" : "password"}
      after={
        <button
          data-slot="password-visibility-toggle"
          onClick={handleTogglePassword}
        >
          {showPassword ? (
            <Eye size={ICON_SIZE} />
          ) : (
            <EyeOff size={ICON_SIZE} />
          )}
        </button>
      }
    />
  );
};
