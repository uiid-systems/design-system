/**
 * Wraps an input so value writes made through the wrapper reach React.
 *
 * React tracks a controlled or uncontrolled input's last value by defining
 * `value` on the element itself. A write through that own property updates the
 * tracker too, so the `input` event that follows looks like no change and
 * `onChange` is skipped. Maskito rewrites what was typed (`1` becomes `$1`)
 * with exactly such a write. Routing `value` writes to the setter on the
 * element's prototype leaves the tracker behind, so React sees the rewritten
 * value and calls `onChange` with it. Every other member passes straight
 * through, with methods bound to the real element.
 *
 * This leans on how React tracks values, so `visible-to-react.test.tsx` checks
 * that premise directly and fails if a React upgrade changes it.
 */
export const visibleToReact = (element: HTMLInputElement): HTMLInputElement => {
  const setNativeValue = findValueSetter(Object.getPrototypeOf(element));

  return new Proxy(element, {
    get(target, key) {
      const member = Reflect.get(target, key, target);
      return typeof member === "function" ? member.bind(target) : member;
    },
    set(target, key, value) {
      if (key === "value") setNativeValue.call(target, value);
      else Reflect.set(target, key, value, target);
      return true;
    },
  });
};

/* Walks up from the element's own prototype rather than naming
   `HTMLInputElement.prototype`, so an element from another window or a
   subclass still finds its real setter. */
const findValueSetter = (
  prototype: object | null,
): ((value: string) => void) => {
  for (let proto = prototype; proto; proto = Object.getPrototypeOf(proto)) {
    const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
    if (setter) return setter;
  }
  throw new Error("visibleToReact: the element has no value setter.");
};
