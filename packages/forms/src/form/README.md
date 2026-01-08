# Form

> A form container with built-in error handling. Built on [Base UI Form](https://base-ui.com/react/components/form).

## Quick Reference

```tsx
import { Form, Input } from "@uiid/forms";

// Basic form
<Form onSubmit={handleSubmit}>
  <Input name="email" label="Email" />
  <button type="submit">Submit</button>
</Form>

// With error handling
<Form errors={{ email: "Invalid email" }} onSubmit={handleSubmit}>
  <Input name="email" label="Email" />
  <button type="submit">Submit</button>
</Form>
```

## Examples

### Basic Form

```tsx
const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  console.log(Object.fromEntries(formData));
};

<Form onSubmit={handleSubmit}>
  <Input name="email" label="Email" type="email" required />
  <Input name="password" label="Password" type="password" required />
  <button type="submit">Sign In</button>
</Form>
```

### With Error Handling

```tsx
const [errors, setErrors] = useState<Record<string, string>>({});

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const email = formData.get("email") as string;

  if (!email.includes("@")) {
    setErrors({ email: "Please enter a valid email" });
    return;
  }

  setErrors({});
  // Submit form...
};

<Form errors={errors} onSubmit={handleSubmit}>
  <Input name="email" label="Email" />
  <button type="submit">Submit</button>
</Form>
```

### With onFormSubmit Helper

The `onFormSubmit` prop provides parsed form values directly:

```tsx
<Form
  onFormSubmit={async (formValues) => {
    console.log(formValues); // { email: "...", password: "..." }

    if (!formValues.email) {
      setErrors({ email: "Email is required" });
      return;
    }

    // Submit form...
  }}
>
  <Input name="email" label="Email" />
  <Input name="password" label="Password" type="password" />
  <button type="submit">Submit</button>
</Form>
```

### With Custom Layout

```tsx
import { Stack, Group } from "@uiid/layout";

<Form render={<Stack render={<form />} gap={4} />}>
  <Input name="email" label="Email" />
  <Group gap={2}>
    <button type="submit">Submit</button>
    <button type="reset">Reset</button>
  </Group>
</Form>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `errors` | `Record<string, string \| string[]>` | — | Field errors to display |
| `onSubmit` | `(event: FormEvent) => void` | — | Native form submit handler |
| `onFormSubmit` | `(values: Record<string, unknown>) => void` | — | Handler with parsed form values |
| `render` | `ReactElement` | — | Custom render element |
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

Errors are automatically displayed by Field components that match the error keys.

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
