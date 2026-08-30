"use client";

import { Autocomplete as BaseAutocomplete } from "@base-ui/react/autocomplete";

import type { AutocompleteRootProps } from "../autocomplete.types";

export const AutocompleteRoot = <Value,>(
  props: AutocompleteRootProps<Value>,
) => {
  const { children, items, ...rest } = props;

  return (
    <BaseAutocomplete.Root
      data-slot="autocomplete-root"
      /**
       * Base UI overloads `Root` on `items`: a flat `Value[]` or a grouped
       * `Group<Value>[]`. `AutocompleteRootProps` is the union of both, so it
       * matches neither overload on its own. Base UI discriminates on the shape
       * at runtime, so selecting the flat overload here is safe. The cast is
       * scoped to `items`; it previously suppressed the whole element with
       * `@ts-expect-error`, which also hid any unrelated error on that line.
       */
      items={items as readonly Value[] | undefined}
      {...rest}
    >
      {children}
    </BaseAutocomplete.Root>
  );
};
AutocompleteRoot.displayName = "AutocompleteRoot";
