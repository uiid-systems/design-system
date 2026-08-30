"use client";

import { Combobox as BasePopupLayer } from "@base-ui/react/combobox";
import type { Combobox as BasePopupLayerTypes } from "@base-ui/react/combobox";
import { Card } from "@uiid/cards";
import { List, ListItem } from "@uiid/lists";
import { Text } from "@uiid/typography";
import { cx } from "@uiid/utils";

import styles from "./popup-layer.module.css";

/**
 * The popup tree Combobox and Autocomplete both render: portal → positioner →
 * popup → list → item, plus the empty state.
 *
 * Base UI ships a single implementation for both. `Autocomplete.Popup` *is*
 * `Combobox.Popup` — the same object — and of the 21 parts the two namespaces
 * share, only `Root` and `Value` differ. Rendering them from one namespace here
 * is therefore not a shortcut; it is what upstream already does.
 * `popup-layer.test.tsx` asserts that identity so a future Base UI release that
 * forks the two fails loudly instead of silently drifting.
 *
 * This layer is deliberately neutral: neither Combobox nor Autocomplete owns
 * it, so neither component depends on its sibling. Each keeps its own public
 * wrappers, prop types, and `data-slot` values, and passes its slot name in.
 */

type WithSlot<T> = T & {
  /** The consuming component's `data-slot` value, e.g. `"combobox-popup"`. */
  slot: string;
};

export const PopupLayerPortal = ({
  slot,
  children,
  ...props
}: WithSlot<BasePopupLayerTypes.Portal.Props>) => {
  return (
    <BasePopupLayer.Portal data-slot={slot} {...props}>
      {children}
    </BasePopupLayer.Portal>
  );
};
PopupLayerPortal.displayName = "PopupLayerPortal";

export const PopupLayerPositioner = ({
  slot,
  className,
  sideOffset = 4,
  children,
  ...props
}: WithSlot<BasePopupLayerTypes.Positioner.Props>) => {
  return (
    <BasePopupLayer.Positioner
      data-slot={slot}
      className={cx(styles["popup-layer-positioner"], className)}
      sideOffset={sideOffset}
      {...props}
    >
      {children}
    </BasePopupLayer.Positioner>
  );
};
PopupLayerPositioner.displayName = "PopupLayerPositioner";

export const PopupLayerPopup = ({
  slot,
  className,
  children,
  ...props
}: WithSlot<BasePopupLayerTypes.Popup.Props>) => {
  return (
    <BasePopupLayer.Popup
      data-slot={slot}
      render={<Card p={2} gap={0} fullwidth />}
      className={cx(styles["popup-layer-popup"], className)}
      {...props}
    >
      {children}
    </BasePopupLayer.Popup>
  );
};
PopupLayerPopup.displayName = "PopupLayerPopup";

export const PopupLayerList = ({
  slot,
  children,
  ...props
}: WithSlot<BasePopupLayerTypes.List.Props>) => {
  return (
    <BasePopupLayer.List
      data-slot={slot}
      render={<List fullwidth />}
      {...props}
    >
      {children}
    </BasePopupLayer.List>
  );
};
PopupLayerList.displayName = "PopupLayerList";

export const PopupLayerItem = ({
  slot,
  value,
  className,
  children,
  ...props
}: WithSlot<BasePopupLayerTypes.Item.Props>) => {
  return (
    <BasePopupLayer.Item
      data-slot={slot}
      value={value}
      className={cx(styles["popup-layer-item"], className)}
      {...props}
      render={(renderProps) => (
        <ListItem
          render={<div />}
          fullwidth
          label={value as string}
          {...renderProps}
        />
      )}
    >
      {children}
    </BasePopupLayer.Item>
  );
};
PopupLayerItem.displayName = "PopupLayerItem";

export const PopupLayerEmpty = ({
  slot,
  className,
  children,
  ...props
}: WithSlot<BasePopupLayerTypes.Empty.Props>) => {
  return (
    <BasePopupLayer.Empty
      data-slot={slot}
      className={cx(styles["popup-layer-empty"], className)}
      {...props}
    >
      {children ?? <Text>No results found.</Text>}
    </BasePopupLayer.Empty>
  );
};
PopupLayerEmpty.displayName = "PopupLayerEmpty";
