import type { Country, Currency } from "./calculator";

const COUNTRY_CURRENCIES: Record<Country, Currency> = { US: "USD", UK: "GBP", CA: "CAD", AU: "AUD", BE: "EUR", NL: "EUR" };
export const currencyForCountry = (country: Country): Currency => COUNTRY_CURRENCIES[country];

export const symbol = (currency: Currency) =>
  ({ USD: "$", GBP: "£", CAD: "C$", AUD: "A$", EUR: "€" })[currency];

// Approximate display conversion only. The calculator is not a live FX service.
export const currencyToUSD: Record<Currency, number> = { USD: 1, GBP: 1.35, CAD: 0.73, AUD: 0.65, EUR: 1.17 };
export const convertCurrency = (value: number, from: Currency, to: Currency) =>
  (Number.isFinite(value) ? value : 0) * currencyToUSD[from] / currencyToUSD[to];

const localeForCurrency: Record<Currency, string> = {
  USD: "en-US",
  GBP: "en-GB",
  CAD: "en-CA",
  AUD: "en-AU",
  EUR: "en-IE",
};

export const money = (value: number, currency: Currency) =>
  new Intl.NumberFormat(localeForCurrency[currency], {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Math.round(Number.isFinite(value) ? value : 0));

export const countryDefaults = (country: Country) =>
  ({
    US: { currency: "USD", unit: "lb" },
    UK: { currency: "GBP", unit: "kg" },
    CA: { currency: "CAD", unit: "kg" },
    AU: { currency: "AUD", unit: "kg" },
    BE: { currency: "EUR", unit: "kg" },
    NL: { currency: "EUR", unit: "kg" },
  })[country];
