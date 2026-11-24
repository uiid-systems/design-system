# Form

> The submission boundary. Collects field values by `name`, blocks submission while anything is invalid, and publishes server errors back onto the right fields.

Use Form when you want to:

- Receive submitted values keyed by field name through `onFormSubmit` — no `FormData` plumbing
- Push errors from a server response back onto individual fields with the `errors` map, keyed by the same `name`
- Set when every field validates with `validationMode` (`onSubmit`, `onBlur`, `onChange`) — a field's own `validationMode` still wins where it is set

`Form` renders a `<form>` that is `display: contents`, so it is a submission boundary rather than a layout box. Put a `Stack` or `Group` inside it to own the spacing.

Every control in the package reports its value the same way: a text input contributes its string, a select its value, a checkbox its checked state. An error lands in the field's description slot, replacing the description while it shows.

Form holds no submit state of its own. Keep the loading, errors and success state of a real submit in your app, pass the errors back through `errors`, and drive the submit button and any status message from that state.

Additional props are forwarded to the underlying Base UI [Form](https://base-ui.com/react/components/form).
