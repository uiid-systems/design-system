# Form

> A form container with built-in error handling. Built on [Base UI Form](https://base-ui.com/react/components/form).

## Quick Reference

```tsx
import { Form, Input } from "@uiid/forms";
import { useFormState } from "@uiid/forms";

// Recommended pattern: native form + Form for error context
const { errors, setErrors } = useFormState();

<form onSubmit={handleSubmit} noValidate>
  <Form errors={errors}>
    <Input name="email" label="Email" />
    <button type="submit">Submit</button>
  </Form>
</form>
```

## Form Submission Pattern

For reliable form submission with custom validation, use a native `<form>` element for submission handling and the `Form` component for error context:

```tsx
import { Form, Input } from "@uiid/forms";
import { useFormState } from "@uiid/forms";
import { Stack } from "@uiid/layout";

const MyForm = () => {
  const { errors, loading, setErrors, setLoading, reset } = useFormState();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    reset();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;

    // Custom validation
    if (!email.includes("@")) {
      setErrors({ email: "Please enter a valid email" });
      setLoading(false);
      return;
    }

    // Submit to server...
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Form errors={errors} render={<Stack gap={4} />}>
        <Input name="email" label="Email" required />
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </Form>
    </form>
  );
};
```

**Why this pattern?**

- `noValidate` on the native form disables browser validation, allowing custom validation
- The `Form` component provides error context that `FieldError` components use to display errors
- The `useFormState` hook manages errors, loading, and success states

## useFormState Hook

The `useFormState` hook provides common form state management:

```tsx
import { useFormState } from "@uiid/forms";

const { errors, loading, success, result, setErrors, setLoading, reset } =
  useFormState();
```

| Return Value | Type | Description |
|--------------|------|-------------|
| `errors` | `Record<string, string \| string[]>` | Current error state |
| `loading` | `boolean` | Loading state |
| `success` | `boolean` | Success state |
| `result` | `T \| null` | Result data (generic) |
| `setErrors` | `(errors) => void` | Set error state |
| `setLoading` | `(loading) => void` | Set loading state |
| `reset` | `() => void` | Reset all state |

## Examples

### Basic Form with Validation

```tsx
const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const errors: Record<string, string> = {};

  if (!email.includes("@")) {
    errors.email = "Invalid email address";
  }
  if (password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (Object.keys(errors).length > 0) {
    setErrors(errors);
    return;
  }

  // Submit form...
};

<form onSubmit={handleSubmit} noValidate>
  <Form errors={errors}>
    <Input name="email" label="Email" type="email" required />
    <Input name="password" label="Password" type="password" required />
    <button type="submit">Sign In</button>
  </Form>
</form>
```

### With Select and Checkbox

```tsx
import { Form, Select, Checkbox, Input } from "@uiid/forms";
import { useFormState } from "@uiid/forms";

const { errors, loading, setErrors, setLoading, reset } = useFormState();

<form onSubmit={handleSubmit} noValidate>
  <Form errors={errors} render={<Stack gap={4} />}>
    <Select
      label="Country"
      name="country"
      items={countries}
      required
    />
    <Checkbox
      label="I agree to the terms"
      name="terms"
      required
    />
    <button type="submit">Submit</button>
  </Form>
</form>
```

### With Custom Layout

```tsx
import { Stack, Group } from "@uiid/layout";

<form onSubmit={handleSubmit} noValidate>
  <Form errors={errors} render={<Stack gap={4} />}>
    <Input name="email" label="Email" />
    <Group gap={2}>
      <button type="submit">Submit</button>
      <button type="reset">Reset</button>
    </Group>
  </Form>
</form>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `errors` | `Record<string, string \| string[]>` | — | Field errors to display |
| `render` | `ReactElement` | — | Custom render element for layout |
| `children` | `ReactNode` | — | Form contents |

> All other props are forwarded to the Base UI Form component.

## How Errors Work

The `errors` prop is an object where keys are field names:

```tsx
const errors = {
  email: "Invalid email address",
  password: "Password must be at least 8 characters",
};

<Form errors={errors}>
  <Input name="email" label="Email" />    {/* Shows error */}
  <Input name="password" label="Password" /> {/* Shows error */}
</Form>
```

Errors are automatically displayed by `FieldError` components inside `Field` wrappers that match the error keys.

## Data Slots

| Slot | Element |
|------|---------|
| `form` | The form element |

## Accessibility

- Built on Base UI Form which handles ARIA attributes
- Error messages are linked to fields via `aria-describedby`
- Invalid fields are marked with `aria-invalid`

## See Also

- [Field](../field/README.md) - Field wrapper with label and description
- [Input](../input/README.md) - Text input component
- [Base UI Form](https://base-ui.com/react/components/form) - Underlying primitive
