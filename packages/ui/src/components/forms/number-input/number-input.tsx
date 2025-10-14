"use client";

import { useState } from "react";

import { Plus, Minus } from "@uiid/icons";
import { cx } from "@uiid/primitives";

import { Input } from "../input/input";

import type { NumberInputProps } from "./number-input.types";
import styles from "./number-input.module.css";

export const NumberInput = ({
  min,
  max,
  step = 1,
  defaultValue,
  beforeOnClick,
  afterOnClick,
  ...props
}: NumberInputProps) => {
  const [value, setValue] = useState<number | undefined>(defaultValue);

  const handleMinus = () => {
    if (value && min && value - step < min) return;
    setValue((value ?? 0) - step);
    beforeOnClick?.();
  };

  const handlePlus = () => {
    if (value && max && value + step > max) return;
    setValue((value ?? 0) + step);
    afterOnClick?.();
  };

  return (
    <Input
      before={<Minus size={12} />}
      after={<Plus size={12} />}
      beforeOnClick={handleMinus}
      afterOnClick={handlePlus}
      className={cx(styles["number-input"])}
      type="number"
      value={value?.toString()}
      onChange={(e) => setValue(Number(e.currentTarget.value))}
      {...props}
    />
  );
};
NumberInput.displayName = "NumberInput";
