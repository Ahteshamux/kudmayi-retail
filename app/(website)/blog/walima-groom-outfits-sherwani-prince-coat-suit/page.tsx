import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/website/Breadcrumb";
import {
  BLOG_PRODUCT_IMAGES,
  LATEST_SHERWANI_DESIGNS_POST,
  NIKAH_DRESS_IDEAS_POST,
  SHERWANI_MISTAKES_POST,
  SHERWANI_VS_PRINCE_COAT_POST,
  WALIMA_GROOM_OUTFITS_POST as post,
  type BlogProductImage,
} from "@/lib/website/blog";
import { GOOGLE_MAPS_URL, SITE_URL, STORE_ADDRESS } from "@/lib/website/constants";
import { JsonLd, blogPostingJsonLd, breadcrumbJsonLd } from "@/lib/website/json-ld";
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

function ProductFigure({ image, caption }: { image: BlogProductImage; caption: string }) {
  return (
    <figure className="my-9">
      <div className="bg-well relative aspect-[4/5] overflow-hidden">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 767px) 100vw, 768px"
          className="object-cover object-top"
        />
      </div>
      <figcaption className="text-muted mt-3 text-sm leading-6">
        {caption}{" "}
        <Link href={image.productHref} className={sourceClass}>
          View {image.productName}
        </Link>
      </figcaption>
    </figure>
  );
}

export default function WalimaGroomOutfitsArticle() {
  const breadcrumbs = [
    { name: "Home", url: SITE_URL },
    { name: "Blog", url: `${SITE_URL}/blog` },
    { name: post.title, url: articleUrl },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
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
              src={BLOG_PRODUCT_IMAGES.tajdaar.src}
              alt={BLOG_PRODUCT_IMAGES.tajdaar.alt}
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 896px"
              className="object-cover object-top"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-espresso/85 px-5 py-4 text-sm text-parchment backdrop-blur-sm">
              A tonal black prince coat is one confident evening-Walima direction.{" "}
              <Link
                href={BLOG_PRODUCT_IMAGES.tajdaar.productHref}
                className="underline decoration-brass/60 underline-offset-4"
              >
                View Tajdaar
              </Link>
            </figcaption>
          </figure>
        </header>

        <div className="u-container mt-12 sm:mt-16">
          <div className="mx-auto max-w-3xl space-y-10 text-[1.0625rem] leading-8">
            <div className="space-y-6">
              <p className="font-display text-2xl leading-9 text-espresso sm:text-3xl sm:leading-10">
                A suit is not compulsory for the Walima. Choose a sherwani when you want the
                reception to retain a strong heritage presence, a prince coat when you want
                South Asian formality with a shorter tailored line, and a suit when the event
                has an intentionally Western or black-tie character. Venue, season, fit and
                the bride&rsquo;s outfit should settle the choice.
              </p>
              <p className="text-muted">
                Real grooms are often negotiating expectations as much as clothes. In one{` `}
                <a
                  className={sourceClass}
                  href="https://www.reddit.com/r/pakistan/comments/1qgybr3/does_the_groom_need_to_be_in_a_suit/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  r/pakistan discussion
                </a>
                , a Lahore groom planning a heritage setting questioned the assumed
                three-piece-suit rule. Another{` `}
                <a
                  className={sourceClass}
                  href="https://www.reddit.com/r/DesiWeddings/comments/1uxghnv/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  r/DesiWeddings thread
                </a>{` `}
                weighed sherwani, prince coat and tuxedo with limited time for alterations.
                These accounts reveal the decision pressure; they do not define Pakistani custom.
              </p>
            </div>

            <aside aria-labelledby="verdict-heading" className="border-brass bg-sand border-l-2 p-6 sm:p-8">
              <h2 id="verdict-heading" className="u-caps text-brass-deep">The quick verdict</h2>
              <ul className="mt-5 space-y-3 text-base leading-7">
                <li><strong>Sherwani:</strong> strongest for a grand, traditional or heritage-led Walima.</li>
                <li><strong>Prince coat:</strong> the most flexible balance of cultural and tailored formality.</li>
                <li><strong>Suit:</strong> best for a Western reception aesthetic and the easiest option to rewear.</li>
                <li>A tuxedo belongs only when the couple has chosen a genuinely black-tie event.</li>
              </ul>
            </aside>

            <nav aria-labelledby="contents-heading" className="border-line border-y py-7">
              <h2 id="contents-heading" className="u-caps text-muted">In this comparison</h2>
              <ul className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <li><a className={sourceClass} href="#at-a-glance">Options at a glance</a></li>
                <li><a className={sourceClass} href="#sherwani">Choose a sherwani</a></li>
                <li><a className={sourceClass} href="#prince-coat">Choose a prince coat</a></li>
                <li><a className={sourceClass} href="#suit">Choose a suit</a></li>
                <li><a className={sourceClass} href="#venue-season">Venue and season</a></li>
                <li><a className={sourceClass} href="#outfit-formulas">Complete outfit formulas</a></li>
              </ul>
            </nav>

            <section id="at-a-glance" className={sectionClass}>
              <p className="u-caps text-brass-deep">Compare the role</p>
              <h2 className="font-display mt-3 text-3xl leading-tight sm:text-4xl">
                Sherwani, prince coat and suit at a glance
              </h2>
              <div className="border-line mt-8 overflow-x-auto border">
                <table className="w-full min-w-[54rem] border-collapse text-left text-sm">
                  <thead className="bg-sand text-espresso">
                    <tr>
                      <th className="border-line border-b px-5 py-4 font-medium">Decision</th>
                      <th className="border-line border-b px-5 py-4 font-medium">Sherwani</th>
                      <th className="border-line border-b px-5 py-4 font-medium">Prince coat</th>
                      <th className="border-line border-b px-5 py-4 font-medium">Suit</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted align-top">
                    <tr><td className="border-line border-b px-5 py-4">Visual character</td><td className="border-line border-b px-5 py-4">Ceremonial and heritage-led</td><td className="border-line border-b px-5 py-4">Cultural and sharply tailored</td><td className="border-line border-b px-5 py-4">Western formal</td></tr>
                    <tr><td className="border-line border-b px-5 py-4">Strongest venue</td><td className="border-line border-b px-5 py-4">Palace, haveli or grand hall</td><td className="border-line border-b px-5 py-4">Hotel, marquee or modern hall</td><td className="border-line border-b px-5 py-4">Ballroom or black-tie reception</td></tr>
                    <tr><td className="border-line border-b px-5 py-4">Movement</td><td className="border-line border-b px-5 py-4">Depends on length and work</td><td className="border-line border-b px-5 py-4">Usually easier in a shorter cut</td><td className="border-line border-b px-5 py-4">Good when correctly tailored</td></tr>
                    <tr><td className="border-line border-b px-5 py-4">Repeat wear</td><td className="border-line border-b px-5 py-4">Reserved for major occasions</td><td className="border-line border-b px-5 py-4">Can be restyled with different lowers</td><td className="border-line border-b px-5 py-4">Usually the easiest to reuse</td></tr>
                    <tr><td className="px-5 py-4">Best reason to choose</td><td className="px-5 py-4">Maximum cultural ceremony</td><td className="px-5 py-4">Balanced versatility</td><td className="px-5 py-4">Clean Western reception look</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted mt-6">
                Product names overlap between designers, so judge the actual hem, structure
                and lower garment. The detailed{` `}
                <Link href={SHERWANI_VS_PRINCE_COAT_POST.href} className={sourceClass}>
                  sherwani versus prince coat guide
                </Link>{` `}
                explains those construction differences beyond the Walima setting.
              </p>
            </section>

            <section id="sherwani" className={sectionClass}>
              <p className="u-caps text-brass-deep">Option one</p>
              <h2 className="font-display mt-3 text-3xl leading-tight sm:text-4xl">
                Choose a sherwani for heritage and ceremony
              </h2>
              <ProductFigure
                image={BLOG_PRODUCT_IMAGES.sangEMarmar}
                caption="Sang E Marmar uses a silver-grey base and controlled geometric embroidery for a cooler Walima palette."
              />
              <div className="text-muted space-y-5">
                <p>
                  A sherwani is strongest when the Walima is grand, the venue has historical
                  character or the groom wants traditional dress to remain central after the
                  Barat. The Royal Ontario Museum describes the sherwani as a structured South
                  Asian jacket worn at weddings and social functions in its{` `}
                  <a
                    className={sourceClass}
                    href="https://www.rom.on.ca/magazine/sherwani"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    fashion history
                  </a>
                  . That context explains its ceremonial weight without turning it into a
                  mandatory Walima uniform.
                </p>
                <p>
                  Make the Walima sherwani distinct from the Barat. If the first outfit was
                  warm gold or maroon, move towards silver-grey, cool ivory, charcoal or deep
                  green. Reduce the turban and jewellery, or exchange dense metalwork for
                  texture and tonal thread. A recent Lahore example covered by{` `}
                  <a
                    className={sourceClass}
                    href="https://images.dawn.com/news/1194751/decoding-junaid-safdar-and-shanzeh-ali-rohales-regal-looks"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Dawn Images
                  </a>{` `}
                  paired a grey sherwani with a lilac and silver bridal look, demonstrating
                  that a suit is not the only contemporary reception option.
                </p>
              </div>
            </section>

            <section id="prince-coat" className={sectionClass}>
              <p className="u-caps text-brass-deep">Option two</p>
              <h2 className="font-display mt-3 text-3xl leading-tight sm:text-4xl">
                Choose a prince coat for the most adaptable middle ground
              </h2>
              <ProductFigure
                image={BLOG_PRODUCT_IMAGES.chandni}
                caption="Chandni combines a shorter coat line with silver tonal work and an ivory foundation."
              />
              <div className="text-muted space-y-5">
                <p>
                  A prince coat gives the groom visible occasion without repeating the long
                  Barat silhouette. It can sit over kurta pyjama for a cultural look or over
                  straight formal trousers for a sharper reception. This makes it especially
                  useful for a hotel, marquee or contemporary hall where the couple wants a
                  formal evening without choosing full Western black tie.
                </p>
                <p>
                  Arsalan Iqbal&rsquo;s current{` `}
                  <a
                    className={sourceClass}
                    href="https://arsalaniqbal.com/collections/prince-coat-for-groom"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    prince coat collection
                  </a>{` `}
                  describes the category as shorter than a typical sherwani and positions it
                  for Walima and reception wear. That is useful designer evidence, not a
                  universal etiquette rule. The coat still has to agree with the venue,
                  bridal palette and the groom&rsquo;s preferred level of tradition.
                </p>
              </div>
            </section>

            <section id="suit" className={sectionClass}>
              <p className="u-caps text-brass-deep">Option three</p>
              <h2 className="font-display mt-3 text-3xl leading-tight sm:text-4xl">
                Choose a suit for an intentionally Western reception
              </h2>
              <div className="text-muted mt-6 space-y-5">
                <p>
                  A navy, charcoal or deep brown suit works when the venue, invitation and
                  couple&rsquo;s styling already speak the language of Western formalwear. It is
                  also the easiest choice to rewear. The trade-off is cultural presence. A
                  generic office suit can make the groom look like another guest, so the cut,
                  cloth and finishing need to feel deliberately ceremonial.
                </p>
                <p>
                  Do not call every dark suit a tuxedo. The Emily Post Institute&rsquo;s{` `}
                  <a
                    className={sourceClass}
                    href="https://emilypost.com/advice/black-tie-dress-code"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    black-tie guide
                  </a>{` `}
                  defines black tie around a dinner jacket, formal shirt, bow tie and formal
                  footwear; black-tie optional also permits a dark suit. Apply that convention
                  only when the couple wants a Western dress code. It should not be imported
                  as a rule for every Pakistani Walima.
                </p>
                <p>
                  A suit can still carry identity through one controlled detail: an heirloom
                  brooch, ajrak pocket square, locally made footwear or a shirt colour tied to
                  the bridal look. One detail is enough. Several unrelated cultural accents
                  can make the outfit feel assembled rather than designed.
                </p>
              </div>
            </section>

            <section id="venue-season" className={sectionClass}>
              <p className="u-caps text-brass-deep">The practical filter</p>
              <h2 className="font-display mt-3 text-3xl leading-tight sm:text-4xl">
                Let venue, season and movement overrule the mood board
              </h2>
              <div className="text-muted mt-6 space-y-5">
                <p>
                  Outdoor heat changes the answer. A long lined sherwani, shawl and turban
                  may look excellent in a still photograph and become difficult after an
                  hour of greetings. A summer{` `}
                  <a
                    className={sourceClass}
                    href="https://www.reddit.com/r/PakistanFashionAdvice/comments/1vohziq/summer_wedding_fit/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    r/PakistanFashionAdvice discussion
                  </a>{` `}
                  centred on jacket fit, sleeves, shirt choice and whether a lighter cloth
                  would have been more comfortable. Those concerns apply across all three
                  outfit categories.
                </p>
                <p>
                  Suitsupply&rsquo;s{` `}
                  <a
                    className={sourceClass}
                    href="https://suitsupply.com/en-us/journal/formal-wedding-attire-for-men.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    formal wedding-attire guidance
                  </a>{` `}
                  recommends climate-aware cloth choices and warns against heavy dark cloth
                  outdoors. For South Asian clothes, apply the same principle to the entire
                  construction: outer fabric, lining, embroidery, lower garment and shawl.
                  Air conditioning does not help during outdoor portraits or the arrival.
                </p>
                <p>
                  Movement matters as much as temperature. Button the outfit, sit for ten
                  minutes, climb a step, greet someone with both arms and walk in the actual
                  shoes. A prince coat is not comfortable merely because it is shorter, and a
                  suit is not comfortable merely because it is familiar. Construction wins.
                </p>
              </div>
            </section>

            <section id="outfit-formulas" className={sectionClass}>
              <p className="u-caps text-brass-deep">Complete looks</p>
              <h2 className="font-display mt-3 text-3xl leading-tight sm:text-4xl">
                Four Walima outfit formulas that stay coherent
              </h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  ["Cool ceremonial", "Silver-grey sherwani, tonal trousers, ivory turban, one silver brooch and restrained khussa."],
                  ["Modern Pakistani", "Ivory or silver prince coat, tonal kurta pyjama, polished khussa and no additional shawl."],
                  ["Evening depth", "Black or emerald prince coat, black trousers, one metal accent and polished black footwear."],
                  ["Western formal", "Navy or charcoal suit, white shirt, silk tie or bow tie, pocket square and polished Oxfords."],
                ].map(([title, copy]) => (
                  <div key={title} className="border-line border bg-surface p-6">
                    <h3 className="font-display text-xl text-espresso">{title}</h3>
                    <p className="text-muted mt-3 text-sm leading-6">{copy}</p>
                  </div>
                ))}
              </div>
              <p className="text-muted mt-6">
                If the bridal outfit already carries silver, lilac or cool crystal work,
                repeat the metal temperature rather than the exact colour. For warm gold,
                rust or maroon, camel, ivory and antique metal accents can connect the two
                looks. The current{` `}
                <Link href={LATEST_SHERWANI_DESIGNS_POST.href} className={sourceClass}>
                  sherwani design guide
                </Link>{` `}
                shows four complete colour directions using Kudmayi pieces.
              </p>
            </section>

            <section className={sectionClass} aria-labelledby="fitting-heading">
              <p className="u-caps text-brass-deep">Before approving the outfit</p>
              <h2 id="fitting-heading" className="font-display mt-3 text-3xl sm:text-4xl">
                Protect enough time for alterations
              </h2>
              <p className="text-muted mt-6">
                The category cannot rescue a poor fit. Confirm shoulder position, collar
                comfort, chest closure, sleeve length, trouser break and sitting movement.
                If the outfit is being ordered from abroad, request finished garment
                measurements rather than relying only on S, M or L. Keep a local alteration
                appointment and a simpler backup. The{` `}
                <Link href={SHERWANI_MISTAKES_POST.href} className={sourceClass}>
                  complete fitting and ordering checklist
                </Link>{` `}
                explains what to settle before handwork begins.
              </p>
            </section>

            <section className={sectionClass} aria-labelledby="questions-heading">
              <p className="u-caps text-brass-deep">Quick answers</p>
              <h2 id="questions-heading" className="font-display mt-3 text-3xl sm:text-4xl">
                Questions Pakistani grooms ask about Walima outfits
              </h2>
              <div className="mt-7 space-y-7">
                <div><h3 className="font-display text-xl">Does a Walima groom have to wear a suit?</h3><p className="text-muted mt-2">No. A sherwani, prince coat and suit can all be appropriate. Choose according to the couple&rsquo;s intended dress language, venue and level of cultural formality.</p></div>
                <div><h3 className="font-display text-xl">Which option is easiest to rewear?</h3><p className="text-muted mt-2">A dark suit is usually easiest to reuse. A clean prince coat comes next because it can be paired with different kurtas or trousers. A highly ceremonial sherwani has fewer repeat settings.</p></div>
                <div><h3 className="font-display text-xl">Can a groom wear black for the Walima?</h3><p className="text-muted mt-2">Yes, especially for an evening event. Use visible texture, check the cloth under venue lighting and add one lighter or metallic element near the face.</p></div>
                <div><h3 className="font-display text-xl">How should the Walima differ from the Nikah?</h3><p className="text-muted mt-2">Give each event its own silhouette or colour temperature. The{` `}<Link href={NIKAH_DRESS_IDEAS_POST.href} className={sourceClass}>Nikah outfit guide</Link>{` `}offers lighter and more intimate directions that can contrast with a formal evening Walima.</p></div>
              </div>
            </section>

            <section className="border-brass bg-sand border p-7 sm:p-10" aria-labelledby="consultation-heading">
              <p className="u-caps text-brass-deep">Compare the silhouettes</p>
              <h2 id="consultation-heading" className="font-display mt-4 text-3xl leading-tight">
                Try the formal options before making the category decision.
              </h2>
              <p className="text-muted mt-5">
                Visit Kudmayi at {STORE_ADDRESS} with the venue, ceremony time and bridal
                palette. A side-by-side fitting will show whether your Walima needs the
                length of a sherwani or the shorter structure of a prince coat.
              </p>
              <div className="mt-7 flex flex-wrap gap-4">
                <Link href={whatsAppLink("Hi Kudmayi, I'd like help choosing my Walima outfit.")} target="_blank" rel="noopener noreferrer" className="u-btn">Book a consultation</Link>
                <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="u-btn-ghost">View the Lahore store</a>
              </div>
            </section>

            <footer className="border-line border-t pt-8 text-sm leading-6 text-muted">
              <p>
                This research-only comparison uses museum, etiquette, tailoring and designer
                sources for factual context. Reddit discussions informed the practical
                questions, not the claims about dress codes or Pakistani custom. Product
                photographs show current Kudmayi pieces.
              </p>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
                <Link href="/shop/sherwanis" className={sourceClass}>Shop sherwanis</Link>
                <Link href="/shop/prince-coats" className={sourceClass}>Shop prince coats</Link>
                <Link href="/shop/suits" className={sourceClass}>Shop suits</Link>
                <Link href="/blog" className={sourceClass}>Return to the Kudmayi Journal</Link>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </>
  );
}
