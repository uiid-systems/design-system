import { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Switch } from "./switch";

describe("Switch", () => {
  it("renders a switch element", () => {
    render(<Switch />);
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  it("renders with data-slot attribute", () => {
    render(<Switch />);
    expect(screen.getByRole("switch")).toHaveAttribute(
      "data-slot",
      "switch-root",
    );
  });

  it("renders with a label after the switch by default", () => {
    render(<Switch label="Dark mode" />);
    const switchEl = screen.getByRole("switch");
    const label = screen.getByText("Dark mode");

    expect(label).toBeInTheDocument();
    // Label should come after switch in DOM order
    expect(switchEl.compareDocumentPosition(label)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("renders with a label before the switch when labelPosition is 'before'", () => {
    render(<Switch label="Dark mode" labelPosition="before" />);
    const switchEl = screen.getByRole("switch");
    const label = screen.getByText("Dark mode");

    expect(label).toBeInTheDocument();
    // Label should come before switch in DOM order
    expect(switchEl.compareDocumentPosition(label)).toBe(
      Node.DOCUMENT_POSITION_PRECEDING,
    );
  });

  it("can be toggled by clicking", async () => {
    const user = userEvent.setup();
    render(<Switch />);

    const switchEl = screen.getByRole("switch");
    expect(switchEl).not.toHaveAttribute("data-checked");

    await user.click(switchEl);
    expect(switchEl).toHaveAttribute("data-checked");

    await user.click(switchEl);
    expect(switchEl).not.toHaveAttribute("data-checked");
  });

  it("supports controlled checked state", async () => {
    const handleChange = vi.fn();

    const ControlledSwitch = () => {
      const [checked, setChecked] = useState(false);
      return (
        <Switch
          checked={checked}
          onCheckedChange={(value) => {
            setChecked(value);
            handleChange(value);
          }}
        />
      );
    };

    const user = userEvent.setup();
    render(<ControlledSwitch />);

    const switchEl = screen.getByRole("switch");
    expect(switchEl).not.toHaveAttribute("data-checked");

    await user.click(switchEl);
    expect(handleChange).toHaveBeenCalledWith(true);
    expect(switchEl).toHaveAttribute("data-checked");

    await user.click(switchEl);
    expect(handleChange).toHaveBeenCalledWith(false);
    expect(switchEl).not.toHaveAttribute("data-checked");
  });

  it("supports defaultChecked for uncontrolled usage", () => {
    render(<Switch defaultChecked />);
    expect(screen.getByRole("switch")).toHaveAttribute("data-checked");
  });

  it("can be disabled", () => {
    render(<Switch disabled />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-disabled", "true");
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    render(<Switch disabled />);

    const switchEl = screen.getByRole("switch");
    expect(switchEl).not.toHaveAttribute("data-checked");

    await user.click(switchEl);
    expect(switchEl).not.toHaveAttribute("data-checked");
  });

  it("renders label with correct htmlFor attribute when name prop is provided", () => {
    render(<Switch label="Notifications" name="notifications" />);
    const switchEl = screen.getByRole("switch");
    const label = screen.getByText("Notifications");

    expect(switchEl).toBeInTheDocument();
    expect(label).toHaveAttribute("for", "notifications");
  });

  it("passes RootProps to the switch root", () => {
    render(<Switch RootProps={{ "aria-label": "Custom label" }} />);
    expect(screen.getByRole("switch")).toHaveAttribute(
      "aria-label",
      "Custom label",
    );
  });
});
