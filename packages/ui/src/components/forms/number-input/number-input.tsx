import { Plus, Minus } from "@uiid/icons";
import { cx } from "@uiid/primitives";

import { Input } from "../input/input";

import styles from "./number-input.module.css";

export const NumberInput = () => {
  return (
    <Input
      before={{
        content: <Minus size={12} />,
        onClick: () => alert("minus"),
      }}
      after={{
        content: <Plus size={12} />,
        onClick: () => alert("plus"),
      }}
      className={cx(styles["number-input"])}
      type="number"
    />
  );
};
NumberInput.displayName = "NumberInput";
