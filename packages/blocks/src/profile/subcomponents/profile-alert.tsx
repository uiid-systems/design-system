import { Alert } from "@uiid/indicators";
import { MailIcon } from "@uiid/icons";
import { Button } from "@uiid/buttons";

export const ProfileAlert = () => {
  return (
    <Alert
      data-slot="profile-alert"
      icon={MailIcon}
      title="Please verify your email address."
      action={
        <Button variant="inverted" size="xsmall">
          Verify email
        </Button>
      }
      tone="positive"
    />
  );
};
ProfileAlert.displayName = "ProfileAlert";
