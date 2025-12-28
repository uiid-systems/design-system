import { type ImageOptions } from "@tiptap/extension-image";
import type { Attrs } from "@tiptap/pm/model";
import type { Editor } from "@tiptap/react";

import type {
  FileValidationOptions,
  FileError,
} from "../../rich-text-editor.utils";

export type ActionKey = "onView" | "onDownload" | "onCopy" | "onCopyLink";

export type ImageAction = "download" | "copyImage" | "copyLink";

export type UploadReturnType =
  | string
  | {
      id: string | number;
      src: string;
    };

export interface DownloadImageCommandProps {
  src: string;
  alt?: string;
}

export interface ImageActionProps extends DownloadImageCommandProps {
  action: ImageAction;
}

export interface CustomImageOptions
  extends ImageOptions,
    Omit<FileValidationOptions, "allowBase64"> {
  uploadFn?: (file: File, editor: Editor) => Promise<UploadReturnType>;
  onImageRemoved?: (props: Attrs) => void;
  onActionSuccess?: (props: ImageActionProps) => void;
  onActionError?: (error: Error, props: ImageActionProps) => void;
  downloadImage?: (
    props: ImageActionProps,
    options: CustomImageOptions,
  ) => Promise<void>;
  copyImage?: (
    props: ImageActionProps,
    options: CustomImageOptions,
  ) => Promise<void>;
  copyLink?: (
    props: ImageActionProps,
    options: CustomImageOptions,
  ) => Promise<void>;
  onValidationError?: (errors: FileError[]) => void;
  onToggle?: (editor: Editor, files: File[], pos: number) => void;
}
