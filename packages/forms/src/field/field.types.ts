import type { Field } from "@base-ui/react/field";

import type { Icon } from "@uiid/icons";
import type { TextProps } from "@uiid/typography";
import type { SpacingProps } from "@uiid/utils";

export type FieldRootProps = Field.Root.Props &
  SpacingProps & {
    fullwidth?: boolean;
  };

export type FieldLabelProps = Field.Label.Props &
  TextProps & {
    required?: boolean;
  };

export type FieldDescriptionProps = Field.Description.Props &
  Omit<TextProps, "ref">;

export type FieldHint =
  | { icon?: Icon; text?: string; tooltip?: never }
  | { icon: Icon; text?: string; tooltip?: React.ReactNode };

export type FieldErrorType = "inline" | "tooltip" | "absolute";
export type FieldErrorProps = Field.Error.Props;
export type FieldHintProps = React.ComponentPropsWithoutRef<"span">;

export type FieldProps = React.PropsWithChildren &
  Field.Root.Props & {
    label?: string;
    description?: string;
    hint?: FieldHint;
    errorType?: FieldErrorType;
    RootProps?: FieldRootProps;
    LabelProps?: FieldLabelProps;
    ErrorProps?: Field.Error.Props;
    HintProps?: FieldHintProps;
    DescriptionProps?: FieldDescriptionProps;
  } & Pick<FieldLabelProps, "required"> &
  Pick<FieldRootProps, "fullwidth"> &
  SpacingProps;
