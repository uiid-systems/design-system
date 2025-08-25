export const FormFieldLabel = ({
  children,
  ...props
}: React.ComponentProps<"label">) => {
  return (
    <label data-slot="formfield-label" data-required-content="*" {...props}>
      {children}
    </label>
  );
};
FormFieldLabel.displayName = "FormFieldLabel";
