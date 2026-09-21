import { isValidElement } from "react";

export type TriggerChildren<State> =
  | React.ReactNode
  | ((state: State) => React.ReactNode);

/**
 * Props for a Base UI trigger part whose children are the trigger. Pair with
 * `resolveTrigger`, which turns those children into the part's `render`.
 */
export type WithTriggerChildren<Props, State> = Omit<Props, "children"> & {
  /**
   * An element is used as the trigger itself. A string, or a function of the
   * trigger's state, is content: it renders inside a focusable
   * `role="button"` span, and a function re-renders as the state changes.
   * With your own `render`, children are its content, as in Base UI, so
   * pass a node rather than a function.
   */
  children?: TriggerChildren<State>;
};

type ResolvedTrigger<State> = {
  nativeButton?: boolean;
  render?:
    | React.ReactElement
    | ((
        props: React.ComponentPropsWithRef<"span">,
        state: State,
      ) => React.ReactElement);
  children?: React.ReactNode;
};

/**
 * The `nativeButton` and `render` a Base UI trigger part needs for the given
 * children. Spread it before the caller's props, so an explicit
 * `nativeButton` still wins.
 *
 * The trigger travels only through `render`, never as the part's children:
 * Base UI falls back to the part's children when the render element has none,
 * so a childless element trigger would otherwise render inside itself.
 *
 * Pass the caller's own `render`, if any, and this steps aside: the children
 * go to the part as content for that element, and `nativeButton` is left to
 * the caller, exactly as Base UI takes them.
 */
export const resolveTrigger = <State,>(
  children: TriggerChildren<State>,
  render?: unknown,
): ResolvedTrigger<State> => {
  if (render) {
    return { children: children as React.ReactNode };
  }

  if (typeof children === "function") {
    return {
      nativeButton: false,
      render: (props, state) => <span {...props}>{children(state)}</span>,
    };
  }

  if (isValidElement(children)) {
    /*
     * Base UI has to be told up front whether the trigger is a real <button>,
     * and errors when told wrong in either direction. An intrinsic element
     * says so by its tag. A component can't be inspected before it renders,
     * so it is taken to be a button (`Button`, the common case); pass
     * `nativeButton={false}` for one that isn't, like `Text`.
     */
    return {
      nativeButton:
        typeof children.type !== "string" || children.type === "button",
      render: children,
    };
  }

  return {
    nativeButton: false,
    render: (
      <span role="button" tabIndex={0}>
        {children}
      </span>
    ),
  };
};
