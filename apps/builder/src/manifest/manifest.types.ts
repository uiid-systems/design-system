/**
 * The subset of react-docgen-typescript's `PropItem` the inspector reads.
 *
 * `type.value` holds each union member as TypeScript literal source text
 * (`"sans"`, `3`, `true`), exactly as docgen emits it, so `JSON.parse` on a
 * member yields the runtime value. `defaultValue.value` is the unquoted
 * default, also as docgen emits it.
 */
export type PropItem = {
  name: string;
  required: boolean;
  description: string;
  defaultValue: { value: string } | null;
  type: { name: string; raw?: string; value?: { value: string }[] };
};

/** The subset of react-docgen-typescript's `ComponentDoc` the builder reads. */
export type ComponentDoc = {
  displayName: string;
  description: string;
  props: Record<string, PropItem>;
};

export type PropValue = string | number | boolean;

/** Builder-only data, kept apart from the docgen half so a generator can replace that wholesale. */
export type BuilderMeta = {
  /** Whether canvas nodes can be dropped inside */
  container: boolean;
  /** Props applied when the node is created from the palette */
  defaults: Record<string, PropValue>;
};
