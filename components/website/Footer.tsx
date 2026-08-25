import Link from "next/link";
import { InfoDialog } from "./InfoDialog";
import { SizeGuideContent } from "./SizeGuideContent";
import { whatsAppLink } from "@/lib/website/whatsapp";

const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Shop",
    links: [
      { label: "Sherwanis", href: "/shop/sherwanis" },
      { label: "Prince Coats", href: "/shop/prince-coats" },
      { label: "Waistcoats", href: "/shop/waistcoats" },
      { label: "Kurtas", href: "/shop/kurtas" },
      { label: "Suits", href: "/shop/suits" },
    ],
  },
  {
    heading: "Collections",
    links: [
      { label: "Wedding", href: "#collections" },
      { label: "Groom", href: "#collections" },
      { label: "Eid", href: "#collections" },
      { label: "Formal", href: "#collections" },
      { label: "New Arrivals", href: "#collections" },
    ],
  },
  {
    heading: "Custom",
    links: [
      { label: "Custom Kurtas", href: "/custom-kurta" },
      { label: "Bespoke", href: "#bespoke" },
    ],
  },
  {
    heading: "About",
    links: [{ label: "Our Story", href: "#story" }],
  },
];

function ShippingAndReturnsContent() {
  return (
    <>
      <p>
        Ready-to-ship pieces are dispatched within 3–5 working days across Pakistan.
        Made-to-order pieces are cut and finished within 3–4 weeks of confirmation.
        International shipping is available on request — message us on WhatsApp for
        a quote to your country.
      </p>
      <p>
        Altered or made-to-order pieces are final sale. Unaltered ready-to-ship
        pieces can be exchanged within 7 days of delivery.
      </p>
    </>
  );
}

function FaqContent() {
  const faqs = [
    {
      q: "How do I place an order?",
      a: "Browse the shop, add pieces to your cart, and check out — the order is sent to us on WhatsApp, where we confirm sizing, delivery, and payment with you directly.",
    },
    {
      q: "Can a piece be altered to my measurements?",
      a: "Yes — every piece can be tailored to your exact measurements at no extra cost before it ships. Send your measurements on WhatsApp after ordering.",
    },
    {
      q: "Do you ship internationally?",
      a: "Yes, on request. Message us on WhatsApp with your country for a shipping quote.",
    },
    {
      q: "What payment methods do you accept?",
      a: "Payment is arranged directly with you on WhatsApp once your order is confirmed.",
    },
  ];
  return (
    <div className="space-y-5">
      {faqs.map((faq) => (
        <div key={faq.q}>
          <p className="text-espresso font-medium">{faq.q}</p>
          <p className="mt-1">{faq.a}</p>
        </div>
      ))}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-line bg-surface border-t">
      <div className="u-container grid gap-10 py-14 sm:grid-cols-3 lg:grid-cols-5 lg:py-20">
        {COLUMNS.map((column) => (
          <div key={column.heading}>
            <p className="u-caps text-muted">{column.heading}</p>
            <ul className="mt-5 space-y-3">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-brass-deep text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <p className="u-caps text-muted">Help</p>
          <ul className="mt-5 space-y-3">
            <li>
              <InfoDialog
                trigger="Size Guide"
                title="Size Guide"
                triggerClassName="hover:text-brass-deep text-sm transition-colors"
              >
                <SizeGuideContent />
              </InfoDialog>
            </li>
            <li>
              <InfoDialog
                trigger="Shipping & Returns"
                title="Shipping & Returns"
                triggerClassName="hover:text-brass-deep text-sm transition-colors"
              >
                <ShippingAndReturnsContent />
              </InfoDialog>
            </li>
            <li>
              <InfoDialog
                trigger="FAQs"
                title="Frequently Asked Questions"
                triggerClassName="hover:text-brass-deep text-sm transition-colors"
              >
                <FaqContent />
              </InfoDialog>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-line u-container flex flex-col gap-6 border-t py-8 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-display text-lg tracking-[0.28em] uppercase">
          Kudmayi
        </span>

        <div className="text-muted flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link
            href={whatsAppLink("Hi Kudmayi, I have a question.")}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brass-deep transition-colors"
          >
            WhatsApp
          </Link>
          {/* TODO(pre-launch): placeholder phone/email — replace with real contact details. */}
          <a href="tel:+923001234567" className="hover:text-brass-deep transition-colors">
            +92 300 1234567
          </a>
          <a
            href="mailto:hello@kudmayi.com"
            className="hover:text-brass-deep transition-colors"
          >
            hello@kudmayi.com
          </a>
          <a
            href="https://instagram.com/kudmayi"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brass-deep transition-colors"
          >
            Instagram
          </a>
        </div>

        <span className="text-muted/70 text-xs">
          &copy; {new Date().getFullYear()} Kudmayi.
        </span>
      </div>
    </footer>
  );
}
