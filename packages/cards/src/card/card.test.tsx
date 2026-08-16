import { render, screen } from "@testing-library/react";
import { GlobeIcon } from "@uiid/icons/globe";

import { Card } from "./card";
import { CARD_DEFAULT_COLOR } from "./card.constants";

describe("Card", () => {
  it("renders the title and description slots", () => {
    render(<Card title="Card title" description="Supporting copy" />);

    expect(screen.getByRole("heading", { name: "Card title" })).toBeVisible();
    expect(screen.getByText("Supporting copy")).toBeVisible();
  });

  it("renders children in the body", () => {
    render(<Card title="Title">Body content</Card>);

    expect(screen.getByText("Body content")).toBeVisible();
  });

  it("renders the footer slot", () => {
    render(<Card title="Title" footer={<span>Footer content</span>} />);

    expect(screen.getByText("Footer content")).toBeVisible();
  });

  it("renders a passed icon component", () => {
    render(<Card icon={GlobeIcon} title="Title" />);

    expect(document.querySelector("svg")).toBeInTheDocument();
  });

  /*
   * The surface is always a palette hue, so a Card with no `color` still
   * carries the class the --palette-* names hang off. Without it the card
   * renders with no background at all.
   */
  it("applies the default palette hue when no color is passed", () => {
    const { container } = render(<Card title="Title" />);

    expect(container.firstElementChild).toHaveClass(
      `palette-${CARD_DEFAULT_COLOR}`,
    );
  });

  it("applies an explicit palette hue", () => {
    const { container } = render(<Card title="Title" color="blue" />);

    expect(container.firstElementChild).toHaveClass("palette-blue");
  });
});
