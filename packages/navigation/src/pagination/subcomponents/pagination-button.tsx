import { Button, type ButtonProps } from "@uiid/buttons";

import { opensElsewhere } from "../pagination.utils";

type PaginationButtonProps = ButtonProps & {
  active?: boolean;
};

export const PaginationButton = ({
  active,
  render,
  onClick,
  ...props
}: PaginationButtonProps) => {
  /*
   * `renderWithProps` chains the link's own `onClick` after this one, so this
   * only has to decide whether the page changes: a click that opens the link
   * elsewhere leaves this tab where it is.
   */
  const handleLinkClick: ButtonProps["onClick"] = (event) => {
    if (!opensElsewhere(event)) onClick?.(event);
  };

  /*
   * Cells sit on the panel's own surface, so they stay transparent until
   * hovered; only the current page takes the filled treatment. A `subtle` fill
   * here would paint a second surface on top of the panel's, which is what
   * made the row read as loose buttons.
   */
  return (
    <Button
      variant={active ? undefined : "ghost"}
      size="small"
      render={render}
      onClick={render ? handleLinkClick : onClick}
      {...props}
    />
  );
};
PaginationButton.displayName = "PaginationButton";
