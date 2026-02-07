import { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Accordion } from "./accordion";
import {
  AccordionRoot,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionPanel,
} from "./subcomponents";

const sampleItems = [
  { value: "item-1", trigger: "First", content: "First content" },
  { value: "item-2", trigger: "Second", content: "Second content" },
  { value: "item-3", trigger: "Third", content: "Third content" },
];

describe("Accordion", () => {
  // ============================================
  // RENDERING
  // ============================================

  it("renders the component", () => {
    render(<Accordion items={sampleItems} />);
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
    expect(screen.getByText("Third")).toBeInTheDocument();
  });

  it("renders with data-slot attributes", () => {
    render(<Accordion items={sampleItems} />);
    expect(screen.getByRole("button", { name: "First" })).toHaveAttribute(
      "data-slot",
      "accordion-trigger",
    );
  });

  it("applies custom className to root", () => {
    render(
      <Accordion items={sampleItems} RootProps={{ className: "custom-class" }} />,
    );
    expect(document.querySelector(".custom-class")).toBeInTheDocument();
  });

  // ============================================
  // INTERACTIONS
  // ============================================

  it("expands panel on click", async () => {
    const user = userEvent.setup();
    render(<Accordion items={sampleItems} />);

    const trigger = screen.getByRole("button", { name: "First" });
    await user.click(trigger);

    expect(trigger).toHaveAttribute("data-panel-open");
  });

  it("supports keyboard interaction", async () => {
    const user = userEvent.setup();
    render(<Accordion items={sampleItems} />);

    const trigger = screen.getByRole("button", { name: "First" });
    trigger.focus();
    await user.keyboard("{Enter}");

    expect(trigger).toHaveAttribute("data-panel-open");
  });

  it("navigates between triggers with arrow keys", async () => {
    const user = userEvent.setup();
    render(<Accordion items={sampleItems} />);

    const firstTrigger = screen.getByRole("button", { name: "First" });
    const secondTrigger = screen.getByRole("button", { name: "Second" });

    firstTrigger.focus();
    await user.keyboard("{ArrowDown}");

    expect(secondTrigger).toHaveFocus();
  });

  // ============================================
  // CONTROLLED/UNCONTROLLED STATE
  // ============================================

  it("supports uncontrolled state with defaultValue", async () => {
    render(<Accordion items={sampleItems} defaultValue={["item-1"]} />);

    const trigger = screen.getByRole("button", { name: "First" });
    expect(trigger).toHaveAttribute("data-panel-open");
  });

  it("supports controlled state", async () => {
    const handleChange = vi.fn();

    const ControlledAccordion = () => {
      const [value, setValue] = useState<string[]>([]);
      return (
        <Accordion
          items={sampleItems}
          value={value}
          onValueChange={(newValue) => {
            setValue(newValue);
            handleChange(newValue);
          }}
        />
      );
    };

    const user = userEvent.setup();
    render(<ControlledAccordion />);

    await user.click(screen.getByRole("button", { name: "First" }));
    expect(handleChange).toHaveBeenCalledWith(["item-1"]);
  });

  // ============================================
  // DISABLED STATE
  // ============================================

  it("can be disabled", () => {
    render(<Accordion items={sampleItems} disabled />);

    const trigger = screen.getByRole("button", { name: "First" });
    expect(trigger).toHaveAttribute("data-disabled");
  });

  it("supports disabled individual items", () => {
    const itemsWithDisabled = [
      ...sampleItems.slice(0, 2),
      { value: "item-3", trigger: "Third", content: "Third content", disabled: true },
    ];
    render(<Accordion items={itemsWithDisabled} />);

    const disabledTrigger = screen.getByRole("button", { name: "Third" });
    expect(disabledTrigger).toHaveAttribute("data-disabled");
  });

  // ============================================
  // SUBCOMPONENTS
  // ============================================

  it("renders composed subcomponents", async () => {
    const user = userEvent.setup();
    render(
      <AccordionRoot>
        <AccordionItem value="test">
          <AccordionHeader>
            <AccordionTrigger>Test Trigger</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>Test Content</AccordionPanel>
        </AccordionItem>
      </AccordionRoot>,
    );

    expect(screen.getByRole("button", { name: "Test Trigger" })).toBeInTheDocument();

    // Panel content is rendered after opening
    await user.click(screen.getByRole("button", { name: "Test Trigger" }));
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("expands composed accordion on click", async () => {
    const user = userEvent.setup();
    render(
      <AccordionRoot>
        <AccordionItem value="test">
          <AccordionHeader>
            <AccordionTrigger>Test Trigger</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>Test Content</AccordionPanel>
        </AccordionItem>
      </AccordionRoot>,
    );

    const trigger = screen.getByRole("button", { name: "Test Trigger" });
    await user.click(trigger);

    expect(trigger).toHaveAttribute("data-panel-open");
  });
});
