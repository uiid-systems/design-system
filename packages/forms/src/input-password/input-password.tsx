"use client";
import { Eye, EyeOff } from "@uiid/icons";
import { useState } from "react";
import { Input } from "../input/input";

import type { InputPasswordProps } from "./input-password.types";

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
        showPassword ? <Eye size={ICON_SIZE} /> : <EyeOff size={ICON_SIZE} />
      }
      afterOnClick={handleTogglePassword}
    />
  );
};
