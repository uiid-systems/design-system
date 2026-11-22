/** The digits of `value` with everything else dropped, masked or not. */
export const digitsOf = (value: string) => value.replace(/\D/g, "");

/** Whether `value` holds exactly `count` digits once everything else is dropped. */
export const hasDigits = (value: string, count: number) =>
  digitsOf(value).length === count;
