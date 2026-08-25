/**
 * "PKR 145,000" — plain digit grouping rather than Intl's currency
 * formatter, whose PKR symbol/spacing varies by ICU data available on the
 * host. This reads correctly everywhere and matches how the brand writes
 * prices elsewhere on the site.
 */
export function formatPKR(amount: number): string {
  return `PKR ${amount.toLocaleString("en-US")}`;
}
