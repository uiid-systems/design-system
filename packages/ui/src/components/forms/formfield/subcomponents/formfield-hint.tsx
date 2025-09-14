import "./formfield-hint.css";

export const FormFieldHint = ({ children }: React.PropsWithChildren) => {
  return <span data-slot="formfield-hint">{children}</span>;
};
FormFieldHint.displayName = "FormFieldHint";
