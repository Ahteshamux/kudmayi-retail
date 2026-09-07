import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/website/Breadcrumb";
import {
  BLOG_PRODUCT_IMAGES,
  LATEST_SHERWANI_DESIGNS_POST,
  SHERWANI_MISTAKES_POST,
  SHERWANI_VS_PRINCE_COAT_POST as post,
  WALIMA_GROOM_OUTFITS_POST,
} from "@/lib/website/blog";
import { GOOGLE_MAPS_URL, SITE_URL, STORE_ADDRESS } from "@/lib/website/constants";
import {
  JsonLd,
  blogPostingJsonLd,
  breadcrumbJsonLd,
} from "@/lib/website/json-ld";
import { whatsAppLink } from "@/lib/website/whatsapp";

const articleUrl = `${SITE_URL}${post.href}`;

export const metadata: Metadata = {
  title: { absolute: post.title },
  description: post.description,
  keywords: post.keywords,
  authors: [{ name: "Kudmayi", url: SITE_URL }],
  alternates: { canonical: articleUrl },
  openGraph: {
    title: post.title,
    description: post.description,
    url: articleUrl,
    siteName: "Kudmayi",
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    authors: [SITE_URL],
  },
  twitter: {
    card: "summary_large_image",
    title: post.title,
    description: post.description,
  },
};

const sourceClass =
  "text-brass-deep underline decoration-brass/50 underline-offset-4 hover:decoration-brass-deep";
const sectionClass = "scroll-mt-28 border-line border-t pt-10 sm:pt-12";

export default function SherwaniVsPrinceCoatArticle() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          { name: post.title, url: articleUrl },
        ])}
      />
      <JsonLd data={blogPostingJsonLd(post)} />

      <article className="pb-24 sm:pb-32">
        <header className="u-container pt-32 sm:pt-40">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              { label: post.category },
            ]}
          />

          <div className="mx-auto mt-10 max-w-4xl text-center">
            <p className="u-caps text-brass-deep">{post.category}</p>
            <h1 className="font-display mt-5 text-4xl leading-[1.08] sm:text-6xl lg:text-7xl">
              {post.title}
            </h1>
            <div className="text-muted mt-7 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm">
              <span>By Kudmayi</span>
              <span aria-hidden="true">·</span>
              <time dateTime={post.publishedAt}>{post.displayDate}</time>
              <span aria-hidden="true">·</span>
              <span>{post.readingTime}</span>
            </div>
          </div>

          <figure className="bg-well relative mx-auto mt-12 aspect-[4/5] max-w-4xl overflow-hidden sm:mt-16">
            <Image
              src={BLOG_PRODUCT_IMAGES.mirza.src}
              alt={BLOG_PRODUCT_IMAGES.mirza.alt}
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 896px"
              className="object-cover object-top"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-espresso/85 px-5 py-4 text-sm text-parchment backdrop-blur-sm">
              Mirza shows the shorter, tailored line that gives a prince coat its modern character.
            </figcaption>
          </figure>
        </header>

        <div className="u-container mt-12 sm:mt-16">
          <div className="mx-auto max-w-3xl space-y-10 text-[1.0625rem] leading-8">
            <div className="space-y-6">
              <p className="font-display text-2xl leading-9 text-espresso sm:text-3xl sm:leading-10">
                Choose a sherwani for the main ceremony when you want a long, formal
                silhouette with unmistakable groom presence. Choose a prince coat for a
                Walima, reception, engagement or modern Nikah when you want a shorter,
                sharper line and more ways to wear the piece again. If you are buying one
                outfit for a traditional Barat and cannot decide, the sherwani is the safer
                choice.
              </p>
              <p className="text-muted">
                The names can overlap between designers, so judge the garment in front of
                you. Look at its hem, structure and complete styling rather than relying on
                the label alone.
              </p>
            </div>

            <aside
              aria-labelledby="verdict-heading"
              className="border-brass bg-sand border-l-2 p-6 sm:p-8"
            >
              <h2 id="verdict-heading" className="u-caps text-brass-deep">
                The quick verdict
              </h2>
              <ul className="mt-5 space-y-3 text-base leading-7">
                <li><strong>Sherwani:</strong> more ceremonial, usually knee-length or below, strongest for a Barat.</li>
                <li><strong>Prince coat:</strong> usually shorter and more tailored, strongest for a Walima or reception.</li>
                <li><strong>One-outfit groom:</strong> choose by your most important event, not by which garment is currently popular.</li>
                <li><strong>Repeat wear:</strong> a cleaner prince coat is usually easier to restyle with different trousers or kurtas.</li>
              </ul>
            </aside>

            <nav aria-labelledby="contents-heading" className="border-line border-y py-7">
              <h2 id="contents-heading" className="u-caps text-muted">In this comparison</h2>
              <ol className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <li><a className={sourceClass} href="#at-a-glance">1. At a glance</a></li>
                <li><a className={sourceClass} href="#difference">2. The real difference</a></li>
                <li><a className={sourceClass} href="#ceremony">3. Choose by ceremony</a></li>
                <li><a className={sourceClass} href="#styling">4. Build the complete look</a></li>
                <li><a className={sourceClass} href="#rewear">5. Repeat wear</a></li>
                <li><a className={sourceClass} href="#decision">6. Six-question decision</a></li>
              </ol>
            </nav>

            <section id="at-a-glance" className={sectionClass}>
              <p className="u-caps text-brass-deep">Side by side</p>
              <h2 className="font-display mt-3 text-3xl leading-tight sm:text-4xl">
                Sherwani vs prince coat at a glance
              </h2>
              <div className="border-line mt-8 overflow-x-auto border">
                <table className="w-full min-w-[48rem] border-collapse text-left text-sm">
                  <thead className="bg-sand text-espresso">
                    <tr>
                      <th className="border-line border-b px-5 py-4 font-medium">Decision point</th>
                      <th className="border-line border-b px-5 py-4 font-medium">Sherwani</th>
                      <th className="border-line border-b px-5 py-4 font-medium">Prince coat</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted align-top">
                    {[
                      ["Length and cut", "Long, structured coat, usually to the knee or below", "Usually shorter, closer to a tailored jacket and fitted through the waist"],
                      ["Visual character", "Traditional and ceremonial", "Polished, tailored and contemporary"],
                      ["Best event", "Barat or a highly traditional Nikah", "Walima, reception, engagement or an intimate Nikah"],
                      ["Lower garment", "Churidar, pyjama or straight trousers", "Kurta pyjama, straight trousers or formal trousers"],
                      ["Accessories", "Khussa, turban, shawl, brooch or mala", "Formal shoes or khussa, with one quieter accessory"],
                      ["Movement", "Longer hem and dense work can need more management", "A shorter, lightly worked version can be easier for mingling"],
                      ["Repeat wear", "Usually reserved for weddings and major cultural events", "Often easier to wear again as a separate coat"],
                    ].map(([point, sherwani, princeCoat]) => (
                      <tr key={point}>
                        <th scope="row" className="border-line border-b px-5 py-4 font-medium text-espresso">{point}</th>
                        <td className="border-line border-b px-5 py-4">{sherwani}</td>
                        <td className="border-line border-b px-5 py-4">{princeCoat}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-muted mt-5 text-sm">
                These are practical conventions, not fixed definitions. Some designers use
                prince coat, prince jacket and bandhgala for overlapping shapes.
              </p>
            </section>

            <section id="difference" className={sectionClass}>
              <p className="u-caps text-brass-deep">Start with silhouette</p>
              <h2 className="font-display mt-3 text-3xl leading-tight sm:text-4xl">
                The real difference is length and visual formality
              </h2>
              <div className="text-muted mt-6 space-y-5">
                <p>
                  A sherwani draws a long vertical line from the standing collar towards the
                  knee. That length gives it greater ceremonial weight on a wedding stage and
                  separates the groom from guests in shorter jackets. A prince coat normally
                  ends higher, sits closer through the chest and waist, and reads more like
                  South Asian tailoring in conversation with a formal suit.
                </p>
                <p>
                  Karigur&rsquo;s {" "}
                  <a
                    className={sourceClass}
                    href="https://karigur.com/blogs/guides/groom-sherwani-guide"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    groom sherwani guide
                  </a>
                  {" "}describes the sherwani as knee-length or below and the prince coat as
                  shorter and closer to a tailored blazer. Sherwani King makes the same
                  distinction in its {" "}
                  <a
                    className={sourceClass}
                    href="https://sherwaniking.com/blogs/sherwani-vs-prince-coat-wedding-guide/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    2026 comparison
                  </a>
                  . Both are specialist brand sources, so their event advice is useful
                  convention rather than a rule every groom must follow.
                </p>
                <p>
                  Embroidery does not define the category. A sherwani can be almost plain,
                  and a prince coat can carry dense handwork. The cut should still be visible
                  after the surface detail is added.
                </p>
              </div>
            </section>

            <section id="ceremony" className={sectionClass}>
              <p className="u-caps text-brass-deep">Choose by function</p>
              <h2 className="font-display mt-3 text-3xl leading-tight sm:text-4xl">
                Which one belongs at each Pakistani wedding event?
              </h2>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {[
                  ["Barat", "Sherwani", "The longer coat gives the groom the strongest ceremonial presence for the main entrance and stage."],
                  ["Traditional Nikah", "Sherwani", "Choose a clean, lightly worked version if the ceremony is intimate or held during the day."],
                  ["Modern or daytime Nikah", "Prince coat", "A pale prince coat over a tonal kurta pyjama feels formal without carrying the full weight of a Barat look."],
                  ["Walima or reception", "Prince coat", "Its tailored line sits comfortably beside suits and evening formalwear and can be easier to move in."],
                  ["Engagement", "Prince coat", "A shorter coat creates distinction without using the groom's most ceremonial silhouette too early."],
                  ["Winter evening", "Either", "Let the formality decide, then choose velvet, jamawar or structured silk at a weight you can wear comfortably."],
                ].map(([event, pick, reason]) => (
                  <div key={event} className="border-line border bg-surface p-6">
                    <p className="u-caps text-brass-deep">{event}</p>
                    <h3 className="font-display mt-3 text-2xl text-espresso">{pick}</h3>
                    <p className="text-muted mt-3 text-sm leading-6">{reason}</p>
                  </div>
                ))}
              </div>
              <p className="text-muted mt-6">
                Arsalan Iqbal&rsquo;s official {" "}
                <a
                  className={sourceClass}
                  href="https://arsalaniqbal.com/collections/prince-coat-for-groom"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  prince coat collection
                </a>
                {" "}also positions the shorter coat for Walima and reception dressing. If
                your family or venue has a particular dress tradition, that custom matters
                more than a general fashion guide.
              </p>
            </section>

            <aside className="bg-bark px-6 py-8 text-parchment sm:px-8">
              <p className="u-caps text-brass">The simplest rule</p>
              <p className="font-display mt-4 text-2xl leading-9">
                Pick the ceremony first, the silhouette second and the embroidery third.
                Reversing that order is how grooms end up with a beautiful coat at the wrong event.
              </p>
              <Link href={LATEST_SHERWANI_DESIGNS_POST.href} className="u-btn mt-7">
                See the latest sherwani edit
              </Link>
            </aside>

            <p className="text-muted">
              Choosing specifically for the reception? The{` `}
              <Link href={WALIMA_GROOM_OUTFITS_POST.href} className={sourceClass}>
                Walima groom outfit comparison
              </Link>{` `}
              adds the suit as a third option and weighs all three against venue, climate
              and repeat wear.
            </p>

            <section id="styling" className={sectionClass}>
              <p className="u-caps text-brass-deep">Complete the outfit</p>
              <h2 className="font-display mt-3 text-3xl leading-tight sm:text-4xl">
                How each silhouette changes the rest of the look
              </h2>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <figure>
                  <Link href={BLOG_PRODUCT_IMAGES.shabEAswad.productHref} className="bg-well relative block aspect-[4/5] overflow-hidden">
                    <Image
                      src={BLOG_PRODUCT_IMAGES.shabEAswad.src}
                      alt={BLOG_PRODUCT_IMAGES.shabEAswad.alt}
                      fill
                      sizes="(max-width: 639px) 100vw, 384px"
                      className="object-cover object-top"
                    />
                  </Link>
                  <figcaption className="text-muted mt-3 text-sm leading-6">
                    Shab E Aswad: one dark colour family, a long sherwani line and a ceremonial turban.
                  </figcaption>
                </figure>
                <figure>
                  <Link href={BLOG_PRODUCT_IMAGES.mirza.productHref} className="bg-well relative block aspect-[4/5] overflow-hidden">
                    <Image
                      src={BLOG_PRODUCT_IMAGES.mirza.src}
                      alt={BLOG_PRODUCT_IMAGES.mirza.alt}
                      fill
                      sizes="(max-width: 639px) 100vw, 384px"
                      className="object-cover object-top"
                    />
                  </Link>
                  <figcaption className="text-muted mt-3 text-sm leading-6">
                    Mirza: a shorter camel coat, straight trousers and restrained gold detail.
                  </figcaption>
                </figure>
              </div>
              <div className="text-muted mt-7 space-y-5">
                <p>
                  A sherwani can carry a turban, shawl, khussa and mala because its long line
                  already establishes the outfit as ceremonial. That does not mean every
                  accessory must appear together. If the surface is heavily worked, choose
                  one leading accessory and allow the rest to support it.
                </p>
                <p>
                  A prince coat benefits from a cleaner finish. Pair a warm camel or ivory
                  coat with a tonal kurta pyjama for a Nikah, or move towards straight formal
                  trousers and polished shoes for a reception. Arsalan Iqbal&rsquo;s {" "}
                  <a
                    className={sourceClass}
                    href="https://arsalaniqbal.com/collections/kurta-pajama-with-prince-coat"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    prince coat sets
                  </a>
                  {" "}show both jacket-led and full traditional combinations, which is why
                  the category offers more styling flexibility.
                </p>
              </div>
            </section>

            <section id="rewear" className={sectionClass}>
              <p className="u-caps text-brass-deep">Think beyond one night</p>
              <h2 className="font-display mt-3 text-3xl leading-tight sm:text-4xl">
                Which garment gives you more repeat wear?
              </h2>
              <div className="text-muted mt-6 space-y-5">
                <p>
                  A prince coat is usually easier to wear again. The shorter length can be
                  combined with a plain kurta, a different trouser, or a shirt and formal
                  trousers when the design is clean enough. That makes it useful for future
                  weddings, Eid dinners and formal family events.
                </p>
                <p>
                  A sherwani has a narrower but more important role. It is built for the
                  occasions when you want full cultural ceremony. Choose it because it is
                  right for the main event, not because you expect it to become an everyday
                  coat. If value per wear is your leading concern and the event allows either
                  silhouette, the prince coat has the advantage.
                </p>
                <p>
                  This is a practical inference, not a rule. Dense embroidery, fragile cloth
                  or an unusual colour can make any prince coat difficult to restyle. A plain
                  sherwani can sometimes be more versatile than an ornate jacket.
                </p>
              </div>
            </section>

            <section id="decision" className={sectionClass}>
              <p className="u-caps text-brass-deep">Your answer in six questions</p>
              <h2 className="font-display mt-3 text-3xl leading-tight sm:text-4xl">
                Use this decision check before you order
              </h2>
              <ol className="text-muted mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {[
                  "Is this outfit for the main Barat entrance?",
                  "Does the setting feel traditional or contemporary?",
                  "Do you want a knee-length ceremonial line or a shorter tailored one?",
                  "Will you be sitting, greeting and dancing for several hours?",
                  "Do you already own the right shoes, lower garment and accessories?",
                  "Will repeat wear meaningfully affect the budget decision?",
                ].map((question, index) => (
                  <li key={question} className="border-line border-b pb-3">
                    <span className="text-brass-deep mr-2">{index + 1}.</span>{question}
                  </li>
                ))}
              </ol>
              <p className="text-muted mt-6">
                Mostly traditional, Barat and long silhouette answers point to a sherwani.
                Mostly reception, tailored and repeat-wear answers point to a prince coat.
                If you choose the sherwani, review the {" "}
                <Link href={SHERWANI_MISTAKES_POST.href} className={sourceClass}>
                  five mistakes to avoid before fitting
                </Link>
                .
              </p>
            </section>

            <section className={sectionClass} aria-labelledby="questions-heading">
              <p className="u-caps text-brass-deep">Quick answers</p>
              <h2 id="questions-heading" className="font-display mt-3 text-3xl sm:text-4xl">
                Common questions about sherwanis and prince coats
              </h2>
              <div className="mt-7 space-y-7">
                <div>
                  <h3 className="font-display text-xl">Is a prince coat the same as a sherwani?</h3>
                  <p className="text-muted mt-2">Usually not. A prince coat is normally shorter and more fitted, while a sherwani generally reaches the knee or below. Product names vary, so compare the actual cut.</p>
                </div>
                <div>
                  <h3 className="font-display text-xl">Can a groom wear a prince coat for the Nikah?</h3>
                  <p className="text-muted mt-2">Yes. A lightly worked ivory, champagne or muted prince coat over a tonal kurta pyjama is well suited to a daytime or intimate Nikah.</p>
                </div>
                <div>
                  <h3 className="font-display text-xl">Which is better for a Walima?</h3>
                  <p className="text-muted mt-2">A prince coat is often the easier Walima choice because its sharper line works naturally in a reception setting. A clean sherwani remains valid if you prefer a longer silhouette.</p>
                </div>
                <div>
                  <h3 className="font-display text-xl">Which is more comfortable?</h3>
                  <p className="text-muted mt-2">Construction matters more than the name. A shorter, lightly worked prince coat can be easier to move in, but lining, cloth, fit and embroidery weight decide the real comfort.</p>
                </div>
              </div>
            </section>

            <section className="border-brass bg-sand border p-7 sm:p-10" aria-labelledby="consultation-heading">
              <p className="u-caps text-brass-deep">Try both silhouettes</p>
              <h2 id="consultation-heading" className="font-display mt-4 text-3xl leading-tight">
                The mirror settles this decision faster than another saved photograph.
              </h2>
              <p className="text-muted mt-5">
                Visit Kudmayi at {STORE_ADDRESS} with your event, venue and bridal palette.
                Compare a sherwani and prince coat side by side before deciding where the
                wedding budget should go.
              </p>
              <div className="mt-7 flex flex-wrap gap-4">
                <Link
                  href={whatsAppLink("Hi Kudmayi, I'd like to compare a sherwani and prince coat in store.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="u-btn"
                >
                  Book a consultation
                </Link>
                <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="u-btn-ghost">
                  View the Lahore store
                </a>
              </div>
            </section>

            <footer className="border-line border-t pt-8 text-sm leading-6 text-muted">
              <p>
                This comparison uses published guidance from South Asian menswear specialists
                and Kudmayi&rsquo;s current product categories. Designer terminology varies, so
                confirm the exact length, construction and included pieces before ordering.
              </p>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
                <Link href="/shop/prince-coats" className={sourceClass}>Shop prince coats</Link>
                <Link href="/shop/sherwanis" className={sourceClass}>Shop sherwanis</Link>
                <Link href="/blog" className={sourceClass}>Return to the Kudmayi Journal</Link>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </>
  );
}
