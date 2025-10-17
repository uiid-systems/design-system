import type { InputProps } from "../input/input.types";

// Top 20 most traded currencies
export type SupportedCurrency =
  | "USD" // US Dollar
  | "EUR" // Euro
  | "JPY" // Japanese Yen
  | "GBP" // British Pound
  | "AUD" // Australian Dollar
  | "CAD" // Canadian Dollar
  | "CHF" // Swiss Franc
  | "CNY" // Chinese Yuan
  | "SEK" // Swedish Krona
  | "NZD" // New Zealand Dollar
  | "MXN" // Mexican Peso
  | "SGD" // Singapore Dollar
  | "HKD" // Hong Kong Dollar
  | "NOK" // Norwegian Krone
  | "KRW" // South Korean Won
  | "TRY" // Turkish Lira
  | "RUB" // Russian Ruble
  | "INR" // Indian Rupee
  | "BRL" // Brazilian Real
  | "ZAR"; // South African Rand

// Top 50 most common locales
export type SupportedLocale =
  | "en-US" // English (United States)
  | "en-GB" // English (United Kingdom)
  | "en-CA" // English (Canada)
  | "en-AU" // English (Australia)
  | "en-NZ" // English (New Zealand)
  | "en-ZA" // English (South Africa)
  | "en-IN" // English (India)
  | "es-ES" // Spanish (Spain)
  | "es-MX" // Spanish (Mexico)
  | "es-AR" // Spanish (Argentina)
  | "es-CO" // Spanish (Colombia)
  | "es-CL" // Spanish (Chile)
  | "fr-FR" // French (France)
  | "fr-CA" // French (Canada)
  | "fr-BE" // French (Belgium)
  | "fr-CH" // French (Switzerland)
  | "de-DE" // German (Germany)
  | "de-AT" // German (Austria)
  | "de-CH" // German (Switzerland)
  | "it-IT" // Italian (Italy)
  | "it-CH" // Italian (Switzerland)
  | "pt-BR" // Portuguese (Brazil)
  | "pt-PT" // Portuguese (Portugal)
  | "nl-NL" // Dutch (Netherlands)
  | "nl-BE" // Dutch (Belgium)
  | "sv-SE" // Swedish (Sweden)
  | "da-DK" // Danish (Denmark)
  | "no-NO" // Norwegian (Norway)
  | "fi-FI" // Finnish (Finland)
  | "pl-PL" // Polish (Poland)
  | "ru-RU" // Russian (Russia)
  | "ja-JP" // Japanese (Japan)
  | "ko-KR" // Korean (South Korea)
  | "zh-CN" // Chinese (China)
  | "zh-TW" // Chinese (Taiwan)
  | "zh-HK" // Chinese (Hong Kong)
  | "ar-SA" // Arabic (Saudi Arabia)
  | "ar-AE" // Arabic (UAE)
  | "hi-IN" // Hindi (India)
  | "th-TH" // Thai (Thailand)
  | "vi-VN" // Vietnamese (Vietnam)
  | "id-ID" // Indonesian (Indonesia)
  | "ms-MY" // Malay (Malaysia)
  | "tr-TR" // Turkish (Turkey)
  | "he-IL" // Hebrew (Israel)
  | "cs-CZ" // Czech (Czech Republic)
  | "hu-HU" // Hungarian (Hungary)
  | "ro-RO" // Romanian (Romania)
  | "bg-BG" // Bulgarian (Bulgaria)
  | "hr-HR" // Croatian (Croatia)
  | "sk-SK"; // Slovak (Slovakia)

export type InputCurrencyProps = InputProps & {
  locale?: SupportedLocale;
  maximumFractionDigits?: number;
  currency?: SupportedCurrency;
};

export interface CurrencyHelpersConfig {
  locale?: SupportedLocale;
  maximumFractionDigits?: number;
  currency?: SupportedCurrency;
}

export interface CurrencyHelpersReturn {
  parseToCleanString: (value: string | number | undefined) => string;
  format: (value: string | number | undefined) => string;
  formatter: Intl.NumberFormat;
  sanitizeInput: (input: string | number) => string;
  parseToNumberBeforeSubmit: (stringNumber: string | number) => number;
  currencySymbol: string;
}
