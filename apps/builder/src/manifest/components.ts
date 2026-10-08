import { Button, Card, Group, Input, Stack, Text } from "@uiid/design-system";

import type { ManifestKey } from "./manifest";

/**
 * The real component for each manifest key. Typed loosely on purpose: the
 * canvas spreads a node's untyped `props` record onto whichever component the
 * node names, and the manifest, not TypeScript, is what constrains those props.
 */
// oxlint-disable-next-line no-explicit-any
export const components: Record<ManifestKey, React.ComponentType<any>> = {
  Stack,
  Group,
  Card,
  Text,
  Button,
  Input,
};
