import { Field, type FieldProps, Input } from "@uiid/forms";
import { Group } from "@uiid/layout";
import { Button } from "@uiid/buttons";
import { SendIcon } from "@uiid/icons";

export type NewsletterSignupFormProps = FieldProps;
export const NewsletterSignupForm = () => {
  return (
    <Field label="Join the newsletter" fullwidth my={4}>
      <Group gap={2} fullwidth>
        <Input required placeholder="Enter your email" fullwidth />
        <Button
          style={{ marginLeft: "auto" }}
          square
          size="medium"
          tooltip="Submit your email"
        >
          <SendIcon />
        </Button>
      </Group>
    </Field>
  );
};
NewsletterSignupForm.displayName = "NewsletterSignupForm";
