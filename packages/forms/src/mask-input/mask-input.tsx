"use client";

import { Input } from "../input/input";
import type { MaskInputProps } from "./mask-input.types";

/**
 * `Input` with a required `mask`, named for the job so a masked field reads as
 * one at a glance. `<MaskInput mask={phoneMask} />` and
 * `<Input mask={phoneMask} />` are the same thing.
 */
export const MaskInput = (props: MaskInputProps) => <Input {...props} />;
MaskInput.displayName = "MaskInput";
