import { maskitoMask } from "../maskito-mask";

/* A group is 0 to 255 with no leading zero. Every start of a group is itself a
   group, so the same pattern serves while it is being typed. */
const GROUP = "(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)";

/**
 * An IPv4 address, `192.168.0.1`. Its groups are one to three digits long, so
 * no template expresses it: the field takes digits and up to three dots, and
 * refuses a group past 255, a leading zero and an empty group. A dot is typed,
 * not written by the mask. The value keeps its dots, so `parse` returns the
 * address as shown.
 */
export const ipv4Mask = /* @__PURE__ */ maskitoMask(
  { mask: new RegExp(`^(?:${GROUP}(?:\\.${GROUP}){0,2}(?:\\.${GROUP}?)?)?$`) },
  { inputMode: "decimal" },
);

const COMPLETE = new RegExp(`^${GROUP}(?:\\.${GROUP}){3}$`);

/** Whether an address has all four groups, each from 0 to 255. */
export const isValidIpv4 = (value: string) => COMPLETE.test(value);
