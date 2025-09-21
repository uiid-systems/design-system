import { Box } from "@uiid/primitives";

import "./formfield-bookend.css";

type FormFieldBookendProps = React.PropsWithChildren<{
  position?: "before" | "after";
}>;

export const FormFieldBookend = ({
  position,
  children,
}: FormFieldBookendProps) => {
  return (
    <Box
      data-slot="formfield-bookend"
      data-position={position}
      data-bordered="true"
    >
      {children}
    </Box>
  );
};
FormFieldBookend.displayName = "FormFieldBookend";
