# MaskInput

> A text input that formats values according to predefined or custom mask patterns. Supports phone numbers, dates, credit cards, currency, and more.

## Quick Reference

```tsx
import { MaskInput } from "@uiid/forms";

// Predefined masks
<MaskInput mask="phone" />
<MaskInput mask="ssn" />
<MaskInput mask="date" />
<MaskInput mask="creditCard" />
<MaskInput mask="currency" locale="en-US" currency="USD" />

// With validation
<MaskInput
  mask="phone"
  onValidate={(isValid, unmaskedValue) => setError(!isValid)}
  validationMode="onBlur"
/>

// Controlled
<MaskInput
  mask="phone"
  value={value}
  onValueChange={(masked, unmasked) => setValue(masked)}
/>

// Custom mask pattern
<MaskInput
  mask={{
    pattern: "##-##-##",
    transform: (value) => value.replace(/\D/g, ""),
    validate: (value) => value.length === 6,
  }}
/>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `mask` | `MaskPatternKey \| MaskPattern` | — | Predefined mask key or custom pattern |
| `value` | `string` | — | Controlled value |
| `defaultValue` | `string` | — | Initial value for uncontrolled usage |
| `onValueChange` | `(masked: string, unmasked: string) => void` | — | Callback with both masked and unmasked values |
| `onValidate` | `(isValid: boolean, unmasked: string) => void` | — | Validation callback |
| `validationMode` | `"onChange" \| "onBlur" \| "onSubmit" \| "onTouched" \| "all"` | `"onChange"` | When validation triggers |
| `currency` | `string` | `"USD"` | Currency code for currency mask |
| `locale` | `string` | `"en-US"` | Locale for formatting |
| `maskPlaceholder` | `string` | — | Placeholder shown when focused |
| `withoutMask` | `boolean` | `false` | Disable masking |
| `invalid` | `boolean` | `false` | Invalid state |
| `disabled` | `boolean` | `false` | Disabled state |
| `readOnly` | `boolean` | `false` | Read-only state |
| `size` | `"small" \| "medium" \| "large"` | `"medium"` | Input size |
| `fullwidth` | `boolean` | `false` | Full width input |
| `label` | `string` | — | Field label |
| `description` | `string` | — | Field description |

> `MaskPatternKey` = `"phone" | "ssn" | "date" | "time" | "creditCard" | "creditCardExpiry" | "zipCode" | "zipCodeExtended" | "currency" | "percentage" | "licensePlate" | "ipv4" | "macAddress" | "isbn" | "ein"`

## Predefined Masks

| Mask | Pattern | Example Output |
| --- | --- | --- |
| `phone` | `(###) ###-####` | `(555) 123-4567` |
| `ssn` | `###-##-####` | `123-45-6789` |
| `date` | `##/##/####` | `12/25/2024` |
| `time` | `##:##` | `14:30` |
| `creditCard` | `#### #### #### ####` | `4111 1111 1111 1111` |
| `creditCardExpiry` | `##/##` | `12/25` |
| `zipCode` | `#####` | `12345` |
| `zipCodeExtended` | `#####-####` | `12345-6789` |
| `currency` | `$###,###.##` | `$1,234.56` |
| `percentage` | `##.##%` | `75.50%` |
| `licensePlate` | `###-###` | `ABC-123` |
| `ipv4` | `###.###.###.###` | `192.168.1.1` |
| `macAddress` | `##:##:##:##:##:##` | `AA:BB:CC:DD:EE:FF` |
| `isbn` | `###-#-###-#####-#` | `978-0-123-45678-9` |
| `ein` | `##-#######` | `12-3456789` |

## Hooks

The masking logic is available as composable hooks for custom implementations:

```tsx
import { useMask, useMaskPattern, useMaskValue, useMaskValidation } from "@uiid/forms";

// Main hook - provides everything needed
function CustomPhoneInput() {
  const { inputRef, inputProps } = useMask({
    mask: "phone",
    onValueChange: (masked, unmasked) => console.log(unmasked),
  });

  return <input ref={inputRef} {...inputProps} className="my-input" />;
}

// Individual hooks for advanced composition
function AdvancedInput() {
  const { maskPattern, transformOpts } = useMaskPattern({ mask: "currency" });
  const { displayValue } = useMaskValue({ maskPattern, transformOpts, ... });
  // ...
}
```

| Hook | Description |
| --- | --- |
| `useMask` | Main hook, composes all others, returns `inputRef` + `inputProps` |
| `useMaskPattern` | Resolves mask key to pattern, calculates inputMode/maxLength |
| `useMaskValue` | Manages controlled/uncontrolled value, computes displayValue |
| `useMaskValidation` | Handles touched state and validation logic |
| `useMaskHandlers` | All event handlers (change, keydown, paste, focus, blur) |

## Individual Pattern Imports

Patterns are tree-shakeable. Import only what you need:

```tsx
import { phonePattern, creditCardPattern } from "@uiid/forms";

// Or import the full map
import { MASK_PATTERNS } from "@uiid/forms";
```

## Custom Mask Pattern

Create custom masks by providing a `MaskPattern` object:

```tsx
interface MaskPattern {
  pattern: string;
  transform?: (value: string, opts?: TransformOptions) => string;
  validate?: (value: string, opts?: ValidateOptions) => boolean;
}

<MaskInput
  mask={{
    pattern: "AA-####",
    transform: (value) => value.replace(/[^A-Z0-9]/gi, "").toUpperCase(),
    validate: (value) => /^[A-Z]{2}\d{4}$/.test(value),
  }}
/>
```

## Data Slots

| Slot | Element |
| --- | --- |
| `mask-input` | Input element |

## Accessibility

- Automatically sets appropriate `inputMode` based on mask type (`numeric`, `decimal`, or `text`)
- Supports `aria-invalid` for validation states
- Label and description integration via Field component
- Full keyboard support including proper cursor positioning

## See Also

- [Input](../input/README.md) - Base input component
- [Field](../field/README.md) - Form field wrapper with label/description
