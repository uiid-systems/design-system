import "./formfield-description.css";

export type FormFieldDescriptionProps = {
  hasError?: boolean;
};

export const FormFieldDescription = ({
  hasError,
  children,
  ...props
}: React.PropsWithChildren &
  React.ComponentProps<"span"> &
  FormFieldDescriptionProps) => {
  return (
    <span data-slot="formfield-description" data-error={hasError} {...props}>
      {children}
    </span>
  );
};
FormFieldDescription.displayName = "FormFieldDescription";
