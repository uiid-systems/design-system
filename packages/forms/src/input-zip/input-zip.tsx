import { Input } from "../input/input";
import type { InputZipProps } from "./input-zip.types";

export const InputZip = ({ ...props }: InputZipProps) => {
  return (
    <Input
      inputMode="numeric"
      pattern="^(?(^00000(|-0000))|(\d{5}(|-\d{4})))$"
      {...props}
    />
  );
};
InputZip.displayName = "InputZip";
