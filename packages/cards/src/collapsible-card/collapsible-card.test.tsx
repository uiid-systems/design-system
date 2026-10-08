import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";

import { CollapsibleCard } from "./collapsible-card";

const cardFor = (title: string) =>
  screen
    .getByRole("button", { name: title })
    .closest('[data-slot="card-container"]');

describe("CollapsibleCard", () => {
  it("starts closed, leaving only the header", () => {
    const { container } = render(
      <CollapsibleCard title="Details" footer="Footer content">
        Body content
      </CollapsibleCard>,
    );

    const trigger = screen.getByRole("button", { name: "Details" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Body content")).toBeNull();
    expect(screen.queryByText("Footer content")).toBeNull();
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

  it("opens the body and footer from the chevron, and closes them again", async () => {
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
    expect(screen.queryByText("Footer content")).toBeNull();
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

  it("keeps a disabled chevron focusable but inert", async () => {
    const user = userEvent.setup();
    render(
      <CollapsibleCard title="Details" disabled>
        Body content
      </CollapsibleCard>,
    );
    const trigger = screen.getByRole("button", { name: "Details" });

    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-disabled", "true");
    expect(screen.queryByText("Body content")).toBeNull();
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
    expect(ref.current).toBe(cardFor("Details"));
    expect(
      screen.getByText("Details").closest('[data-slot="card-title"]'),
    ).toHaveClass("title");
    expect(screen.getByText("Supporting copy")).toBeVisible();
    expect(screen.getByRole("button", { name: "Edit" })).toBeVisible();
    expect(
      screen
        .getByText("Body content")
        .closest('[data-slot="card-inner-container"]'),
    ).toHaveClass("inner");
  });
});
