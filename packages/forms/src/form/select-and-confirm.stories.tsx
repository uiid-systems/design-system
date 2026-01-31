import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Stack } from "@uiid/layout";
import { Button } from "@uiid/buttons";

import { Select } from "../select/select";
import { Checkbox } from "../checkbox/checkbox";
import { MOCK_SELECT_ITEMS } from "../select/select.mocks";
import { Form, type FormProps } from "./form";
import { useFormState, type FormErrors } from "./hooks/use-form-state";

const meta = {
  title: "Forms/Form/Select & Confirm",
  component: Form,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<FormProps>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Form submission using `onSubmit` with native FormData.
 * Validates that a font is selected and the terms are confirmed.
 *
 * Note: We use a native `<form>` wrapper with `noValidate` for submission handling,
 * and Base UI Form inside for error context. This pattern works around Base UI Form's
 * submission handling limitations.
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
      const font = formData.get("font") as string;
      const confirmed = formData.get("confirmed") === "on";

      const response = await validateSelection(font, confirmed);

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
      setFormKey((k) => k + 1); // Force re-mount to reset uncontrolled components
    };

    return (
      <form
        key={formKey}
        onSubmit={handleSubmit}
        noValidate
        style={{ width: "320px" }}
      >
        <Form errors={errors} render={<Stack ax="stretch" gap={4} fullwidth />}>
          <Select
            label="Font Family"
            name="font"
            items={MOCK_SELECT_ITEMS}
            required
          />

          <Checkbox label="I confirm my selection" name="confirmed" required />

          <Stack gap={2} ax="stretch">
            <Button type="submit" disabled={loading} loading={loading}>
              Save Preferences
            </Button>
            <Button type="button" ghost onClick={handleReset}>
              Reset
            </Button>
          </Stack>

          {successMessage && (
            <p
              style={{
                color: "var(--tone-positive)",
                margin: 0,
                textAlign: "center",
              }}
            >
              Preferences saved!
            </p>
          )}
        </Form>
      </form>
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

      const response = await validateSelection(
        formValues.font as string,
        formValues.confirmed === "on",
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
      <form
        key={formKey}
        onSubmit={handleSubmit}
        noValidate
        style={{ width: "320px" }}
      >
        <Form errors={errors} render={<Stack ax="stretch" gap={4} fullwidth />}>
          <Select
            label="Font Family"
            name="font"
            items={MOCK_SELECT_ITEMS}
            required
          />

          <Checkbox label="I confirm my selection" name="confirmed" required />

          <Stack gap={2} ax="stretch">
            <Button type="submit" disabled={loading} loading={loading}>
              Save Preferences
            </Button>
            <Button type="button" ghost onClick={handleReset}>
              Reset
            </Button>
          </Stack>

          {successMessage && (
            <p
              style={{
                color: "var(--tone-positive)",
                margin: 0,
                textAlign: "center",
              }}
            >
              Preferences saved!
            </p>
          )}
        </Form>
      </form>
    );
  },
};

/**
 * Simulates server-side validation for font selection and confirmation
 */
async function validateSelection(
  font: string,
  confirmed: boolean,
): Promise<{ errors?: FormErrors; success?: boolean }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  const errors: FormErrors = {};

  if (!font || font === "") {
    errors.font = "Please select a font";
  }

  if (!confirmed) {
    errors.confirmed = "You must confirm your selection";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  return { success: true };
}
