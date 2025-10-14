import { Box } from "@uiid/primitives";

import "./formfield-bookend.css";

type FormFieldBookendProps = React.PropsWithChildren<{
  position?: "before" | "after";
}> &
  React.HTMLAttributes<HTMLDivElement>;

export const FormFieldBookend = ({
  position,
  children,
  ...props
}: FormFieldBookendProps) => {
  return (
    <Box
      data-slot="formfield-bookend"
      data-position={position}
      data-bordered="true"
      {...props}
    >
      {children}
    </Box>
  );
};
FormFieldBookend.displayName = "FormFieldBookend";
