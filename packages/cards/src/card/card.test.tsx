import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PALETTE_HUES, paletteColorStyles } from "@uiid/tokens";

import { Card } from "./card";
import { CARD_DEFAULT_COLOR } from "./card.constants";

import styles from "./card.module.css";

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

  it("builds a header for a description of 0 on its own", () => {
    const { container } = render(<Card description={0} />);

    expect(container.querySelector('[data-slot="card-header"]')).not.toBeNull();
    expect(
      container.querySelector('[data-slot="card-description"]'),
    ).toHaveTextContent("0");
  });

  it("keeps a 0 passed through a slot override", () => {
    const { container } = render(
      <Card title="Title" DescriptionProps={{ children: 0 }} />,
    );

    expect(
      container.querySelector('[data-slot="card-description"]'),
    ).toHaveTextContent("0");
  });

  it("lets a slot override's children replace the slot prop", () => {
    const { container } = render(
      <Card
        title="Title"
        description="From the prop"
        DescriptionProps={{ children: "From the override" }}
      />,
    );

    expect(
      container.querySelector('[data-slot="card-description"]'),
    ).toHaveTextContent(/^From the override$/);
  });

  it("collapses a slot holding a spent short-circuit or an empty string", () => {
    const { container } = render(
      <Card title="Title" description={false} action="" />,
    );

    expect(
      container.querySelector('[data-slot="card-description"]'),
    ).toBeNull();
    expect(container.querySelector('[data-slot="card-action"]')).toBeNull();
  });

  it("collapses a slot holding a list with nothing renderable in it", () => {
    const show = false as boolean;
    const { container } = render(
      <Card
        title="Title"
        action={[]}
        description={[show && <span key="a" />]}
      />,
    );

    expect(container.querySelector('[data-slot="card-action"]')).toBeNull();
    expect(
      container.querySelector('[data-slot="card-description"]'),
    ).toBeNull();
  });

  it("fills a slot from a list holding one renderable entry", () => {
    const show = false as boolean;
    const { container } = render(
      <Card
        title="Title"
        footer={[
          show && <span key="a">Skipped</span>,
          <span key="b">Kept</span>,
        ]}
      />,
    );

    expect(
      container.querySelector('[data-slot="card-footer"]'),
    ).toHaveTextContent(/^Kept$/);
  });

  it("grows its body with the card, unless InnerContainerProps opts out", () => {
    const body = (el: HTMLElement) =>
      el.querySelector('[data-slot="card-inner-container"]');

    const { container, rerender } = render(
      <Card grow title="Title">
        Body
      </Card>,
    );
    expect(container.firstElementChild).toHaveAttribute("data-ui-grow", "");
    expect(body(container)).toHaveAttribute("data-ui-grow", "");

    rerender(
      <Card grow title="Title" InnerContainerProps={{ grow: false }}>
        Body
      </Card>,
    );
    expect(body(container)).not.toHaveAttribute("data-ui-grow");
  });

  it("renders the footer slot", () => {
    render(<Card title="Title" footer={<span>Footer content</span>} />);

    expect(screen.getByText("Footer content")).toBeVisible();
  });

  it("leaves out the footer divider unless FooterProps turns it on", () => {
    const { rerender } = render(<Card title="Title" footer="Footer" />);
    expect(screen.queryByRole("separator")).toBeNull();

    rerender(
      <Card
        title="Title"
        footer="Footer"
        FooterProps={{ hideSeparator: false }}
      />,
    );
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("renders flat by default and adds the shadow for shadow", () => {
    const { container, rerender } = render(<Card title="Title" />);
    const card = () => container.firstElementChild;

    expect(card()).not.toHaveClass(styles.shadow);
    expect(card()).not.toHaveAttribute("shadow");

    rerender(<Card title="Title" shadow />);
    expect(card()).toHaveClass(styles.shadow);
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

  // Driven off the palette itself, so a new hue is covered automatically.
  it.each(PALETTE_HUES)("applies the palette surface for color=%s", (color) => {
    const { container } = render(<Card title="Title" color={color} />);

    expect(container.firstElementChild).toHaveClass(paletteColorStyles[color]);
  });

  describe('variant="shell"', () => {
    it("defaults to a full-width, p={6} / gap={6} page area", () => {
      const { container } = render(
        <Card variant="shell" title="Overview">
          <div>One</div>
          <div>Two</div>
        </Card>,
      );
      const root = container.firstElementChild;

      expect(root).toHaveAttribute("data-variant", "shell");
      expect(root).toHaveAttribute("data-ui-w", "full");
      expect(root).toHaveAttribute("data-ui-p", "6");
      expect(root).toHaveAttribute("data-ui-gap", "6");
      expect(
        container.querySelector('[data-slot="card-inner-container"]'),
      ).toHaveAttribute("data-ui-gap", "6");
    });

    it("lets p, gap, w and the body gap override the defaults", () => {
      const { container } = render(
        <Card
          variant="shell"
          p={2}
          gap={3}
          w={480}
          InnerContainerProps={{ gap: 1 }}
        >
          Body
        </Card>,
      );
      const root = container.firstElementChild;

      expect(root).toHaveAttribute("data-ui-p", "2");
      expect(root).toHaveAttribute("data-ui-gap", "3");
      expect(root).toHaveAttribute("data-ui-w", "480");
      expect(
        container.querySelector('[data-slot="card-inner-container"]'),
      ).toHaveAttribute("data-ui-gap", "1");
    });

    it("renders a plain-text title as an <h2> page heading", () => {
      render(<Card variant="shell" title="Overview" />);
      const title = screen.getByRole("heading", { level: 2, name: "Overview" });

      expect(title).toHaveAttribute("data-ui-size", "4");
      expect(title).toHaveAttribute("data-ui-weight", "medium");
    });

    it("lets TitleProps override the heading level and ramp", () => {
      render(
        <Card
          variant="shell"
          title="Overview"
          TitleProps={{ render: <h1 />, size: 3 }}
        />,
      );
      const title = screen.getByRole("heading", { level: 1 });

      expect(title).toHaveAttribute("data-ui-size", "3");
      expect(title).toHaveAttribute("data-ui-weight", "medium");
    });

    it("keeps a composed title a row", () => {
      render(
        <Card
          variant="shell"
          title={
            <>
              <svg />
              Overview
            </>
          }
        />,
      );

      expect(screen.queryByRole("heading")).toBeNull();
    });

    it("stays transparent until color is set", () => {
      const { container, rerender } = render(
        <Card variant="shell" title="Overview" />,
      );
      expect(container.firstElementChild?.className).not.toMatch(/palette-/);

      rerender(<Card variant="shell" title="Overview" color="blue" />);
      expect(container.firstElementChild).toHaveClass("palette-blue");
    });
  });
});
