import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Stack, Group } from "@uiid/layout";
import { Button } from "@uiid/buttons";

import { Input } from "../input/input";

import { Form, type FormProps } from "./form";

const meta = {
  title: "Forms/Form",
  component: Form,
  args: {},
} satisfies Meta<FormProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Form",
  tags: ["beta"],
  render: (args) => {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      setSuccess(false);

      const formData = new FormData(event.currentTarget);
      const url = formData.get("url") as string;
      console.log("URL value:", url);

      setLoading(true);
      const response = await submitForm(url);
      console.log("Response:", response);
      setLoading(false);

      if (response.error) {
        setErrors({ url: response.error });
        console.log("Setting errors:", { url: response.error });
      } else {
        setErrors({});
        setSuccess(true);
      }
    };

    return (
      <Form
        {...args}
        errors={errors}
        onSubmit={handleSubmit}
        render={<Stack render={<form />} ax="stretch" gap={4} />}
      >
        <Input
          label="URL"
          name="url"
          type="url"
          required
          placeholder="https://example.com"
          pattern="https?://.*"
        />

        <Group gap={2} fullwidth evenly>
          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
          <Button type="reset" variant="subtle">
            Reset
          </Button>
        </Group>

        {success && (
          <p style={{ color: "var(--color-positive)", margin: 0 }}>
            Form submitted successfully!
          </p>
        )}
      </Form>
    );
  },
};

export const WithOnFormSubmit: Story = {
  name: "With onFormSubmit",
  tags: ["beta"],
  render: (args) => {
    const [errors, setErrors] = useState<Record<string, string | string[]>>({});
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<Record<string, unknown> | null>(null);

    return (
      <Form
        {...args}
        render={<Stack render={<form />} ax="stretch" gap={4} />}
        errors={errors}
        onFormSubmit={async (formValues) => {
          console.log("onFormSubmit called with:", formValues);
          setLoading(true);
          setResult(null);

          // Simulate server validation
          await new Promise((resolve) => setTimeout(resolve, 500));

          const validationErrors: Record<string, string> = {};

          if (!formValues.email) {
            validationErrors.email = "Email is required";
          } else if (!formValues.email.includes("@")) {
            validationErrors.email = "Please enter a valid email";
          }

          if (!formValues.password) {
            validationErrors.password = "Password is required";
          } else if (String(formValues.password).length < 8) {
            validationErrors.password =
              "Password must be at least 8 characters";
          }

          setLoading(false);

          if (Object.keys(validationErrors).length > 0) {
            setErrors({
              email: validationErrors.email,
              password: validationErrors.password,
            });
            setErrors(validationErrors);
            console.log("Setting errors:", validationErrors);
          } else {
            setErrors({});
            setResult(formValues);
          }
        }}
      >
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>

        {result && (
          <pre
            style={{
              background: "var(--shade-muted)",
              padding: "1rem",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
              margin: 0,
            }}
          >
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </Form>
    );
  },
};

async function submitForm(value: string) {
  // Mimic a server response
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });

  try {
    const url = new URL(value);

    if (url.hostname.endsWith("example.com")) {
      return { error: "The example domain is not allowed" };
    }
  } catch {
    return { error: "This is not a valid URL" };
  }

  return { success: true };
}
