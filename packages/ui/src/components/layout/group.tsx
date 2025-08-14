import { Box, type BoxProps } from "./box";

import "./group.styles.css";

export type GroupProps = BoxProps;

export const Group = ({ ...props }: GroupProps) => {
  return <Box uiid="group" {...props} />;
};
Group.displayName = "Group";
