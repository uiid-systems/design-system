---
paths:
  - "packages/forms/**"
---

# Known Issues

## `@base-ui/react` — controlled `RadioGroup` causes a stack overflow

**Status:** open (upstream bug)

Passing `value` + `onValueChange` triggers infinite recursion in base-ui's `useStableCallback` trampoline. Uncontrolled usage (no `value` prop) works fine.

Two tests are skipped for this:

- `packages/forms/src/radio/radio.test.tsx` — "supports controlled value"
- `packages/forms/src/radio-group/radio-group.test.tsx` — "supports controlled value"

Do not "fix" these skips without first confirming the upstream bug is resolved.
