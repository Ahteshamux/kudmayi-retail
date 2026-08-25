// TODO(pre-launch): replace with the real Kudmayi WhatsApp number, and move
// this to admin-configurable settings once that exists (spec §45).
const WHATSAPP_NUMBER = "923001234567";

/** Builds a wa.me link with a prefilled message. */
export function whatsAppLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
