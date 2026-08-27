import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getDb } from "@/lib/db/client";
import { createClient } from "@/lib/supabase/server";
import { HOMEPAGE_IMAGE_SLOTS } from "@/lib/website/homepage-slots";

export const dynamic = "force-dynamic";

/**
 * The one page to start from. Each area states what it's for and what's
 * currently in it, because the three are easy to confuse — particularly
 * Products (public storefront) versus Retail (private stock list).
 *
 * Counts are best-effort: a failure to reach either database shows the
 * card without a count rather than taking the whole dashboard down.
 */
async function getCounts() {
  const db = getDb();

  const [productCount, customisedSlots] = await Promise.all([
    db
      ? db.query.storefrontProducts
          .findMany({ columns: { id: true } })
          .then((r) => r.length)
          .catch(() => null)
      : Promise.resolve(null),
    db
      ? db.query.homepageImages
          .findMany({ columns: { id: true } })
          .then((r) => r.length)
          .catch(() => null)
      : Promise.resolve(null),
  ]);

  let retailCount: number | null = null;
  try {
    const supabase = await createClient();
    const { count } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true });
    retailCount = count ?? null;
  } catch {
    retailCount = null;
  }

  return { productCount, customisedSlots, retailCount, dbConnected: Boolean(db) };
}

export default async function AdminDashboard() {
  const { productCount, customisedSlots, retailCount, dbConnected } = await getCounts();

  const cards = [
    {
      href: "/admin/products",
      eyebrow: "Storefront",
      title: "Products",
      blurb:
        "Everything customers can buy. Name, price, sale price, sizes, description, tags and photos.",
      stat:
        productCount === null
          ? "Not connected"
          : `${productCount} ${productCount === 1 ? "product" : "products"}`,
      cta: "Manage products",
      live: true,
    },
    {
      href: "/admin/homepage",
      eyebrow: "Storefront",
      title: "Homepage",
      blurb:
        "The hero image and every photo down the homepage — category tiles, editorial sections, collections, Instagram grid.",
      stat:
        customisedSlots === null
          ? "Not connected"
          : `${customisedSlots} of ${HOMEPAGE_IMAGE_SLOTS.length} photos changed`,
      cta: "Manage photos",
      live: true,
    },
    {
      href: "/admin/catalog",
      eyebrow: "Internal",
      title: "Retail",
      blurb:
        "Your private stock list — name, colour, one photo, available or not. Never shown on the website.",
      stat:
        retailCount === null
          ? "Not connected"
          : `${retailCount} ${retailCount === 1 ? "piece" : "pieces"}`,
      cta: "Open Retail",
      live: false,
    },
  ];

  return (
    <>
      <AdminHeader current="/admin" />

      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10 sm:px-8">
        <div className="mb-10">
          <p className="u-caps text-brass-deep">Admin</p>
          <h1 className="font-display mt-4 text-3xl sm:text-4xl">Everything in one place.</h1>
        </div>

        {!dbConnected && (
          <p className="border-rust/40 bg-rust/5 text-rust mb-8 border p-4 text-sm">
            The storefront database isn&rsquo;t connected, so Products and Homepage can&rsquo;t
            save anything yet. Open Products for the setup steps.
          </p>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group border-line hover:border-brass hover:bg-surface flex flex-col border p-6 transition-colors"
            >
              <p className="u-caps text-muted">{card.eyebrow}</p>
              <h2 className="font-display group-hover:text-brass-deep mt-3 text-2xl transition-colors">
                {card.title}
              </h2>
              <p className="text-muted mt-3 flex-1 text-sm leading-relaxed">{card.blurb}</p>
              <p className="text-espresso mt-5 text-sm">{card.stat}</p>
              <span className="u-caps text-brass-deep mt-2 inline-block">
                {card.cta} &rarr;
              </span>
            </Link>
          ))}
        </div>

        <div className="border-line mt-12 border-t pt-8">
          <p className="u-caps text-muted">Shortcuts</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/admin/products/new" className="u-btn u-caps">
              Add a product
            </Link>
            <Link href="/admin/homepage" className="u-btn-ghost u-caps">
              Change the hero image
            </Link>
            <Link href="/" className="u-btn-ghost u-caps">
              View the website
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
