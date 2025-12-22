import { Text, type TextProps } from "@uiid/typography";

export type FieldLabelProps = TextProps;

export const FieldLabel = ({ children, ...props }: FieldLabelProps) => {
  return (
    <Text render={<label />} level={1} bold {...props}>
      {children}
    </Text>
  );
};
FieldLabel.displayName = "FieldLabel";
