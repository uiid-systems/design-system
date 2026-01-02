import { Field as BaseField } from "@base-ui/react/field";
import { Text } from "@uiid/typography";

import type { FieldLabelProps } from "../field.types";

export const FieldLabel = ({ children, ...props }: FieldLabelProps) => {
  return (
    <BaseField.Label
      data-slot="field-label"
      render={<Text size={1} bold />}
      {...props}
    >
      {children}
    </BaseField.Label>
  );
};
FieldLabel.displayName = "FieldLabel";
