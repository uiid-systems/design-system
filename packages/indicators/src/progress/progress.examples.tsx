"use client";

import { Stack } from "@uiid/layout";
import { PALETTE_HUES } from "@uiid/tokens";
import { useEffect, useState } from "react";

import { Progress } from "./progress";
import type { ProgressVariants } from "./progress.types";
import {
  ProgressRoot,
  ProgressHeader,
  ProgressLabel,
  ProgressValue,
  ProgressTrack,
  ProgressIndicator,
} from "./subcomponents";

type Size = NonNullable<ProgressVariants["size"]>;

const SIZES: Size[] = ["xsmall", "small", "medium", "large"];

export const Default = () => <Progress value={40} aria-label="Upload" />;

export const WithLabel = () => <Progress value={40} label="Uploading files" />;

/* The tier sets the track's thickness; the label row keeps its type size. */
export const Sizes = () => (
  <Stack gap={4} ax="stretch" fullwidth>
    {SIZES.map((size) => (
      <Progress key={size} size={size} label={size} value={40} />
    ))}
  </Stack>
);

/* The hue fills the indicator; the track stays neutral. */
export const Colors = () => (
  <Stack gap={4} ax="stretch" fullwidth>
    {PALETTE_HUES.map((color) => (
      <Progress key={color} color={color} label={color} value={40} />
    ))}
  </Stack>
);

/*
 * A null value means the work has started but its size is unknown. The
 * indicator sweeps the track, and holds still as a dimmed full bar when the
 * user prefers reduced motion.
 */
export const Indeterminate = () => (
  <Progress value={null} label="Checking for new blunders" />
);

/* The readout goes; assistive tech still hears the value. */
export const HideValue = () => (
  <Stack gap={4} ax="stretch" fullwidth>
    <Progress value={60} label="Syncing" hideValue />
    <Progress value={60} size="xsmall" hideValue aria-label="Syncing" />
  </Stack>
);

export const MinMax = () => (
  <Progress value={3} min={0} max={5} label="Categories" />
);

/* `format` takes `Intl.NumberFormat` options, applied to the raw value. */
export const Format = () => (
  <Progress
    value={3.2}
    max={8}
    label="Downloaded"
    format={{ style: "unit", unit: "gigabyte", maximumFractionDigits: 1 }}
  />
);

/*
 * A render function on `ValueProps.children` replaces the readout. Pair it with
 * `getAriaValueText` so screen readers hear the same thing.
 */
export const CustomValue = () => (
  <Progress
    value={3}
    max={5}
    label="Syncing categories"
    ValueProps={{ children: (_, value) => `${value} of 5` }}
    getAriaValueText={(_, value) => `${value} of 5 categories`}
  />
);

/*
 * The shape of a real long-running task: indeterminate while it works out how
 * much there is to do, then determinate as each step lands.
 */
export const Live = () => {
  const [value, setValue] = useState<number | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setValue((current) => {
        if (current === null) return 0;
        if (current >= 100) return null;
        return current + 20;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <Progress
      value={value}
      label={value === null ? "Checking…" : "Syncing"}
      color="blue"
    />
  );
};

/* The parts compose without the monolith, for layouts it does not cover. */
export const Composed = () => (
  <ProgressRoot value={70} gap={1}>
    <ProgressTrack>
      <ProgressIndicator />
    </ProgressTrack>
    <ProgressHeader>
      <ProgressLabel>Storage</ProgressLabel>
      <ProgressValue>{(_, value) => `${value} GB of 100 GB`}</ProgressValue>
    </ProgressHeader>
  </ProgressRoot>
);
