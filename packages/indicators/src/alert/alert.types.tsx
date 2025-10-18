import type { CardProps } from "@uiid/cards";

export type AlertProps = Omit<CardProps, "onSubmit" | "onCancel">;
