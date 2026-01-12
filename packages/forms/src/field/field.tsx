import type { FieldProps } from "./field.types";

import {
  FieldRoot,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "./subcomponents";

export const Field = ({
  name,
  label,
  my,
  mx,
  mt,
  mb,
  ml,
  mr,
  p,
  py,
  px,
  pt,
  pb,
  pl,
  pr,
  gap,
  description,
  required,
  fullwidth,
  RootProps,
  LabelProps,
  ErrorProps,
  DescriptionProps,
  children,
  ...props
}: FieldProps) => {
  return (
    <FieldRoot
      name={name}
      fullwidth={fullwidth}
      my={my}
      mx={mx}
      mt={mt}
      mb={mb}
      ml={ml}
      mr={mr}
      p={p}
      py={py}
      px={px}
      pt={pt}
      pb={pb}
      pl={pl}
      pr={pr}
      gap={gap}
      {...RootProps}
      {...props}
    >
      {label && (
        <FieldLabel required={required} {...LabelProps}>
          {label}
        </FieldLabel>
      )}

      {children}

      <FieldError {...ErrorProps} />

      {description && (
        <FieldDescription {...DescriptionProps}>{description}</FieldDescription>
      )}
    </FieldRoot>
  );
};
Field.displayName = "Field";
