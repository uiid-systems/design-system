import type { Field } from "@base-ui/react/field";

import type { StackProps } from "@uiid/layout";
import type { TextProps } from "@uiid/typography";

export type FieldRootProps = Field.Root.Props & Pick<StackProps, "fullwidth">;

export type FieldLabelProps = Field.Label.Props &
  TextProps & {
    required?: boolean;
  };

export type FieldDescriptionProps = Field.Description.Props &
  Omit<TextProps, "ref">;

export type FieldErrorProps = Field.Error.Props;
export type FieldProps = React.PropsWithChildren &
  Field.Root.Props & {
    label?: string;
    description?: string;
    RootProps?: FieldRootProps;
    LabelProps?: FieldLabelProps;
    ErrorProps?: Field.Error.Props;
    DescriptionProps?: FieldDescriptionProps;
  } & Pick<FieldLabelProps, "required"> &
  Pick<FieldRootProps, "fullwidth">;
