import { Slots, type SlotsProps } from "../../../layout";
import { FormFieldBookend } from "./formfield-bookend";

import "./formfield-slots.css";

type FormFieldSlotsProps = React.PropsWithChildren & SlotsProps;

export const FormFieldSlots = ({
  before,
  after,
  children,
  ...props
}: FormFieldSlotsProps) => {
  return (
    <Slots
      data-slot="formfield-slots"
      before={before && <FormFieldBookend>{before}</FormFieldBookend>}
      after={after && <FormFieldBookend>{after}</FormFieldBookend>}
      {...props}
    >
      {children}
    </Slots>
  );
};
FormFieldSlots.displayName = "FormFieldSlots";
