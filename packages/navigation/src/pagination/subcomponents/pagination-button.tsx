import { Button, type ButtonProps } from "@uiid/buttons";
import { isValidElement } from "react";

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
   * Button clones `render` with its own props, which would overwrite the
   * link's `onClick`, so run that first and then change page — unless the
   * click opens the link elsewhere, in which case this tab stays put.
   */
  const handleLinkClick: ButtonProps["onClick"] = (event) => {
    if (isValidElement<Pick<ButtonProps, "onClick">>(render)) {
      render.props.onClick?.(event);
    }
    if (!opensElsewhere(event)) onClick?.(event);
  };

  return (
    <Button
      variant={active ? undefined : "subtle"}
      size="small"
      render={render}
      onClick={render ? handleLinkClick : onClick}
      {...props}
    />
  );
};
PaginationButton.displayName = "PaginationButton";
