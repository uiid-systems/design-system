import { Box } from "../../layout";

import "./formfield-bookend.css";

export const FormFieldBookend = ({ children }: React.PropsWithChildren) => {
  const isString = typeof children === "string";

  return (
    <Box data-slot="formfield-bookend" data-is-string={isString}>
      {children}
    </Box>
  );
};
FormFieldBookend.displayName = "FormFieldBookend";
