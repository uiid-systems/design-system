import { Slots, type SlotsProps } from "@uiid/layout";

import { FormFieldBookend } from "./formfield-bookend";
import "./formfield-slots.css";

type FormFieldSlotsProps = React.PropsWithChildren & SlotsProps;

export const FormFieldSlots = ({
  before,
  after,
  beforeOnClick,
  afterOnClick,
  children,
  ...props
}: FormFieldSlotsProps) => {
  return (
    <Slots
      data-slot="formfield-slots"
      before={
        before && (
          <FormFieldBookend position="before">{before}</FormFieldBookend>
        )
      }
      beforeOnClick={beforeOnClick}
      after={
        after && <FormFieldBookend position="after">{after}</FormFieldBookend>
      }
      afterOnClick={afterOnClick}
      {...props}
    >
      {children}
    </Slots>
  );
};
FormFieldSlots.displayName = "FormFieldSlots";
