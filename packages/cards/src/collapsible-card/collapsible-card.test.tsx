import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";

import { CollapsibleCard } from "./collapsible-card";

import styles from "./collapsible-card.module.css";

const cardFor = (title: string) =>
  screen
    .getByRole("button", { name: title })
    .closest('[data-slot="card-container"]');

describe("CollapsibleCard", () => {
  it("starts closed, leaving the header and footer", () => {
    const { container } = render(
      <CollapsibleCard title="Details" footer="Footer content">
        Body content
      </CollapsibleCard>,
    );

    const trigger = screen.getByRole("button", { name: "Details" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Body content")).toBeNull();
    expect(screen.getByText("Footer content")).toBeVisible();
    expect(
      container.querySelector('[data-slot="card-inner-container"]'),
    ).toBeNull();
    expect(cardFor("Details")).toHaveAttribute("data-closed");
  });

  it("puts the chevron beside the title heading, in the title slot", () => {
    render(<CollapsibleCard title="Details">Body</CollapsibleCard>);

    const heading = screen.getByRole("heading", { name: "Details" });
    const trigger = screen.getByRole("button", { name: "Details" });
    const titleSlot = heading.closest('[data-slot="card-title"]');

    expect(heading.tagName).toBe("H3");
    expect(heading).not.toContainElement(trigger);
    expect(titleSlot).not.toBeNull();
    expect(titleSlot).toContainElement(trigger);
  });

  it("opens the body from the chevron and closes it again, keeping the footer", async () => {
    const user = userEvent.setup();
    render(
      <CollapsibleCard title="Details" footer="Footer content">
        Body content
      </CollapsibleCard>,
    );
    const trigger = screen.getByRole("button", { name: "Details" });

    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("data-panel-open");
    expect(screen.getByText("Body content")).toBeVisible();
    expect(screen.getByText("Footer content")).toBeVisible();
    expect(
      screen
        .getByText("Body content")
        .closest('[data-slot="card-inner-container"]'),
    ).toHaveAttribute("id", trigger.getAttribute("aria-controls"));
    expect(cardFor("Details")).toHaveAttribute("data-open");

    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Body content")).toBeNull();
    expect(screen.getByText("Footer content")).toBeVisible();
  });

  it("starts open with defaultOpen", () => {
    render(
      <CollapsibleCard title="Details" defaultOpen>
        Body content
      </CollapsibleCard>,
    );

    expect(screen.getByRole("button", { name: "Details" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByText("Body content")).toBeVisible();
  });

  it("follows a controlled open and reports toggles through onOpenChange", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <CollapsibleCard title="Details" open={false} onOpenChange={onOpenChange}>
        Body content
      </CollapsibleCard>,
    );

    await user.click(screen.getByRole("button", { name: "Details" }));

    expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything());
    expect(screen.queryByText("Body content")).toBeNull();

    rerender(
      <CollapsibleCard title="Details" open onOpenChange={onOpenChange}>
        Body content
      </CollapsibleCard>,
    );

    expect(screen.getByText("Body content")).toBeVisible();
  });

  it("hides rather than unmounts a keepMounted body, so its state survives", async () => {
    const user = userEvent.setup();
    render(
      <CollapsibleCard title="Details" keepMounted>
        <input aria-label="Name" />
      </CollapsibleCard>,
    );
    const trigger = screen.getByRole("button", { name: "Details" });
    const input = screen.getByLabelText("Name");
    const body = input.closest('[data-slot="card-inner-container"]');

    expect(body).toHaveAttribute("hidden");
    expect(body).toHaveClass(styles["collapsible-card-panel"]!);
    expect(input).not.toBeVisible();

    await user.click(trigger);
    await user.type(input, "Ada");
    await user.click(trigger);

    expect(body).toHaveAttribute("hidden");

    await user.click(trigger);

    expect(screen.getByLabelText("Name")).toBe(input);
    expect(input).toBeVisible();
    expect(input).toHaveValue("Ada");
  });

  it("gives the chevron the card's color", () => {
    render(
      <>
        <CollapsibleCard title="Tinted" color="red">
          Body
        </CollapsibleCard>
        <CollapsibleCard title="Default">Body</CollapsibleCard>
      </>,
    );

    expect(screen.getByRole("button", { name: "Tinted" })).toHaveClass(
      "palette-red",
    );
    expect(cardFor("Tinted")).toHaveClass("palette-red");
    expect(screen.getByRole("button", { name: "Default" })).not.toHaveClass(
      "palette-red",
    );
  });

  it("stretches the chevron over the header only with clickableHeader", () => {
    render(
      <>
        <CollapsibleCard title="Plain" action={<button>Edit</button>}>
          Body
        </CollapsibleCard>
        <CollapsibleCard
          title="Clickable"
          description="Supporting copy"
          action={<button>Edit</button>}
          HeaderProps={{ className: "header" }}
          clickableHeader
        >
          Body
        </CollapsibleCard>
      </>,
    );
    const headerFor = (title: string) =>
      screen
        .getByRole("button", { name: title })
        .closest<HTMLElement>('[data-slot="card-header"]')!;

    expect(headerFor("Plain")).not.toHaveClass(styles["clickable-header"]!);
    expect(headerFor("Clickable")).toHaveClass(
      styles["clickable-header"]!,
      "header",
    );
    expect(headerFor("Clickable")).not.toHaveAttribute("clickableHeader");
    // The header widens the chevron's hit area rather than becoming a
    // second trigger, so the chevron is still the only expandable button.
    expect(
      within(headerFor("Clickable"))
        .getAllByRole("button")
        .filter((button) => button.hasAttribute("aria-expanded")),
    ).toEqual([screen.getByRole("button", { name: "Clickable" })]);
  });

  it("disables the chevron and the action, and marks the card disabled", async () => {
    const user = userEvent.setup();
    render(
      <CollapsibleCard
        title="Details"
        action={<button>Edit</button>}
        ActionProps={{ className: "action" }}
        disabled
      >
        Body content
      </CollapsibleCard>,
    );
    const trigger = screen.getByRole("button", { name: "Details" });

    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-disabled", "true");
    expect(screen.queryByText("Body content")).toBeNull();
    expect(cardFor("Details")).toHaveAttribute("data-disabled");
    const action = screen
      .getByText("Edit")
      .closest('[data-slot="card-action"]');
    expect(action).toHaveAttribute("inert");
    expect(action).toHaveClass("action");
  });

  it("keeps Card's own props and slots", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <CollapsibleCard
        ref={ref}
        title="Details"
        description="Supporting copy"
        action={<button>Edit</button>}
        className="ours"
        defaultOpen
        TitleProps={{ className: "title" }}
        InnerContainerProps={{ className: "inner" }}
      >
        Body content
      </CollapsibleCard>,
    );

    expect(cardFor("Details")).toHaveClass("ours");
    expect(cardFor("Details")).not.toHaveAttribute("data-disabled");
    expect(ref.current).toBe(cardFor("Details"));
    expect(
      screen.getByText("Details").closest('[data-slot="card-title"]'),
    ).toHaveClass("title");
    expect(screen.getByText("Supporting copy")).toBeVisible();
    expect(screen.getByRole("button", { name: "Edit" })).toBeVisible();
    expect(
      screen.getByText("Edit").closest('[data-slot="card-action"]'),
    ).not.toHaveAttribute("inert");
    expect(
      screen
        .getByText("Body content")
        .closest('[data-slot="card-inner-container"]'),
    ).toHaveClass("inner");
  });
});
