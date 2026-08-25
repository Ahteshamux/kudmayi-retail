import Link from "next/link";
import { Reveal } from "./Reveal";
import { whatsAppLink } from "@/lib/website/whatsapp";

const STEPS = [
  "Consultation",
  "Design",
  "Fabric",
  "Measurements",
  "Production",
  "Delivery",
];

export function BespokeTeaser() {
  return (
    <section id="bespoke" aria-labelledby="bespoke-heading" className="u-section">
      <div className="u-container">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="u-caps text-brass-deep">Bespoke</p>
          <h2 id="bespoke-heading" className="font-display mt-4 text-3xl sm:text-4xl">
            Bespoke by Kudmayi.
          </h2>
          <p className="text-muted mt-5">
            A fully personal process, from first sketch to final fitting.
          </p>
          <Link
            href={whatsAppLink(
              "Hi Kudmayi, I'd like to book a bespoke consultation.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="u-btn u-caps mt-8 inline-flex"
          >
            Book a Consultation
          </Link>
        </Reveal>

        {/* Desktop: horizontal rail with hairline connectors. Mobile:
            vertical numbered list. */}
        <ol className="mt-14 hidden lg:flex lg:items-start lg:justify-between">
          {STEPS.map((step, i) => (
            <li key={step} className="flex flex-1 items-center last:flex-none">
              <div className="text-center">
                <span className="font-display text-brass-deep text-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="u-caps mt-2">{step}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="bg-line mx-4 h-px flex-1" aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>

        <ol className="mt-12 space-y-0 lg:hidden">
          {STEPS.map((step, i) => (
            <li
              key={step}
              className="border-line flex items-center gap-4 border-t py-4 last:border-b"
            >
              <span className="font-display text-brass-deep text-sm">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="u-caps">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
