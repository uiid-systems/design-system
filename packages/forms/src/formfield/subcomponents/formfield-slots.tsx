import { Slots, type SlotsProps } from "@uiid/layout";
import { cx } from "@uiid/utils";

import styles from "../../forms.module.css";

import { FormFieldBookend } from "./formfield-bookend";
import "./formfield-slots.css";

type FormFieldSlotsProps = React.PropsWithChildren & SlotsProps;

export const FormFieldSlots = ({
  before,
  beforeOnClick,
  after,
  afterOnClick,
  className,
  children,
  ...props
}: FormFieldSlotsProps) => {
  return (
    <Slots
      data-slot="formfield-slots"
      ay="stretch"
      className={cx(styles["formfield-slots"], className)}
      beforeOnClick={beforeOnClick}
      before={
        before && (
          <FormFieldBookend position="before">{before}</FormFieldBookend>
        )
      }
      afterOnClick={afterOnClick}
      after={
        after && <FormFieldBookend position="after">{after}</FormFieldBookend>
      }
      {...props}
    >
      {children}
    </Slots>
  );
};
FormFieldSlots.displayName = "FormFieldSlots";
