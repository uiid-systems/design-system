import { Group, Stack, type GroupProps } from "@uiid/layout";

import styles from "../field.module.css";

type FieldRowsRenderOptions = {
  orientation?: "horizontal" | "vertical";
  fullwidth?: boolean;
  gap?: GroupProps["gap"];
};

/**
 * The layout a checkbox or radio group root renders its `FieldRow`s into,
 * passed to the group's `render`. Kept out of the subcomponents barrel: it is
 * a fragment of the two group roots, not a part of its own.
 *
 * `fullwidth` stretches the root. A vertical group's rows stretch across it at
 * any width, as a Stack's do by default; a horizontal one shares the width
 * evenly between its rows. The horizontal half cannot use `Group`'s `evenly` —
 * see `.field-rows-evenly`. A `bordered` frame belongs to the row, so it
 * follows the row out to the edge.
 */
export const fieldRowsRender = ({
  orientation,
  fullwidth,
  gap,
}: FieldRowsRenderOptions) =>
  orientation === "horizontal" ? (
    <Group
      gap={gap}
      fullwidth={fullwidth}
      className={fullwidth ? styles["field-rows-evenly"] : undefined}
    />
  ) : (
    <Stack gap={gap} fullwidth={fullwidth} />
  );
