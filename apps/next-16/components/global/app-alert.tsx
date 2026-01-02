import { Alert } from "@uiid/indicators";

export const AppAlert = () => {
  return (
    <Alert
      variant="inverted"
      title="Will this project ever be finished? Tune in next year to find out!"
      size="small"
      className="m-3 mb-0"
    />
  );
};
AppAlert.displayName = "AppAlert";
