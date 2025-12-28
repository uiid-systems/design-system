import { Button, type ButtonProps } from "@uiid/buttons";

type PaginationButtonProps = ButtonProps & {
  active?: boolean;
};

export const PaginationButton = ({
  active,
  ...props
}: PaginationButtonProps) => {
  return (
    <Button
      tooltip={props["aria-label"]}
      variant={active ? undefined : "subtle"}
      size="small"
      square
      {...props}
    />
  );
};
PaginationButton.displayName = "PaginationButton";
