import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { cxState, resolveTrigger } from "@uiid/utils";

import type { DialogTriggerProps } from "../dialog.types";

import styles from "../dialog.module.css";

export const DialogTrigger = ({
  children,
  className,
  ...props
}: DialogTriggerProps) => (
  <BaseDialog.Trigger
    data-slot="dialog-trigger"
    className={cxState(styles["dialog-trigger"], className)}
    {...resolveTrigger(children, props.render)}
    {...props}
  />
);
DialogTrigger.displayName = "DialogTrigger";
