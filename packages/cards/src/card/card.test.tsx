import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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

  it("renders a composed title row on TitleProps.render's element", () => {
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

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveAttribute("data-slot", "card-title");
    expect(heading).toHaveAttribute("data-ui-ay", "center");
  });

  it("renders children in the body", () => {
    render(<Card title="Title">Body content</Card>);

    expect(screen.getByText("Body content")).toBeVisible();
  });

  /*
   * Slots mount on what React paints, not on truthiness: `0` is content, and
   * an empty list is not.
   */
  it("treats 0 as content and an empty list as nothing", () => {
    const { container } = render(
      <Card title={0} footer={[]}>
        {0}
      </Card>,
    );

    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("0");
    expect(
      container.querySelector('[data-slot="card-inner-container"]'),
    ).toHaveTextContent("0");
    expect(container.querySelector('[data-slot="card-footer"]')).toBeNull();
    expect(screen.queryByRole("separator")).toBeNull();
  });

  it("renders the footer slot", () => {
    render(<Card title="Title" footer={<span>Footer content</span>} />);

    expect(screen.getByText("Footer content")).toBeVisible();
  });

  it("merges ContainerProps' style and handlers with the root's", async () => {
    const onClick = vi.fn();
    const onContainerClick = vi.fn();
    const { container } = render(
      <Card
        title="Title"
        style={{ color: "red" }}
        onClick={onClick}
        ContainerProps={{ style: { opacity: 0.5 }, onClick: onContainerClick }}
      />,
    );
    const card = container.firstElementChild as HTMLElement;

    expect(card).toHaveStyle({ color: "red", opacity: "0.5" });
    await userEvent.click(card);
    expect(onClick).toHaveBeenCalledOnce();
    expect(onContainerClick).toHaveBeenCalledOnce();
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
