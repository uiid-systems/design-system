import { Box } from "../../../layout";

import "./formfield-bookend.css";

type FormFieldBookendProps = React.PropsWithChildren<{
  position?: "before" | "after";
}>;

export const FormFieldBookend = ({
  position,
  children,
}: FormFieldBookendProps) => {
  const isString = typeof children === "string";

  return (
    <Box
      data-slot="formfield-bookend"
      data-position={position}
      data-is-string={isString}
      data-bordered="true"
    >
      {children}
    </Box>
  );
};
FormFieldBookend.displayName = "FormFieldBookend";
