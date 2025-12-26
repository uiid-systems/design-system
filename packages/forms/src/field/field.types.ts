import type { Field } from "@base-ui/react/field";

export type FieldProps = React.PropsWithChildren &
  Field.Root.Props & {
    label?: string;
    description?: string;
    error?: string;
    className?: string;
    LabelProps?: Field.Label.Props;
    ErrorProps?: Field.Error.Props;
    DescriptionProps?: Field.Description.Props;
  };
