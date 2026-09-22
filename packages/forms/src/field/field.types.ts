import type { Field } from "@base-ui/react/field";
import type { Icon } from "@uiid/icons";
import type { GroupProps, StackProps } from "@uiid/layout";
import type { TextProps } from "@uiid/typography";
import type { SpacingProps, VariantProps, WithLayoutProps } from "@uiid/utils";

import type { fieldRowVariants, fieldVariants } from "./field.variants";

export type FieldRowVariants = VariantProps<typeof fieldRowVariants>;
export type FieldVariants = VariantProps<typeof fieldVariants>;

/*
 * No `gap` default rides along: the size tier owns the field's gap through
 * `--field-gap`, so a gap only lands inline when a caller pins one.
 */
export type FieldRootProps = WithLayoutProps<Field.Root.Props, StackProps>;

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
export type FieldActionProps = GroupProps;

export type FieldProps = React.PropsWithChildren &
  Field.Root.Props &
  FieldVariants & {
    label?: string;
    description?: string;
    action?: React.ReactNode;
    errorType?: FieldErrorType;
    RootProps?: FieldRootProps;
    LabelProps?: FieldLabelProps;
    ErrorProps?: Field.Error.Props;
    ActionProps?: FieldActionProps;
    DescriptionProps?: FieldDescriptionProps;
  } & Pick<FieldLabelProps, "required"> &
  Pick<FieldRootProps, "fullwidth"> &
  SpacingProps;
