import { maskitoMask } from "../maskito-mask";

/**
 * An IPv4 address, `192.168.0.1`. Its groups are one to three digits long, so
 * no template expresses it: the field takes groups of one to three digits and
 * up to three dots, and refuses an empty group. A dot is typed, not written by
 * the mask. The value keeps its dots, so `parse` returns the address as shown.
 *
 * The field does not judge a group's value. A group past 255 or with a leading
 * zero stays as typed or pasted, so `001` is never quietly read as `0`;
 * `isValidIpv4` is what rejects it. Like every mask, it drops what it cannot
 * take, so a fourth digit in a group is cut off.
 */
export const ipv4Mask = /* @__PURE__ */ maskitoMask(
  { mask: /^(?:\d{1,3}(?:\.\d{1,3}){0,2}(?:\.\d{0,3})?)?$/ },
  { inputMode: "decimal" },
);

const GROUP = "(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)";
const COMPLETE = new RegExp(`^${GROUP}(?:\\.${GROUP}){3}$`);

/**
 * Whether an address has all four groups, each from 0 to 255 with no leading
 * zero. Stricter than the old `MaskInput` pattern, which passed a partial
 * address and leading zeros.
 */
export const isValidIpv4 = (value: string) => COMPLETE.test(value);
