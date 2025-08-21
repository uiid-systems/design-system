import { Box } from "../../layout";

export const Bookend = ({ children }: React.PropsWithChildren) => {
  return <Box data-uiid="bookend">{children}</Box>;
};
Bookend.displayName = "Bookend";
