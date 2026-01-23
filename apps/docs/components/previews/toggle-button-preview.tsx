"use client";

import * as React from "react";

import { ToggleButton, type ToggleButtonProps } from "@uiid/buttons";
import { Heart, HeartOff } from "@uiid/icons";

export function ToggleButtonPreview({ ...props }: ToggleButtonProps) {
  const [pressed, setPressed] = React.useState(false);

  return (
    <ToggleButton
      pressed={pressed}
      onPressedChange={setPressed}
      icon={{ pressed: <Heart fill="red" />, unpressed: <HeartOff /> }}
      text={{ pressed: "Liked", unpressed: "Like" }}
      {...props}
    />
  );
}
