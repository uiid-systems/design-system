"use client";

import { Card } from "@uiid/cards";
import { X } from "@uiid/icons";

export function CardWithHeaderAction() {
  return (
    <Card
      title="A card with a header action"
      action={{
        icon: <X />,
        "aria-label": "Card action",
        onClick: () => alert("Card action clicked"),
      }}
    >
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quaerat nulla
      voluptatum odio corporis quidem exercitationem nesciunt eaque officia,
      aspernatur asperiores!
    </Card>
  );
}
