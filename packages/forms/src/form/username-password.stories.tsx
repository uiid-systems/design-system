import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Button } from "@uiid/buttons";
import { Group, Stack } from "@uiid/layout";

import { Input } from "../input/input";
import { Form, type FormProps } from "./form";
import { useFormState, type FormErrors } from "./hooks/use-form-state";
import type { FieldProps } from "../field/field.types";

const meta = {
  title: "Forms/Form/Username & Password",
  component: Form,
  parameters: { layout: "centered" },
} satisfies Meta<FormProps>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Form submission using `onSubmit` with native FormData.
 * This approach gives you full control over form data extraction.
 *
 * Note: We use a native `<form>` wrapper with `noValidate` for submission handling,
 * and Base UI Form inside for error context.
 */
export const WithOnSubmit: Story = {
  name: "With onSubmit",
  render: () => {
    const { errors, loading, setErrors, setLoading, reset } = useFormState();
    const [successMessage, setSuccessMessage] = useState(false);
    const [formKey, setFormKey] = useState(0);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      reset();
      setSuccessMessage(false);
      setLoading(true);

      const formData = new FormData(event.currentTarget);
      const username = formData.get("username") as string;
      const password = formData.get("password") as string;

      const response = await validateCredentials(username, password);

      setLoading(false);

      if (response.errors) {
        setErrors(response.errors);
      } else {
        setSuccessMessage(true);
      }
    };

    const handleReset = () => {
      reset();
      setSuccessMessage(false);
      setFormKey((k) => k + 1);
    };

    return (
      <Form key={formKey} onSubmit={handleSubmit} errors={errors}>
        <Fields />
        <Controls handleReset={handleReset} loading={loading} />
        {successMessage && <SuccessMessage />}
      </Form>
    );
  },
};

/**
 * Same form using parsed form values from FormData.
 */
export const WithFormData: Story = {
  name: "With FormData",
  render: () => {
    const { errors, loading, setErrors, setLoading, reset } = useFormState();
    const [successMessage, setSuccessMessage] = useState(false);
    const [formKey, setFormKey] = useState(0);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      reset();
      setSuccessMessage(false);
      setLoading(true);

      const formData = new FormData(event.currentTarget);
      const formValues = Object.fromEntries(formData);

      const response = await validateCredentials(
        formValues.username as string,
        formValues.password as string,
      );

      setLoading(false);

      if (response.errors) {
        setErrors(response.errors);
      } else {
        setSuccessMessage(true);
      }
    };

    const handleReset = () => {
      reset();
      setSuccessMessage(false);
      setFormKey((k) => k + 1);
    };

    return (
      <Form key={formKey} onSubmit={handleSubmit} errors={errors}>
        <Fields />
        <Controls handleReset={handleReset} loading={loading} />
        {successMessage && <SuccessMessage />}
      </Form>
    );
  },
};

/**
 * Error messages displayed as tooltip-styled floating elements.
 * No layout shift when errors appear.
 */
export const WithTooltipErrors: Story = {
  name: "With Tooltip Errors",
  render: () => {
    const { errors, loading, setErrors, setLoading, reset } = useFormState();
    const [formKey, setFormKey] = useState(0);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      reset();
      setLoading(true);

      const formData = new FormData(event.currentTarget);
      const username = formData.get("username") as string;
      const password = formData.get("password") as string;

      const response = await validateCredentials(username, password);

      setLoading(false);

      if (response.errors) {
        setErrors(response.errors);
      }
    };

    const handleReset = () => {
      reset();
      setFormKey((k) => k + 1);
    };

    return (
      <form
        key={formKey}
        onSubmit={handleSubmit}
        noValidate
        style={{ width: "320px" }}
      >
        <Form errors={errors} render={<Stack ax="stretch" gap={4} fullwidth />}>
          <Fields />
          <Controls handleReset={handleReset} loading={loading} />
        </Form>
      </form>
    );
  },
};

export const WithAbsoluteErrors: Story = {
  name: "With Absolute Errors",
  render: () => {
    const { errors, loading, setErrors, setLoading, reset } = useFormState();
    const [formKey, setFormKey] = useState(0);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      reset();
      setLoading(true);

      const formData = new FormData(event.currentTarget);
      const username = formData.get("username") as string;
      const password = formData.get("password") as string;

      const response = await validateCredentials(username, password);

      setLoading(false);

      if (response.errors) {
        setErrors(response.errors);
      }
    };

    const handleReset = () => {
      reset();
      setFormKey((k) => k + 1);
    };

    return (
      <form
        key={formKey}
        onSubmit={handleSubmit}
        noValidate
        style={{ width: "320px" }}
      >
        <Form errors={errors} render={<Stack ax="stretch" gap={4} fullwidth />}>
          <Fields />
          <Controls handleReset={handleReset} loading={loading} />
        </Form>
      </form>
    );
  },
};

const Controls = ({
  handleReset,
  loading,
}: {
  handleReset: () => void;
  loading: boolean;
}) => (
  <Group gap={2} ax="end" fullwidth mt={8}>
    <Button type="button" variant="ghost" onClick={handleReset}>
      Reset
    </Button>
    <Button type="submit" disabled={loading} loading={loading}>
      Sign Up
    </Button>
  </Group>
);

const Fields = ({ errorType = "inline" }: Pick<FieldProps, "errorType">) => (
  <Stack gap={2} ax="stretch" style={{ minWidth: "16rem" }}>
    <Input
      label="Username"
      name="username"
      placeholder="Enter username"
      required
      autoComplete="username"
      FieldProps={{ errorType }}
    />

    <Input
      label="Password"
      name="password"
      type="password"
      placeholder="••••••••"
      required
      autoComplete="new-password"
      FieldProps={{ errorType }}
    />
  </Stack>
);

const SuccessMessage = () => (
  <p
    style={{
      color: "var(--tone-positive)",
      margin: 0,
      textAlign: "center",
    }}
  >
    Account created successfully!
  </p>
);

/**
 * Simulates server-side validation for username/password
 */
async function validateCredentials(
  username: string,
  password: string,
): Promise<{ errors?: FormErrors; success?: boolean }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const errors: FormErrors = {};

  if (!username || username.length < 3) {
    errors.username = "Username must be at least 3 characters";
  }

  if (!password || password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  // Simulate "user exists" check
  if (username.toLowerCase() === "admin") {
    errors.username = "This username is already taken";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  return { success: true };
}
