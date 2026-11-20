import { Box } from "../box/box";
import type { GroupProps } from "./group.types";

export const Group = (props: GroupProps) => {
  return <Box data-slot="group" {...props} />;
};
Group.displayName = "Group";
