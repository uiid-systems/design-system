import { Text, type TextProps } from "@uiid/typography";

export type FieldLabelProps = TextProps &
  React.LabelHTMLAttributes<HTMLLabelElement>;

export const FieldLabel = ({ children, ...props }: FieldLabelProps) => {
  return (
    <Text render={<label />} size={1} bold {...props}>
      {children}
    </Text>
  );
};
FieldLabel.displayName = "FieldLabel";
