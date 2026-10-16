/** An object's own keys, typed as its keys rather than `string[]`. */
export const keysOf = <T extends object>(object: T) =>
  Object.keys(object) as (keyof T)[];
