import type { Field } from "@base-ui/react/field";

import type { TextProps } from "@uiid/typography";

export type FieldRootProps = Field.Root.Props;

export type FieldLabelProps = Field.Label.Props & TextProps;

export type FieldDescriptionProps = Field.Description.Props &
  Omit<TextProps, "ref">;

export type FieldErrorProps = Field.Error.Props;
export type FieldProps = React.PropsWithChildren &
  Field.Root.Props & {
    label?: string;
    description?: string;
    error?: string;
    RootProps?: FieldRootProps;
    LabelProps?: FieldLabelProps;
    ErrorProps?: Field.Error.Props;
    DescriptionProps?: FieldDescriptionProps;
  };
