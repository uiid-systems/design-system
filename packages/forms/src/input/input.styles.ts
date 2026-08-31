import { cx } from "@uiid/utils";

import type { InputVariants } from "./input.types";
import { inputVariants } from "./input.variants";

import styles from "./input.module.css";

export type InputControlClassNameOptions = InputVariants & {
  /** Painted inside an `InputWrapper`, which carries the control surface. */
  inner?: boolean;
  /** Accepts whatever `cx` does, so Base UI's `className` can pass straight through. */
  className?: Parameters<typeof cx>[number];
};

/**
 * The control surface an `<input>` needs, without the element itself.
 *
 * `InputControl` is Base UI's `Input`, which is a `Field.Control`: it registers
 * itself with the surrounding field and takes its `name` from that field. That
 * is right for a bare input, but wrong for a composite whose Base UI root
 * already registers a control and submits its own value — the field's `name`
 * would land on the visible input too and the value would submit twice. Those
 * composites style a plain `<input>` with this instead.
 *
 * Lives apart from the components so the module keeps a components-only export
 * surface (fast refresh).
 */
export const inputControlClassName = ({
  inner,
  size,
  fullwidth,
  ghost,
  className,
}: InputControlClassNameOptions = {}) =>
  cx(
    styles["input"],
    inner ? styles["input-inner"] : inputVariants({ size, fullwidth, ghost }),
    className,
  );
