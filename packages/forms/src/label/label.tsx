import { Text } from "@uiid/typography";

import type { LabelProps } from "./label.types";

export const Label = ({ children, ...props }: LabelProps) => {
  return (
    <Text render={<label />} level={0} bold {...props}>
      {children}
    </Text>
  );
};
Label.displayName = "Label";
