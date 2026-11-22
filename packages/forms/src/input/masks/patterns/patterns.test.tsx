import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Input } from "../../input";
import type { InputMask } from "../../input.types";
import {
  creditCardExpiryMask,
  creditCardMask,
  dateMask,
  einMask,
  ipv4Mask,
  isValidCreditCard,
  isValidCreditCardExpiry,
  isValidDate,
  isValidEin,
  isValidIpv4,
  isValidIsbn,
  isValidLicensePlate,
  isValidMacAddress,
  isValidPhone,
  isValidSsn,
  isValidTime,
  isValidZipCode,
  isValidZipCodeExtended,
  isbnMask,
  licensePlateMask,
  macAddressMask,
  phoneMask,
  ssnMask,
  timeMask,
  zipCodeExtendedMask,
  zipCodeMask,
} from "./index";

/* The typed input and masked output of each case come from the old MaskInput
   test file, so the new masks show what the old patterns showed. */
const PATTERNS: {
  name: string;
  mask: InputMask<string>;
  typed: string;
  masked: string;
  inputMode?: string;
}[] = [
  {
    name: "phoneMask",
    mask: phoneMask,
    typed: "1234567890",
    masked: "(123) 456-7890",
    inputMode: "tel",
  },
  {
    name: "ssnMask",
    mask: ssnMask,
    typed: "123456789",
    masked: "123-45-6789",
    inputMode: "numeric",
  },
  {
    name: "einMask",
    mask: einMask,
    typed: "123456789",
    masked: "12-3456789",
    inputMode: "numeric",
  },
  {
    name: "dateMask",
    mask: dateMask,
    typed: "12252024",
    masked: "12/25/2024",
    inputMode: "numeric",
  },
  {
    name: "timeMask",
    mask: timeMask,
    typed: "1430",
    masked: "14:30",
    inputMode: "numeric",
  },
  {
    name: "creditCardMask",
    mask: creditCardMask,
    typed: "4111111111111111",
    masked: "4111 1111 1111 1111",
    inputMode: "numeric",
  },
  {
    name: "creditCardExpiryMask",
    mask: creditCardExpiryMask,
    typed: "1230",
    masked: "12/30",
    inputMode: "numeric",
  },
  {
    name: "zipCodeMask",
    mask: zipCodeMask,
    typed: "12345",
    masked: "12345",
    inputMode: "numeric",
  },
  {
    name: "zipCodeExtendedMask",
    mask: zipCodeExtendedMask,
    typed: "123456789",
    masked: "12345-6789",
    inputMode: "numeric",
  },
  {
    name: "licensePlateMask",
    mask: licensePlateMask,
    typed: "abc123",
    masked: "ABC-123",
  },
  {
    name: "macAddressMask",
    mask: macAddressMask,
    typed: "001a2bff4c5d",
    masked: "00:1A:2B:FF:4C:5D",
  },
  {
    name: "isbnMask",
    mask: isbnMask,
    typed: "9780306406157",
    masked: "978-0-306-40615-7",
    inputMode: "numeric",
  },
];

describe.each(PATTERNS)("$name", ({ mask, typed, masked, inputMode }) => {
  it("formats the typed characters", () => {
    expect(mask.format(typed)).toBe(masked);
  });

  it("parses to the unmasked string", () => {
    expect(mask.parse(masked)).toBe(typed.toUpperCase());
  });

  it("round-trips format and parse", () => {
    expect(mask.format(mask.parse(masked))).toBe(masked);
    expect(mask.parse(mask.format(typed))).toBe(typed.toUpperCase());
  });

  it("formats and parses an empty field as empty", () => {
    expect(mask.format("")).toBe("");
    expect(mask.parse("")).toBe("");
  });

  it("formats as it is typed into Input", async () => {
    const user = userEvent.setup();
    render(<Input mask={mask} />);

    await user.type(screen.getByRole("textbox"), typed);

    expect(screen.getByRole("textbox")).toHaveValue(masked);
  });

  it("asks for its keyboard", () => {
    expect(mask.inputMode).toBe(inputMode);
  });
});

describe("numeric patterns", () => {
  it("strip non-digit characters", () => {
    expect(phoneMask.format("abc123def456ghi7890")).toBe("(123) 456-7890");
  });

  it("stop at the end of the template", () => {
    expect(phoneMask.format("55512345678")).toBe("(555) 123-4567");
    expect(creditCardMask.format("41111111111111112")).toBe(
      "4111 1111 1111 1111",
    );
  });
});

describe("phoneMask on Input", () => {
  /* Positions and results from the old MaskInput tests of Backspace, Delete
     and paste on a phone field. */
  const setup = async (defaultValue?: string) => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Input
        mask={phoneMask}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
      />,
    );
    const input = screen.getByRole<HTMLInputElement>("textbox");
    await user.click(input);
    return { user, input, onValueChange };
  };

  it("keeps a controlled value in step with what the engine writes", async () => {
    const user = userEvent.setup();
    const Controlled = () => {
      const [value, setValue] = useState("");
      return (
        <>
          <Input mask={phoneMask} value={value} onValueChange={setValue} />
          <output>{value}</output>
        </>
      );
    };
    render(<Controlled />);

    await user.type(screen.getByRole("textbox"), "5551234");

    expect(screen.getByRole("textbox")).toHaveValue("(555) 123-4");
    expect(screen.getByRole("status")).toHaveTextContent("(555) 123-4");
  });

  it("tracks data-filled against a controlled masked value", () => {
    const { rerender } = render(
      <Input
        mask={phoneMask}
        value="(555) 123-4567"
        onValueChange={() => {}}
      />,
    );
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("data-filled");

    rerender(<Input mask={phoneMask} value="" onValueChange={() => {}} />);
    expect(input).not.toHaveAttribute("data-filled");
  });

  /* react-hook-form's `register` spreads `name`, `onChange` and `ref`, and
     reads `event.target.value` on each change, so it must see the masked text. */
  it("hands a register-shaped onChange the masked text", async () => {
    const user = userEvent.setup();
    /* Records the value at the time of each call: `event.target` is the live
       element, so reading it after typing would only show the final text. */
    const onChange = vi.fn(
      (event: React.ChangeEvent<HTMLInputElement>) => event.target.value,
    );
    render(<Input mask={phoneMask} name="phone" onChange={onChange} />);

    await user.type(screen.getByRole("textbox"), "5551234");

    /* The first digit, the fourth and the seventh are rewritten by the mask,
       which adds a literal; the others are plain insertions. */
    expect(onChange.mock.results.map(({ value }) => value)).toEqual([
      "(5",
      "(55",
      "(555",
      "(555) 1",
      "(555) 12",
      "(555) 123",
      "(555) 123-4",
    ]);
  });

  it("tracks data-filled as an uncontrolled masked value is typed and cleared", async () => {
    const user = userEvent.setup();
    render(<Input mask={phoneMask} />);
    const input = screen.getByRole<HTMLInputElement>("textbox");

    await user.type(input, "555");
    expect(input).toHaveAttribute("data-filled");

    /* Selected and deleted by hand: user-event's `clear` leaves `(5` behind
       under happy-dom with the mask attached. */
    input.setSelectionRange(0, input.value.length);
    await user.keyboard("{Backspace}");
    expect(input).toHaveValue("");
    expect(input).not.toHaveAttribute("data-filled");
  });

  it("deletes the last digit on Backspace", async () => {
    const { user, input, onValueChange } = await setup("(123) 456-7890");

    await user.keyboard("{Backspace}");

    expect(input).toHaveValue("(123) 456-789");
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(input.selectionStart).toBe(13);
  });

  it("keeps the caret in place when Backspace deletes mid-value", async () => {
    const { user, input } = await setup("(123) 456-7890");

    input.setSelectionRange(9, 9);
    await user.keyboard("{Backspace}");

    expect(input).toHaveValue("(123) 457-890");
    expect(input.selectionStart).toBe(8);
  });

  /* The old MaskInput deleted the 7 on the first Delete. Maskito steps over
     the literal first, as it does for Backspace. */
  it("steps Delete over a literal, then deletes the digit after it", async () => {
    const { user, input } = await setup("(123) 456-7890");

    input.setSelectionRange(9, 9);
    await user.keyboard("{Delete}");

    expect(input).toHaveValue("(123) 456-7890");
    expect(input.selectionStart).toBe(10);

    await user.keyboard("{Delete}");

    expect(input).toHaveValue("(123) 456-890");
    expect(input.selectionStart).toBe(10);
  });

  it("changes nothing when Backspace has only a literal before it", async () => {
    const { user, input, onValueChange } = await setup("(123) 456-7890");

    input.setSelectionRange(1, 1);
    await user.keyboard("{Backspace}");

    expect(input).toHaveValue("(123) 456-7890");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("empties the field when everything is selected and deleted", async () => {
    const { user, input } = await setup("(123) 456-7890");

    input.setSelectionRange(0, input.value.length);
    await user.keyboard("{Backspace}");

    expect(input).toHaveValue("");
  });

  it("formats a paste", async () => {
    const { user, input, onValueChange } = await setup();

    await user.paste("5551234567");

    expect(input).toHaveValue("(555) 123-4567");
    expect(onValueChange).toHaveBeenLastCalledWith(
      "(555) 123-4567",
      expect.anything(),
    );
    expect(input.selectionStart).toBe(14);
  });

  it("puts a mid-value paste in place", async () => {
    const { user, input } = await setup("(123) 4");

    input.setSelectionRange(2, 2);
    await user.paste("99");

    expect(input).toHaveValue("(199) 234");
    /* After the pasted digits and the literal that follows them. The old
       MaskInput put the caret at the end of the value instead, at 9. */
    expect(input.selectionStart).toBe(6);
  });

  it("cuts a mid-value paste that overflows a full field", async () => {
    const { user, input } = await setup("(123) 456-7890");

    input.setSelectionRange(2, 2);
    await user.paste("99");

    expect(input).toHaveValue("(199) 234-5678");
  });

  it("changes nothing on a paste into a full field", async () => {
    const { user, input } = await setup("(123) 456-7890");

    input.setSelectionRange(14, 14);
    await user.paste("9");

    expect(input).toHaveValue("(123) 456-7890");
  });

  it("cuts an over-long paste at the end of the template", async () => {
    const { user, input } = await setup();

    await user.paste("555123456789");

    expect(input).toHaveValue("(555) 123-4567");
  });

  /* The value is the masked string everywhere, so a defaultValue is shown as
     given. Pass it through `format` to show it masked. */
  it("shows a defaultValue as given, and masked once formatted", () => {
    const { unmount } = render(
      <Input mask={phoneMask} defaultValue="5551234567" />,
    );
    expect(screen.getByRole("textbox")).toHaveValue("5551234567");
    unmount();

    render(
      <Input mask={phoneMask} defaultValue={phoneMask.format("5551234567")} />,
    );
    expect(screen.getByRole("textbox")).toHaveValue("(555) 123-4567");
  });
});

describe("zipCodeMask", () => {
  it("cuts a sixth digit and drops a letter", () => {
    expect(zipCodeMask.format("123456")).toBe("12345");
    expect(zipCodeMask.parse("12a34")).toBe("1234");
  });
});

describe("ipv4Mask", () => {
  it("keeps the dots in its value", () => {
    expect(ipv4Mask.format("192.168.0.1")).toBe("192.168.0.1");
    expect(ipv4Mask.parse("192.168.0.1")).toBe("192.168.0.1");
    expect(ipv4Mask.format(ipv4Mask.parse("10.0.0.255"))).toBe("10.0.0.255");
  });

  it("formats and parses an empty field as empty", () => {
    expect(ipv4Mask.format("")).toBe("");
    expect(ipv4Mask.parse("")).toBe("");
  });

  it("asks for the decimal keyboard, which has a dot", () => {
    expect(ipv4Mask.inputMode).toBe("decimal");
  });

  it("takes groups of one to three digits as typed", async () => {
    const user = userEvent.setup();
    render(<Input mask={ipv4Mask} />);

    await user.type(screen.getByRole("textbox"), "10.0.12.255");

    expect(screen.getByRole("textbox")).toHaveValue("10.0.12.255");
  });

  it("round-trips a partial address", () => {
    expect(ipv4Mask.format(ipv4Mask.parse("10.0."))).toBe("10.0.");
  });

  /* The field never judges a group's value, so a padded or out-of-range
     address is kept as it came, not rewritten into a different valid one;
     isValidIpv4 rejects it. */
  it("keeps a zero-padded address as it came", () => {
    expect(ipv4Mask.format("192.168.001.010")).toBe("192.168.001.010");
    expect(ipv4Mask.format("010.0.0.1")).toBe("010.0.0.1");
    expect(isValidIpv4(ipv4Mask.format("192.168.001.010"))).toBe(false);
  });

  it("keeps a group past 255 for the validator to reject", () => {
    expect(ipv4Mask.format("256.1.1.1")).toBe("256.1.1.1");
    expect(isValidIpv4("256.1.1.1")).toBe(false);
  });

  it("keeps a zero-padded paste as it came", async () => {
    const user = userEvent.setup();
    render(<Input mask={ipv4Mask} />);
    const input = screen.getByRole("textbox");

    await user.click(input);
    await user.paste("192.168.001.010");

    expect(input).toHaveValue("192.168.001.010");
  });

  it("takes a leading zero as typed", async () => {
    const user = userEvent.setup();
    render(<Input mask={ipv4Mask} />);

    await user.type(screen.getByRole("textbox"), "01.1");

    expect(screen.getByRole("textbox")).toHaveValue("01.1");
  });

  it("rejects a fourth digit in a group, a fourth dot and letters", async () => {
    const user = userEvent.setup();
    render(<Input mask={ipv4Mask} />);
    const input = screen.getByRole("textbox");

    await user.type(input, "1234");
    expect(input).toHaveValue("123");

    await user.clear(input);
    await user.type(input, "1.2.3.4.");
    expect(input).toHaveValue("1.2.3.4");

    await user.clear(input);
    await user.type(input, "1a.b2");
    expect(input).toHaveValue("1.2");
  });

  it("ends a pasted address at its prefix length or port", async () => {
    expect(ipv4Mask.format("10.0.0.1/24")).toBe("10.0.0.1");
    expect(ipv4Mask.format("192.168.1.1:8080")).toBe("192.168.1.1");
    expect(ipv4Mask.format(" 10.0.0.1 ")).toBe("10.0.0.1");

    const user = userEvent.setup();
    render(<Input mask={ipv4Mask} />);
    const input = screen.getByRole("textbox");

    await user.click(input);
    await user.paste("10.0.0.1/24");
    expect(input).toHaveValue("10.0.0.1");

    await user.clear(input);
    await user.paste("192.168.1.1:8080");
    expect(input).toHaveValue("192.168.1.1");
  });

  it("rejects an empty group and a leading dot", async () => {
    const user = userEvent.setup();
    render(<Input mask={ipv4Mask} />);
    const input = screen.getByRole("textbox");

    await user.type(input, ".1..2");

    expect(input).toHaveValue("1.2");
  });
});

describe("validators", () => {
  /* The date and expiry checks read the clock, so it is held at 15 June 2026. */
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 5, 15));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("isValidPhone needs ten digits", () => {
    expect(isValidPhone("(123) 456-7890")).toBe(true);
    expect(isValidPhone("1234567890")).toBe(true);
    expect(isValidPhone("(123) 456-789")).toBe(false);
    expect(isValidPhone("")).toBe(false);
  });

  it("isValidSsn needs nine digits", () => {
    expect(isValidSsn("123-45-6789")).toBe(true);
    expect(isValidSsn("123-45-678")).toBe(false);
  });

  it("isValidEin needs nine digits", () => {
    expect(isValidEin("12-3456789")).toBe(true);
    expect(isValidEin("12-345678")).toBe(false);
  });

  it("isValidZipCode needs five digits", () => {
    expect(isValidZipCode("12345")).toBe(true);
    expect(isValidZipCode("1234")).toBe(false);
  });

  it("isValidZipCodeExtended needs nine digits", () => {
    expect(isValidZipCodeExtended("12345-6789")).toBe(true);
    expect(isValidZipCodeExtended("12345")).toBe(false);
  });

  it("isValidIsbn needs thirteen digits", () => {
    expect(isValidIsbn("978-0-306-40615-7")).toBe(true);
    expect(isValidIsbn("978-0-306-40615")).toBe(false);
  });

  it("isValidTime takes hours to 23 and minutes to 59", () => {
    expect(isValidTime("14:30")).toBe(true);
    expect(isValidTime("00:00")).toBe(true);
    expect(isValidTime("23:59")).toBe(true);
    expect(isValidTime("24:00")).toBe(false);
    expect(isValidTime("12:60")).toBe(false);
    expect(isValidTime("12:3")).toBe(false);
  });

  it("isValidCreditCard checks the Luhn checksum", () => {
    expect(isValidCreditCard("4111 1111 1111 1111")).toBe(true);
    expect(isValidCreditCard("4111111111111111")).toBe(true);
    expect(isValidCreditCard("4111 1111 1111 1112")).toBe(false);
  });

  /* Doubling a 5 to 9 gives 10 to 18, whose digits sum to the doubled value
     less nine. These numbers fail if that step is dropped or done another way. */
  it("isValidCreditCard sums the digits of a doubled digit past 9", () => {
    expect(isValidCreditCard("5555 5555 5555 4444")).toBe(true);
    expect(isValidCreditCard("378282246310005")).toBe(true);
    // Passes only if a doubled 5 counts as 10 rather than 1.
    expect(isValidCreditCard("5555 5555 5555 4440")).toBe(false);
  });

  it("isValidCreditCard takes thirteen to nineteen digits", () => {
    expect(isValidCreditCard("4222222222222")).toBe(true);
    expect(isValidCreditCard("4000000000000000006")).toBe(true);
    // Passes Luhn (8 + 2), so only the length limit rejects it.
    expect(isValidCreditCard("40000000000000000002")).toBe(false);
    // Twelve digits that pass Luhn (8 + 2), so only the 13-digit floor rejects it.
    expect(isValidCreditCard("400000000002")).toBe(false);
    expect(isValidCreditCard("4111 1111 111")).toBe(false);
    expect(isValidCreditCard("")).toBe(false);
  });

  it("isValidCreditCardExpiry needs a real month", () => {
    expect(isValidCreditCardExpiry("12/30")).toBe(true);
    expect(isValidCreditCardExpiry("00/30")).toBe(false);
    expect(isValidCreditCardExpiry("13/30")).toBe(false);
    expect(isValidCreditCardExpiry("1/30")).toBe(false);
  });

  it("isValidCreditCardExpiry rejects a card that has expired", () => {
    expect(isValidCreditCardExpiry("06/26")).toBe(true);
    expect(isValidCreditCardExpiry("05/26")).toBe(false);
    expect(isValidCreditCardExpiry("12/25")).toBe(false);
  });

  /* From 2026 no two-digit year reaches past 2076, since 76 and up read as
     19xx, so the clock moves back to 2020, where the limit is 2070. */
  it("isValidCreditCardExpiry rejects an expiry more than 50 years out", () => {
    vi.setSystemTime(new Date(2020, 0, 1));
    expect(isValidCreditCardExpiry("12/70")).toBe(true);
    expect(isValidCreditCardExpiry("01/71")).toBe(false);
  });

  it("isValidCreditCardExpiry reads years from 76 as 19xx", () => {
    expect(isValidCreditCardExpiry("12/75")).toBe(true);
    expect(isValidCreditCardExpiry("01/76")).toBe(false);
  });

  it("isValidCreditCardExpiry takes bare digits", () => {
    expect(isValidCreditCardExpiry("1230")).toBe(true);
  });

  it("isValidDate needs a real day of a real month", () => {
    expect(isValidDate("12/25/2024")).toBe(true);
    expect(isValidDate("04/30/2024")).toBe(true);
    expect(isValidDate("04/31/2024")).toBe(false);
    expect(isValidDate("13/01/2024")).toBe(false);
    expect(isValidDate("00/10/2024")).toBe(false);
    expect(isValidDate("01/00/2024")).toBe(false);
    expect(isValidDate("12/25/202")).toBe(false);
  });

  it("isValidDate knows leap years", () => {
    expect(isValidDate("02/29/2024")).toBe(true);
    expect(isValidDate("02/29/2023")).toBe(false);
    expect(isValidDate("02/29/2000")).toBe(true);
  });

  /* A century is a leap year only when it divides by 400. 1900 is outside
     the range from 2026, so the clock moves to 2095 to reach 2100. */
  it("isValidDate knows a century is not a leap year unless it divides by 400", () => {
    vi.setSystemTime(new Date(2095, 0, 1));
    expect(isValidDate("02/29/2096")).toBe(true);
    expect(isValidDate("02/29/2100")).toBe(false);
    expect(isValidDate("02/28/2100")).toBe(true);
  });

  it("isValidDate takes bare digits", () => {
    expect(isValidDate("12252024")).toBe(true);
  });

  it("isValidDate takes years from 120 back to 10 ahead", () => {
    expect(isValidDate("01/01/1906")).toBe(true);
    expect(isValidDate("01/01/1905")).toBe(false);
    expect(isValidDate("12/31/2036")).toBe(true);
    expect(isValidDate("01/01/2037")).toBe(false);
  });

  it("isValidLicensePlate needs six letters or digits", () => {
    expect(isValidLicensePlate("ABC-123")).toBe(true);
    expect(isValidLicensePlate("abc-123")).toBe(true);
    expect(isValidLicensePlate("ABC-12")).toBe(false);
    expect(isValidLicensePlate("ABC123")).toBe(true);
  });

  it("isValidMacAddress needs twelve hex digits", () => {
    expect(isValidMacAddress("00:1A:2B:FF:4C:5D")).toBe(true);
    expect(isValidMacAddress("00:1a:2b:ff:4c:5d")).toBe(true);
    expect(isValidMacAddress("001A2BFF4C5D")).toBe(true);
    expect(isValidMacAddress("00:1A:2B:FF:4C:5G")).toBe(false);
    expect(isValidMacAddress("00:1A:2B:FF:4C")).toBe(false);
  });

  it("isValidMacAddress rejects a mix of joined and bare pairs", () => {
    expect(isValidMacAddress("00:1A2B:3C4D5E")).toBe(false);
  });

  it("isValidIpv4 needs four groups of 0 to 255", () => {
    expect(isValidIpv4("192.168.0.1")).toBe(true);
    expect(isValidIpv4("0.0.0.0")).toBe(true);
    expect(isValidIpv4("255.255.255.255")).toBe(true);
    expect(isValidIpv4("256.1.1.1")).toBe(false);
    expect(isValidIpv4("1.2.3")).toBe(false);
    expect(isValidIpv4("1.2.3.")).toBe(false);
    expect(isValidIpv4("1.2.3.4.5")).toBe(false);
  });

  it("isValidIpv4 rejects a leading zero and a four-digit group", () => {
    expect(isValidIpv4("01.1.1.1")).toBe(false);
    expect(isValidIpv4("1.1.1.010")).toBe(false);
    expect(isValidIpv4("1234.1.1.1")).toBe(false);
  });
});

describe("a validator in Field's validate", () => {
  it("shows the message while the masked value fails and clears it once it passes", async () => {
    const user = userEvent.setup();
    const validate = vi.fn((value: unknown) =>
      isValidPhone(String(value)) ? null : "Enter a ten-digit number",
    );
    render(
      <Input
        mask={phoneMask}
        label="Phone"
        FieldProps={{ validationMode: "onChange", validate }}
      />,
    );
    const input = screen.getByRole("textbox");

    await user.type(input, "123");
    expect(
      await screen.findByText("Enter a ten-digit number"),
    ).toBeInTheDocument();

    await user.keyboard("4567890");
    expect(input).toHaveValue("(123) 456-7890");
    // validate sees the masked string.
    await waitFor(() =>
      expect(validate.mock.lastCall?.[0]).toBe("(123) 456-7890"),
    );
    await waitFor(() =>
      expect(
        screen.queryByText("Enter a ten-digit number"),
      ).not.toBeInTheDocument(),
    );
  });
});
