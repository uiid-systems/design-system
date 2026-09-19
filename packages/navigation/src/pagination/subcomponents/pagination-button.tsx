import { Button, type ButtonProps } from "@uiid/buttons";

type PaginationButtonProps = ButtonProps & {
  active?: boolean;
};

export const PaginationButton = ({
  active,
  ...props
}: PaginationButtonProps) => {
  return (
    <Button variant={active ? undefined : "subtle"} size="small" {...props} />
  );
};
PaginationButton.displayName = "PaginationButton";
