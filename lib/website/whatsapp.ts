/**
 * The single contact number for the business — WhatsApp and voice are the
 * same line.
 *
 * Stored in E.164 form without the leading "+", because that's what wa.me
 * requires. The `+` is added back for tel: links and for display.
 *
 * TODO: move to admin-configurable settings once that exists (spec §45),
 * so it can be changed without a deploy.
 */
const CONTACT_NUMBER_E164 = "923234628888";

/** For wa.me URLs — digits only, no "+", no spaces. */
export const WHATSAPP_NUMBER = CONTACT_NUMBER_E164;

/** For tel: links. */
export const PHONE_HREF = `+${CONTACT_NUMBER_E164}`;

/** Human-readable, grouped the way a Pakistani mobile number is written. */
export const PHONE_DISPLAY = "+92 323 462 8888";

/** Builds a wa.me link with a prefilled message. */
export function whatsAppLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
