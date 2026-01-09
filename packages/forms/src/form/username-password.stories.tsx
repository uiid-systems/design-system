import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Stack } from "@uiid/layout";
import { Button } from "@uiid/buttons";

import { Input } from "../input/input";
import { Form, type FormProps } from "./form";
import { useFormState, type FormErrors } from "./hooks/use-form-state";

const meta = {
  title: "Forms/Form/Username & Password",
  component: Form,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<FormProps>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Traditional form submission using `onSubmit` with native FormData.
 * This approach gives you full control over form data extraction.
 */
export const WithOnSubmit: Story = {
  name: "With onSubmit",
  render: () => {
    const { errors, loading, success, setErrors, setLoading, reset } =
      useFormState();
    const [successMessage, setSuccessMessage] = useState(false);

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
      } else {
        setSuccessMessage(true);
      }
    };

    return (
      <Form
        errors={errors}
        onSubmit={handleSubmit}
        render={<Stack render={<form />} ax="stretch" gap={4} fullwidth />}
        style={{ width: "320px" }}
      >
        <Input
          label="Username"
          name="username"
          placeholder="Enter username"
          required
          autoComplete="username"
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          autoComplete="new-password"
        />

        <Stack gap={2} ax="stretch">
          <Button type="submit" disabled={loading} loading={loading}>
            Sign Up
          </Button>
          <Button type="reset" ghost onClick={() => reset()}>
            Reset
          </Button>
        </Stack>

        {successMessage && (
          <p
            style={{
              color: "var(--tones-positive)",
              margin: 0,
              textAlign: "center",
            }}
          >
            Account created successfully!
          </p>
        )}
      </Form>
    );
  },
};

/**
 * Simplified form submission using `onFormSubmit` which provides
 * parsed form values directly. Less boilerplate for common use cases.
 */
export const WithOnFormSubmit: Story = {
  name: "With onFormSubmit",
  render: () => {
    const { errors, loading, success, setErrors, setLoading, reset } =
      useFormState();
    const [successMessage, setSuccessMessage] = useState(false);

    return (
      <Form
        errors={errors}
        render={<Stack render={<form />} ax="stretch" gap={4} fullwidth />}
        style={{ width: "320px" }}
        onFormSubmit={async (formValues) => {
          reset();
          setLoading(true);

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
        }}
      >
        <Input
          label="Username"
          name="username"
          placeholder="Enter username"
          required
          autoComplete="username"
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          autoComplete="new-password"
        />

        <Stack gap={2} ax="stretch">
          <Button type="submit" disabled={loading} loading={loading}>
            Sign Up
          </Button>
          <Button type="reset" ghost onClick={() => reset()}>
            Reset
          </Button>
        </Stack>

        {successMessage && (
          <p
            style={{
              color: "var(--tones-positive)",
              margin: 0,
              textAlign: "center",
            }}
          >
            Account created successfully!
          </p>
        )}
      </Form>
    );
  },
};

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
