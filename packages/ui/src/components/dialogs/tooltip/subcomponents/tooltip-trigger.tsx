import { Tooltip as BaseTooltip } from "@base-ui-components/react/tooltip";
import { isValidElement, cloneElement } from "react";

export type TooltipTriggerProps = {
  trigger: React.ReactNode;
  TriggerProps?: BaseTooltip.Trigger.Props;
};

export const TooltipTrigger = ({
  trigger,
  TriggerProps,
}: TooltipTriggerProps) => {
  const isButton = isValidElement(trigger) && trigger.type === "button";

  if (isButton) {
    // Use render prop to avoid nested buttons
    return (
      <BaseTooltip.Trigger
        render={(props) => cloneElement(trigger, props)}
        {...TriggerProps}
      />
    );
  }

  if (isValidElement(trigger)) {
    // For non-button elements, add button role for accessibility
    return (
      <BaseTooltip.Trigger
        render={(props) =>
          cloneElement(trigger, {
            ...props,
            role: "button",
            tabIndex: 0,
          } as unknown as React.ReactElement<BaseTooltip.Trigger.Props>)
        }
        {...TriggerProps}
      />
    );
  }

  return <BaseTooltip.Trigger {...TriggerProps}>{trigger}</BaseTooltip.Trigger>;
};
