# Form

> The submission boundary. Collects field values by `name`, blocks submission while anything is invalid, and publishes server errors back onto the right fields.

Use Form when you want to:

- Receive submitted values keyed by field name through `onFormSubmit` — no `FormData` plumbing
- Push errors from a server response back onto individual fields with the `errors` map, keyed by the same `name`
- Set when every field validates with `validationMode` (`onSubmit`, `onBlur`, `onChange`) — a field's own `validationMode` still wins where it is set

`Form` renders a `<form>` that is `display: contents`, so it is a submission boundary rather than a layout box. Put a `Stack` or `Group` inside it to own the spacing.

Every control in the package reports its value the same way: a text input contributes its string, a select its value, a checkbox its checked state. Errors land through whichever `errorType` the field is using.

`useFormState` and `useFormSubmit` are exported alongside it for the loading/errors/success cycle a real submit handler needs — `useFormSubmit` wraps an async submit function and drives that state for you.

Additional props are forwarded to the underlying Base UI [Form](https://base-ui.com/react/components/form).
