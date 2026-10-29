import type { ButtonProps } from "@uiid/buttons";
import type { TextareaProps } from "@uiid/forms";

import type { ChatStatus } from "../ai.types";

/**
 * What `onSubmit` receives. An object so attachments can join it later
 * without a breaking change.
 */
export type PromptInputMessage = {
  text: string;
};

/**
 * `Textarea` props, minus the three PromptInput owns: `before` and `after`
 * are the header and footer, and `resize` is `none` because the textarea
 * sizes itself.
 */
export type PromptInputProps = Omit<
  TextareaProps,
  "before" | "after" | "resize"
> & {
  /** Where the chat request is. Drives submit versus stop. Defaults to `"ready"`. */
  status?: ChatStatus;
  /** Called on Enter or on the submit button, with the text and the already-prevented form event. */
  onSubmit: (
    message: PromptInputMessage,
    event: React.FormEvent<HTMLFormElement>,
  ) => void | Promise<void>;
  /** Called when the stop button is pressed while `submitted` or `streaming`. */
  onStop?: () => void;
  /** Row above the text, inside the surface. Chips, an attachment list, a mode label. */
  header?: React.ReactNode;
  /** Buttons at the start of the footer row, before the submit button. */
  tools?: React.ReactNode;
};

export type PromptInputSubmitProps = ButtonProps & {
  /** Submit for `ready` and `error`; stop for `submitted` and `streaming`. Defaults to `"ready"`. */
  status?: ChatStatus;
  /** Called instead of submitting while `submitted` or `streaming`. */
  onStop?: () => void;
};
