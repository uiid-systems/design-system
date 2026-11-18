type OpenChangeHandler<Details> = (
  open: boolean,
  eventDetails: Details,
) => void;

/**
 * Runs a Root's `onOpenChange` handlers in order with Base UI's own arguments,
 * and stops once one of them cancels the change. A wrapper passes
 * `RootProps.onOpenChange` first and its top-level `onOpenChange` second, so
 * both run instead of one replacing the other.
 */
export const composeOpenChange =
  <Details extends { readonly isCanceled: boolean }>(
    ...handlers: Array<OpenChangeHandler<Details> | undefined>
  ): OpenChangeHandler<Details> =>
  (open, eventDetails) => {
    for (const handler of handlers) {
      handler?.(open, eventDetails);
      if (eventDetails.isCanceled) return;
    }
  };
