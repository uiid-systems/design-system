import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
  });

  it("cuts an over-long paste at the end of the template", async () => {
    const { user, input } = await setup();

    await user.paste("555123456789");

    expect(input).toHaveValue("(555) 123-4567");
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

  it("rejects a group past 255, a fourth dot and letters", async () => {
    const user = userEvent.setup();
    render(<Input mask={ipv4Mask} />);
    const input = screen.getByRole("textbox");

    await user.type(input, "256");
    expect(input).toHaveValue("25");

    await user.clear(input);
    await user.type(input, "1.2.3.4.");
    expect(input).toHaveValue("1.2.3.4");

    await user.clear(input);
    await user.type(input, "1a.b2");
    expect(input).toHaveValue("1.2");
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

  it("isValidCreditCard takes thirteen to nineteen digits", () => {
    expect(isValidCreditCard("4222222222222")).toBe(true);
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

  it("isValidCreditCardExpiry rejects an expiry more than 50 years out", () => {
    expect(isValidCreditCardExpiry("12/75")).toBe(true);
    // 76 reads as 1976, which has passed.
    expect(isValidCreditCardExpiry("01/76")).toBe(false);
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
    expect(isValidDate("02/29/1900")).toBe(false);
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
  });

  it("isValidMacAddress needs twelve hex digits", () => {
    expect(isValidMacAddress("00:1A:2B:FF:4C:5D")).toBe(true);
    expect(isValidMacAddress("00:1a:2b:ff:4c:5d")).toBe(true);
    expect(isValidMacAddress("00:1A:2B:FF:4C:5G")).toBe(false);
    expect(isValidMacAddress("00:1A:2B:FF:4C")).toBe(false);
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

  it("works as a Field validate check", () => {
    const validate = (value: unknown) =>
      isValidPhone(String(value)) ? null : "Enter a ten-digit number";

    expect(validate("(123) 456-7890")).toBeNull();
    expect(validate("(123")).toBe("Enter a ten-digit number");
  });
});
