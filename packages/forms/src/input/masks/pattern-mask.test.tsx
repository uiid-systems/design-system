import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Input } from "../input";
import { patternMask } from "./pattern-mask";

// Masks are built once, at module scope, as `Input` expects.
const pairs = patternMask("##-##-##");
const code = patternMask("AA-###", { slots: { A: /[A-Z]/ }, uppercase: true });
const phone = patternMask("(###) ###-####", { inputMode: "tel" });

describe("patternMask", () => {
  it("fills the template from the start", () => {
    expect(pairs.format("123456")).toBe("12-34-56");
    expect(phone.format("1234567890")).toBe("(123) 456-7890");
  });

  it("writes a literal only once a character follows it", () => {
    expect(pairs.format("12")).toBe("12");
    expect(pairs.format("123")).toBe("12-3");
    expect(phone.format("1")).toBe("(1");
    expect(phone.format("123")).toBe("(123");
    expect(phone.format("1234")).toBe("(123) 4");
  });

  it("formats an empty value as an empty field", () => {
    expect(pairs.format("")).toBe("");
    expect(phone.format("")).toBe("");
  });

  it("drops characters no slot takes and cuts off past the template", () => {
    expect(pairs.format("1a2b3c")).toBe("12-3");
    expect(pairs.format("12345678")).toBe("12-34-56");
  });

  it("takes text that is already masked", () => {
    expect(phone.format("(555) 123-4567")).toBe("(555) 123-4567");
  });

  it("parses to the characters typed, without the literals", () => {
    expect(pairs.parse("12-34-56")).toBe("123456");
    expect(phone.parse("(123) 4")).toBe("1234");
    expect(phone.parse("")).toBe("");
  });

  it("parses text that was never masked", () => {
    expect(phone.parse("1234567890")).toBe("1234567890");
  });

  it("round-trips format and parse", () => {
    for (const raw of ["", "1", "123", "1234", "1234567890"]) {
      expect(phone.parse(phone.format(raw))).toBe(raw);
    }
    for (const masked of ["", "(1", "(123) 4", "(123) 456-7890"]) {
      expect(phone.format(phone.parse(masked))).toBe(masked);
    }
  });

  it("takes extra slot characters beside #", () => {
    expect(code.format("AB123")).toBe("AB-123");
    expect(code.format("1AB")).toBe("AB");
    expect(code.parse("AB-123")).toBe("AB123");
  });

  it("uppercases what it is given when asked", () => {
    expect(code.format("ab123")).toBe("AB-123");
    expect(code.parse("ab-123")).toBe("AB123");
  });

  it("asks for the numeric keyboard unless told otherwise", () => {
    expect(pairs.inputMode).toBe("numeric");
    expect(phone.inputMode).toBe("tel");
    expect(patternMask("##", { slots: {} }).inputMode).toBe("numeric");
  });

  it("asks for no keyboard of its own once it takes other slots", () => {
    expect(code.inputMode).toBeUndefined();
  });
});

describe("patternMask on Input", () => {
  it("reports every value the engine writes to onValueChange", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Input mask={phone} onValueChange={onValueChange} />);

    await user.type(screen.getByRole("textbox"), "12345");

    expect(onValueChange.mock.calls.map(([value]) => value)).toEqual([
      "(1",
      "(12",
      "(123",
      "(123) 4",
      "(123) 45",
    ]);
  });

  it("drops what no slot takes as it is typed", async () => {
    const user = userEvent.setup();
    render(<Input mask={phone} />);

    await user.type(screen.getByRole("textbox"), "abc123def456ghi7890");

    expect(screen.getByRole("textbox")).toHaveValue("(123) 456-7890");
  });

  it("uppercases letters as they are typed", async () => {
    const user = userEvent.setup();
    render(<Input mask={code} />);

    await user.type(screen.getByRole("textbox"), "ab123");

    expect(screen.getByRole("textbox")).toHaveValue("AB-123");
  });

  it("asks for the mask's keyboard", () => {
    render(<Input mask={phone} />);
    expect(screen.getByRole("textbox")).toHaveAttribute("inputmode", "tel");
  });

  it("empties the field once the last character is deleted", async () => {
    const user = userEvent.setup();
    render(<Input mask={phone} />);
    const input = screen.getByRole("textbox");

    await user.type(input, "1");
    expect(input).toHaveValue("(1");

    await user.keyboard("{Backspace}");
    expect(input).toHaveValue("");
  });

  it("formats a paste and puts the caret after it", async () => {
    const user = userEvent.setup();
    render(<Input mask={phone} />);
    const input = screen.getByRole<HTMLInputElement>("textbox");

    await user.click(input);
    await user.paste("5551234567");

    expect(input).toHaveValue("(555) 123-4567");
    expect(input.selectionStart).toBe(14);
  });
});
