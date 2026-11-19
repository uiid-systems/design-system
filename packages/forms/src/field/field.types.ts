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

/** Muted by default when no `color` is set. Set `emphasis` to change that; there is no `shade`. */
export type FieldDescriptionProps = Field.Description.Props &
  Omit<TextProps, "ref" | "shade">;

export type FieldHintValue = { icon?: Icon; text: string };

export type FieldRowProps = GroupProps &
  FieldRowVariants &
  React.PropsWithChildren<{
    label?: React.ReactNode;
    description?: React.ReactNode;
    LabelProps?: FieldLabelProps;
    DescriptionProps?: FieldDescriptionProps;
    ErrorProps?: FieldErrorProps;
    /**
     * The frame the wrapping component paints around the row, such as its
     * bordered and reversed treatments. Kept apart from `className` because a
     * row with no label or description has no frame to paint, so it drops these
     * and keeps the caller's `className`. This is for wrapper components (Radio,
     * Checkbox, Switch), not app code, and it is dropped on a bare row.
     */
    frameClassName?: string;
  }>;

export type FieldErrorProps = Field.Error.Props;
export type FieldHintProps = React.ComponentPropsWithoutRef<"span">;
export type FieldActionProps = GroupProps;

export type FieldProps = React.PropsWithChildren &
  Field.Root.Props &
  FieldVariants & {
    label?: React.ReactNode;
    description?: React.ReactNode;
    action?: React.ReactNode;
    RootProps?: FieldRootProps;
    /** `required` is Field's own, so the label and the control can't disagree. */
    LabelProps?: Omit<FieldLabelProps, "required">;
    ErrorProps?: Field.Error.Props;
    ActionProps?: FieldActionProps;
    DescriptionProps?: FieldDescriptionProps;
  } & Pick<FieldLabelProps, "required"> &
  Pick<FieldRootProps, "fullwidth" | "w"> &
  SpacingProps;
