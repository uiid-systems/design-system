"use client";

import { Input } from "../input/input";

import type { InputFileProps } from "./input-file.types";
import "./input-file.styles.css";

import { FileIcon } from "./subcomponents";

export const InputFile = ({ type = "file", ...props }: InputFileProps) => {
  return (
    <Input
      {...props}
      data-slot="input-file"
      type="file"
      before={<FileIcon type={type} />}
    />
  );
};
InputFile.displayName = "InputFile";
