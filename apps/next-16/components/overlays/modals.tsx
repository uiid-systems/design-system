import { Modal } from "@uiid/overlays";
import { Button } from "@uiid/buttons";
import { Ellipsis } from "@uiid/icons";

export const Modals = () => {
  return (
    <Modal
      trigger={<Button icon={<Ellipsis />} aria-label="Open Modal" />}
      title="Modal Title"
    >
      <p>Modal Content</p>
    </Modal>
  );
};
