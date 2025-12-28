import { Image as TiptapImage } from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ReplaceStep } from "@tiptap/pm/transform";

import type {
  CustomImageOptions,
  DownloadImageCommandProps,
} from "./image.types";
import { filterFiles, randomId } from "../../rich-text-editor.utils";

import { ImageViewBlock } from "./subcomponents/image-view-block";

import { downloadImage, copyImage, copyLink } from "./image.utils";

declare module "@tiptap/react" {
  interface Commands<ReturnType> {
    setImages: {
      setImages: (
        attrs: { src: string | File; alt?: string; title?: string }[],
      ) => ReturnType;
    };
    downloadImage: {
      downloadImage: (attrs: DownloadImageCommandProps) => ReturnType;
    };
    copyImage: {
      copyImage: (attrs: DownloadImageCommandProps) => ReturnType;
    };
    copyLink: {
      copyLink: (attrs: DownloadImageCommandProps) => ReturnType;
    };
    toggleImage: {
      toggleImage: () => ReturnType;
    };
  }
}

export const Image = TiptapImage.extend<CustomImageOptions>({
  atom: true,

  addOptions() {
    const parentOptions = this.parent?.() || {};
    return {
      ...parentOptions,
      inline: false,
      allowBase64: false,
      HTMLAttributes: {},
      resize: false,

      allowedMimeTypes: [],
      maxFileSize: 0,
      uploadFn: undefined,
      onToggle: undefined,
      downloadImage: undefined,
      copyImage: undefined,
      copyLink: undefined,
    };
  },

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      id: { default: null },
      width: { default: null },
      height: { default: null },
      fileName: { default: null },
    };
  },

  addCommands() {
    return {
      setImages:
        (attrs) =>
        ({ commands }) => {
          const [validImages, errors] = filterFiles(attrs, {
            allowedMimeTypes: this.options.allowedMimeTypes,
            maxFileSize: this.options.maxFileSize,
            allowBase64: this.options.allowBase64,
          });

          if (errors.length > 0 && this.options.onValidationError) {
            this.options.onValidationError(errors);
          }

          if (validImages.length > 0) {
            return commands.insertContent(
              validImages.map((image) => {
                if (image.src instanceof File) {
                  const blobUrl = URL.createObjectURL(image.src);
                  const id = randomId();

                  return {
                    type: this.type.name,
                    attrs: {
                      id,
                      src: blobUrl,
                      alt: image.alt,
                      title: image.title,
                      fileName: image.src.name,
                    },
                  };
                } else {
                  return {
                    type: this.type.name,
                    attrs: {
                      id: randomId(),
                      src: image.src,
                      alt: image.alt,
                      title: image.title,
                      fileName: null,
                    },
                  };
                }
              }),
            );
          }

          return false;
        },

      downloadImage: (attrs) => () => {
        const downloadFunc = this.options.downloadImage || downloadImage;
        void downloadFunc({ ...attrs, action: "download" }, this.options);
        return true;
      },

      copyImage: (attrs) => () => {
        const copyImageFunc = this.options.copyImage || copyImage;
        void copyImageFunc({ ...attrs, action: "copyImage" }, this.options);
        return true;
      },

      copyLink: (attrs) => () => {
        const copyLinkFunc = this.options.copyLink || copyLink;
        void copyLinkFunc({ ...attrs, action: "copyLink" }, this.options);
        return true;
      },

      toggleImage:
        () =>
        ({ editor }) => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = this.options.allowedMimeTypes.join(",");
          input.onchange = () => {
            const files = input.files;
            if (!files) return;

            const [validImages, errors] = filterFiles(Array.from(files), {
              allowedMimeTypes: this.options.allowedMimeTypes,
              maxFileSize: this.options.maxFileSize,
              allowBase64: this.options.allowBase64,
            });

            if (errors.length > 0 && this.options.onValidationError) {
              this.options.onValidationError(errors);
              return false;
            }

            if (validImages.length === 0) return false;

            if (this.options.onToggle) {
              this.options.onToggle(
                editor,
                validImages,
                editor.state.selection.from,
              );
            }

            return false;
          };

          input.click();
          return true;
        },
    };
  },

  onTransaction({ transaction }) {
    transaction.steps.forEach((step) => {
      if (step instanceof ReplaceStep && step.slice.size === 0) {
        const deletedPages = transaction.before.content.cut(step.from, step.to);

        deletedPages.forEach((node) => {
          if (node.type.name === "image") {
            const attrs = node.attrs;

            if (attrs.src.startsWith("blob:")) {
              URL.revokeObjectURL(attrs.src);
            }

            this.options.onImageRemoved?.(attrs);
          }
        });
      }
    });
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageViewBlock, {
      className: "block-node",
    });
  },
});
