import { Slots, type SlotsProps } from "@uiid/primitives";

import { FormFieldBookend } from "./formfield-bookend";
import "./formfield-slots.css";

type FormFieldSlotsProps = React.PropsWithChildren & SlotsProps;

export const FormFieldSlots = ({
  before,
  after,
  children,
  ...props
}: FormFieldSlotsProps) => {
  const BeforeBookend = () => (
    <FormFieldBookend position="before">{before}</FormFieldBookend>
  );
  const AfterBookend = () => (
    <FormFieldBookend position="after">{after}</FormFieldBookend>
  );

  return (
    <Slots
      data-slot="formfield-slots"
      before={before && <BeforeBookend />}
      after={after && <AfterBookend />}
      {...props}
    >
      {children}
    </Slots>
  );
};
FormFieldSlots.displayName = "FormFieldSlots";
