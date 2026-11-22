import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, expectTypeOf, it, vi } from "vitest";

import { Form } from "../form/form";
import { Input } from "../input/input";
import type { InputMask, InputProps } from "../input/input.types";
import {
  creditCardMask,
  isValidCreditCard,
  phoneMask,
} from "../input/masks/patterns";
import { MaskInput } from "./mask-input";
import type { MaskInputProps } from "./mask-input.types";

/* MaskInput is Input with a required mask. The masks' own behaviour is tested
   under `input/masks/`; these tests prove only the wrapper. */
describe("MaskInput", () => {
  it("renders the element Input renders", () => {
    render(<MaskInput mask={phoneMask} />);
    expect(screen.getByRole("textbox")).toHaveAttribute("data-slot", "input");
  });

  it("formats what is typed with the mask it is given", async () => {
    const user = userEvent.setup();
    render(<MaskInput mask={phoneMask} />);
    const input = screen.getByRole("textbox");

    await user.type(input, "5555555555");

    expect(input).toHaveValue("(555) 555-5555");
  });

  it("asks for the mask's keyboard", () => {
    render(<MaskInput mask={phoneMask} />);
    expect(screen.getByRole("textbox")).toHaveAttribute("inputmode", "tel");
  });

  it("forwards Input's props", () => {
    render(
      <MaskInput
        mask={phoneMask}
        label="Phone number"
        description="We only call about your order."
        placeholder="(555) 555-5555"
        name="phone"
        className="custom"
        inputMode="numeric"
        size="small"
        data-testid="phone"
      />,
    );
    const input = screen.getByLabelText("Phone number");

    expect(input).toBe(screen.getByTestId("phone"));
    expect(input).toHaveAttribute("placeholder", "(555) 555-5555");
    expect(input).toHaveAttribute("name", "phone");
    expect(input).toHaveAttribute("inputmode", "numeric");
    expect(input).toHaveClass("custom");
    expect(
      screen.getByText("We only call about your order."),
    ).toBeInTheDocument();
  });

  it("forwards the ref to the input element", () => {
    const ref = createRef<HTMLInputElement>();
    render(<MaskInput mask={phoneMask} ref={ref} />);
    expect(ref.current).toBe(screen.getByRole("textbox"));
  });

  it("reports the masked value through Input's onValueChange", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<MaskInput mask={phoneMask} onValueChange={onValueChange} />);

    await user.type(screen.getByRole("textbox"), "555");

    expect(onValueChange).toHaveBeenLastCalledWith("(555", expect.anything());
  });

  it("shows a defaultValue as given", () => {
    render(
      <MaskInput
        mask={phoneMask}
        defaultValue={phoneMask.format("5555555555")}
      />,
    );
    expect(screen.getByRole("textbox")).toHaveValue("(555) 555-5555");
  });

  it("shows an unmasked defaultValue unformatted", () => {
    render(<MaskInput mask={phoneMask} defaultValue="5555555555" />);
    expect(screen.getByRole("textbox")).toHaveValue("5555555555");
  });

  it("submits the masked string", () => {
    render(
      <form data-testid="form">
        <MaskInput
          mask={phoneMask}
          name="phone"
          defaultValue="(555) 555-5555"
        />
      </form>,
    );
    const data = new FormData(screen.getByTestId("form") as HTMLFormElement);
    expect(data.get("phone")).toBe("(555) 555-5555");
  });

  it("takes a validator through Field's validate", async () => {
    const user = userEvent.setup();
    render(
      <MaskInput
        mask={creditCardMask}
        label="Card number"
        FieldProps={{
          validationMode: "onChange",
          validate: (value) =>
            isValidCreditCard(String(value ?? ""))
              ? null
              : "Check the card number",
        }}
      />,
    );

    await user.type(screen.getByLabelText("Card number"), "4111111111111112");
    expect(screen.getByText("Check the card number")).toBeInTheDocument();

    await user.keyboard("{Backspace}1");
    expect(screen.queryByText("Check the card number")).not.toBeInTheDocument();
  });

  it("shows a Form error for its name", () => {
    render(
      <Form errors={{ card: "That card number was declined" }}>
        <MaskInput name="card" mask={creditCardMask} label="Card number" />
      </Form>,
    );
    expect(screen.getByText("That card number was declined")).toHaveAttribute(
      "data-slot",
      "field-error",
    );
  });

  it("renders the same markup as Input with the same mask", () => {
    const { container: wrapped } = render(
      <MaskInput mask={phoneMask} placeholder="Phone" />,
    );
    const { container: plain } = render(
      <Input mask={phoneMask} placeholder="Phone" />,
    );
    const strip = (html: string) => html.replace(/ id="[^"]*"/g, "");
    expect(strip(wrapped.innerHTML)).toBe(strip(plain.innerHTML));
  });

  it("takes Input's props, with mask required", () => {
    expectTypeOf<MaskInputProps>().toEqualTypeOf<
      Omit<InputProps, "mask"> & { mask: InputMask<unknown> }
    >();
    expectTypeOf<MaskInputProps["mask"]>().toEqualTypeOf<InputMask<unknown>>();
  });

  /* Checked by `pnpm typecheck`: each line below must fail to compile. */
  it("refuses the old API", () => {
    const dualArgument = (masked: string, unmasked: string) =>
      void [masked, unmasked];
    // @ts-expect-error mask is required
    void (<MaskInput />);
    // @ts-expect-error a string key is no longer a mask
    void (<MaskInput mask="phone" />);
    // @ts-expect-error validationMode is gone; use Field's
    void (<MaskInput mask={phoneMask} validationMode="onBlur" />);
    // @ts-expect-error onValidate is gone; use an isValid* validator
    void (<MaskInput mask={phoneMask} onValidate={() => {}} />);
    // @ts-expect-error the second, unmasked argument is gone
    void (<MaskInput mask={phoneMask} onValueChange={dualArgument} />);
  });
});
