"use client";

import { Button } from "@uiid/buttons";
import { Group, Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { useState } from "react";

import { Checkbox } from "../checkbox/checkbox";
import type { FieldErrorType } from "../field/field.types";
import { Input } from "../input/input";
import { Select } from "../select/select";
import { MOCK_SELECT_ITEMS } from "../select/select.mocks";
import { Form } from "./form";
import { useFormSubmit, type FormErrors } from "./hooks";

type FormValues = Record<string, unknown>;

const FORM_WIDTH = 320;

/**
 * Every example here runs the same round trip: submit, wait, then either
 * publish server errors or show a success message, remounting on reset so the
 * uncontrolled controls clear. Only `validate` differs between them, so that is
 * the only thing an example passes in.
 */
const useSubmission = (validate: (values: FormValues) => FormErrors) => {
  const [succeeded, setSucceeded] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const { errors, loading, handleSubmit, reset } = useFormSubmit({
    onSuccess: () => setSucceeded(true),
  });

  return {
    formKey,
    errors,
    loading,
    succeeded,
    onFormSubmit: (values: FormValues) => {
      setSucceeded(false);
      return handleSubmit(async () => {
        const nextErrors = validate(values);
        return Object.keys(nextErrors).length > 0
          ? { errors: nextErrors }
          : { result: values };
      });
    },
    onReset: () => {
      reset();
      setSucceeded(false);
      setFormKey((current) => current + 1);
    },
  };
};

const validateCredentials = (values: FormValues): FormErrors => {
  const username = String(values.username ?? "");
  const password = String(values.password ?? "");
  const errors: FormErrors = {};

  if (username.length < 3) errors.username = "Use at least 3 characters";
  if (username.toLowerCase() === "admin")
    errors.username = "That username is taken";
  if (password.length < 8) errors.password = "Use at least 8 characters";

  return errors;
};

const validateSelection = (values: FormValues): FormErrors => {
  const errors: FormErrors = {};

  if (!values.font) errors.font = "Pick a typeface";
  if (!values.confirmed)
    errors.confirmed = "Confirm your selection to continue";

  return errors;
};

const Credentials = ({ errorType }: { errorType?: FieldErrorType }) => (
  <>
    <Input
      label="Username"
      name="username"
      placeholder="Enter a username"
      autoComplete="username"
      required
      FieldProps={{ errorType }}
    />
    <Input
      label="Password"
      name="password"
      type="password"
      placeholder="••••••••"
      autoComplete="new-password"
      required
      FieldProps={{ errorType }}
    />
  </>
);

const Actions = ({
  loading,
  onReset,
  submitLabel,
}: {
  loading: boolean;
  onReset: () => void;
  submitLabel: string;
}) => (
  <Group gap={2} ax="end" fullwidth mt={4}>
    <Button type="button" variant="ghost" onClick={onReset}>
      Reset
    </Button>
    <Button type="submit" loading={loading} disabled={loading}>
      {submitLabel}
    </Button>
  </Group>
);

/*
 * `Form` renders a `<form>` that is `display: contents`, so it is a submission
 * boundary rather than a layout box — the Stack inside owns the spacing.
 */
export const Default = () => (
  <Form>
    <Stack gap={4} ax="stretch" w={FORM_WIDTH}>
      <Input
        label="Email"
        name="email"
        placeholder="you@example.com"
        required
      />
      <Button type="submit">Subscribe</Button>
    </Stack>
  </Form>
);

/*
 * `onFormSubmit` hands over the values keyed by field name and blocks
 * submission while any field is invalid, so there is no FormData plumbing.
 * `errors` is how a server response gets back onto the right fields.
 */
export const UsernamePassword = () => {
  const { formKey, errors, loading, succeeded, onFormSubmit, onReset } =
    useSubmission(validateCredentials);

  return (
    <Form key={formKey} errors={errors} onFormSubmit={onFormSubmit}>
      <Stack gap={4} ax="stretch" w={FORM_WIDTH}>
        <Credentials />
        <Actions loading={loading} onReset={onReset} submitLabel="Sign up" />
        {succeeded && (
          <Text size={-1} color="green">
            Account created.
          </Text>
        )}
      </Stack>
    </Form>
  );
};

/* Errors surfaced beside each label, so nothing below the control moves. */
export const TooltipErrors = () => {
  const { formKey, errors, loading, onFormSubmit, onReset } =
    useSubmission(validateCredentials);

  return (
    <Form key={formKey} errors={errors} onFormSubmit={onFormSubmit}>
      <Stack gap={4} ax="stretch" w={FORM_WIDTH}>
        <Credentials errorType="tooltip" />
        <Actions loading={loading} onReset={onReset} submitLabel="Sign up" />
      </Stack>
    </Form>
  );
};

/* Errors floated out of flow, which also keeps the layout from shifting. */
export const AbsoluteErrors = () => {
  const { formKey, errors, loading, onFormSubmit, onReset } =
    useSubmission(validateCredentials);

  return (
    <Form key={formKey} errors={errors} onFormSubmit={onFormSubmit}>
      <Stack gap={8} ax="stretch" w={FORM_WIDTH}>
        <Credentials errorType="absolute" />
        <Actions loading={loading} onReset={onReset} submitLabel="Sign up" />
      </Stack>
    </Form>
  );
};

/* Controls that are not text inputs report their values the same way: a select
 * contributes its value, a checkbox its checked state. */
export const SelectAndConfirm = () => {
  const { formKey, errors, loading, succeeded, onFormSubmit, onReset } =
    useSubmission(validateSelection);

  return (
    <Form key={formKey} errors={errors} onFormSubmit={onFormSubmit}>
      <Stack gap={4} ax="stretch" w={FORM_WIDTH}>
        <Select
          label="Typeface"
          name="font"
          placeholder="Select a typeface"
          items={MOCK_SELECT_ITEMS}
          required
        />
        <Checkbox label="I confirm my selection" name="confirmed" />
        <Actions
          loading={loading}
          onReset={onReset}
          submitLabel="Save preferences"
        />
        {succeeded && (
          <Text size={-1} color="green">
            Preferences saved.
          </Text>
        )}
      </Stack>
    </Form>
  );
};

/*
 * `validationMode` sets when every field in the form validates. A field's own
 * `validationMode` still wins where it is set.
 */
export const ValidationMode = () => (
  <Group gap={8} ay="start">
    <Form validationMode="onSubmit">
      <Stack gap={4} ax="stretch" w={220}>
        <Input label="On submit" name="a" type="email" required />
        <Button type="submit" size="small">
          Submit
        </Button>
      </Stack>
    </Form>
    <Form validationMode="onBlur">
      <Stack gap={4} ax="stretch" w={220}>
        <Input label="On blur" name="b" type="email" required />
        <Button type="submit" size="small">
          Submit
        </Button>
      </Stack>
    </Form>
    <Form validationMode="onChange">
      <Stack gap={4} ax="stretch" w={220}>
        <Input label="On change" name="c" type="email" required />
        <Button type="submit" size="small">
          Submit
        </Button>
      </Stack>
    </Form>
  </Group>
);
