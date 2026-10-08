import { render, screen } from "@testing-library/react";

import { Card } from "./card";
import { CARD_DEFAULT_COLOR } from "./card.constants";

describe("Card", () => {
  it("renders the title and description slots", () => {
    render(<Card title="Card title" description="Supporting copy" />);

    expect(screen.getByRole("heading", { name: "Card title" })).toBeVisible();
    expect(screen.getByText("Supporting copy")).toBeVisible();
  });

  it.each([
    ["a number", 42],
    ["mixed text", ["Invoices ", 3]],
  ])("keeps %s title a heading", (_, title) => {
    render(<Card title={title} />);

    expect(screen.getByRole("heading")).toHaveAttribute(
      "data-slot",
      "card-title",
    );
  });

  /*
   * An icon or badge beside the text is block content, which does not belong
   * inside a heading. A composed title lays its pieces out as a centred row.
   */
  it("renders a composed title as a row, not a heading", () => {
    render(
      <Card
        title={
          <>
            <svg data-testid="icon" />
            Billing
          </>
        }
      />,
    );

    const title = screen.getByTestId("icon").parentElement;
    expect(title).toHaveAttribute("data-slot", "card-title");
    expect(title?.tagName).toBe("DIV");
    expect(title).toHaveAttribute("data-ui-gap", "2");
    expect(title).toHaveAttribute("data-ui-ay", "center");
    expect(title).toHaveAttribute("data-ui-size", "1");
    expect(title).toHaveAttribute("data-ui-weight", "semibold");
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("lets TitleProps.render override the composed title row", () => {
    render(
      <Card
        title={
          <>
            <svg />
            Billing
          </>
        }
        TitleProps={{ render: <h2 /> }}
      />,
    );

    expect(screen.getByRole("heading", { level: 2 })).toHaveAttribute(
      "data-slot",
      "card-title",
    );
  });

  it("renders children in the body", () => {
    render(<Card title="Title">Body content</Card>);

    expect(screen.getByText("Body content")).toBeVisible();
  });

  it("renders the footer slot", () => {
    render(<Card title="Title" footer={<span>Footer content</span>} />);

    expect(screen.getByText("Footer content")).toBeVisible();
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
