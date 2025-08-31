import { Box } from "../../layout";

export const FormFieldBookend = ({ children }: React.PropsWithChildren) => {
  return <Box data-slot="bookend">{children}</Box>;
};
FormFieldBookend.displayName = "FormFieldBookend";
