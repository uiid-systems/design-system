"use client";

import { Card } from "@uiid/cards";
import { Button } from "@uiid/buttons";

export const CardPreview = () => {
  return (
    <Card
      style={{ maxWidth: 320 }}
      title="Card Title"
      description="This is a card with title, description, and footer sections."
      footer={<Button size="small">Action</Button>}
    />
  );
};
CardPreview.displayName = "CardPreview";
