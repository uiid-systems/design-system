import type { ButtonProps } from "../button/button.types";

export type CopyButtonProps = Omit<
  ButtonProps,
  "icon" | "href" | "children"
> & {
  clipboardText: string;
  copyText?: string;
  copiedText?: string;
};
