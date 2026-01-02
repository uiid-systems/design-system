import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Stack, Group } from "@uiid/layout";
import { Button } from "@uiid/buttons";

import { Input } from "../input/input";
import { Select } from "../select/select";
import { NumberField } from "../number-field/number-field";

import { MOCK_SELECT_ITEMS } from "../select/select.mocks";

import { Field } from "../field/field";

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
  render: (args) => {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSuccess(false);

      const formData = new FormData(event.currentTarget);
      const url = formData.get("url") as string;

      setLoading(true);
      const response = await submitForm(url);
      setLoading(false);

      if (response.error) {
        setErrors({ url: response.error });
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
        render={<Stack ax="stretch" gap={8} style={{ maxWidth: 400 }} />}
      >
        <Field name="url" label="Homepage URL">
          <Input
            name="url"
            type="url"
            required
            defaultValue="https://example.com"
            placeholder="https://example.com"
            pattern="https?://.*"
          />
        </Field>

        <Field name="category" label="Category">
          <Select name="category" items={MOCK_SELECT_ITEMS} required />
        </Field>

        <Field name="quantity" label="Quantity">
          <NumberField name="quantity" required defaultValue={1} />
        </Field>

        <Group gap={4}>
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
  render: (args) => {
    const [errors, setErrors] = useState<Record<string, string | string[]>>({});
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<Record<string, unknown> | null>(null);

    return (
      <Form
        {...args}
        errors={errors}
        onFormSubmit={async (formValues) => {
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
            setErrors(validationErrors);
          } else {
            setErrors({});
            setResult(formValues);
          }
        }}
        render={<Stack ax="stretch" gap={8} style={{ maxWidth: 400 }} />}
      >
        <Input
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
        />

        <Input
          name="password"
          label="Password"
          type="password"
          placeholder="••••••••"
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>

        {result && (
          <pre
            style={{
              background: "var(--color-surface-secondary)",
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
