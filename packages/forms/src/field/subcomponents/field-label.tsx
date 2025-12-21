import { Text } from "@uiid/typography";

type FieldLabelProps = React.ComponentProps<"label">;

export const FieldLabel = ({ children, ...props }: FieldLabelProps) => {
  return (
    <Text render={<label />} level={1} bold {...props}>
      {children}
    </Text>
  );
};
FieldLabel.displayName = "FieldLabel";
