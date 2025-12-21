import { Text } from "@uiid/typography";

type FieldDescriptionProps = React.ComponentProps<"span">;

export const FieldDescription = ({
  children,
  ...props
}: FieldDescriptionProps) => {
  return (
    <Text render={<span />} level={0} shade="accent" {...props}>
      {children}
    </Text>
  );
};
FieldDescription.displayName = "FieldDescription";
