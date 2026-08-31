import type { Field } from "@base-ui/react/field";
import type { Icon } from "@uiid/icons";
import type { GroupProps } from "@uiid/layout";
import type { TextProps } from "@uiid/typography";
import type { SpacingProps, VariantProps } from "@uiid/utils";

import type { fieldRowVariants } from "./field.variants";

export type FieldRowVariants = VariantProps<typeof fieldRowVariants>;

export type FieldRootProps = Field.Root.Props &
  SpacingProps & {
    fullwidth?: boolean;
  };

export type FieldItemProps = Field.Item.Props;

export type FieldControlProps = Field.Control.Props;

export type FieldValidityProps = Field.Validity.Props;

export type FieldLabelProps = Field.Label.Props &
  TextProps & {
    required?: boolean;
  };

export type FieldDescriptionProps = Field.Description.Props &
  Omit<TextProps, "ref">;

export type FieldHintValue =
  | { icon?: Icon; text?: string; tooltip?: never }
  | { icon: Icon; text?: string; tooltip?: React.ReactNode };

export type FieldRowProps = GroupProps &
  FieldRowVariants &
  Pick<FieldRootProps, "name"> &
  React.PropsWithChildren<{
    label?: string;
    description?: string;
    LabelProps?: FieldLabelProps;
    DescriptionProps?: FieldDescriptionProps;
    ErrorProps?: FieldErrorProps;
  }>;

export type FieldErrorType = "inline" | "tooltip" | "absolute";
export type FieldErrorProps = Field.Error.Props;
export type FieldHintProps = React.ComponentPropsWithoutRef<"span">;

export type FieldProps = React.PropsWithChildren &
  Field.Root.Props & {
    label?: string;
    description?: string;
    hint?: FieldHintValue;
    errorType?: FieldErrorType;
    RootProps?: FieldRootProps;
    LabelProps?: FieldLabelProps;
    ErrorProps?: Field.Error.Props;
    HintProps?: FieldHintProps;
    DescriptionProps?: FieldDescriptionProps;
  } & Pick<FieldLabelProps, "required"> &
  Pick<FieldRootProps, "fullwidth"> &
  SpacingProps;
