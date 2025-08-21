export const FormFieldDescription = ({
  children,
  ...props
}: React.PropsWithChildren & React.ComponentProps<"span">) => {
  return (
    <span data-uiid="formfield-description" {...props}>
      {children}
    </span>
  );
};
FormFieldDescription.displayName = "FormFieldDescription";
