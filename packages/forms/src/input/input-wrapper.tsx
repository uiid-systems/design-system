import type { ReactNode } from "react";

import { Group } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { InputVariants } from "./input.types";
import { inputVariants } from "./input.variants";
import styles from "./input.module.css";

type InputWrapperProps = {
	before?: ReactNode;
	after?: ReactNode;
	className?: string;
	children: ReactNode;
} & InputVariants;

export const InputWrapper = ({
	before,
	after,
	size,
	fullwidth,
	ghost,
	className,
	children,
}: InputWrapperProps) => {
	if (!before && !after) return <>{children}</>;

	return (
		<Group
			data-slot="input-wrapper"
			ay="center"
			className={cx(
				styles["input"],
				styles["input-wrapper"],
				inputVariants({ size, fullwidth, ghost }),
				className,
			)}
		>
			{before && (
				<span data-slot="input-before" className={styles["input-slot"]}>
					{before}
				</span>
			)}
			{children}
			{after && (
				<span data-slot="input-after" className={styles["input-slot"]}>
					{after}
				</span>
			)}
		</Group>
	);
};
InputWrapper.displayName = "InputWrapper";
