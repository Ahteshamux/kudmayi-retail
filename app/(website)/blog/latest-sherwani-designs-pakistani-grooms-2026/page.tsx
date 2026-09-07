import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/website/Breadcrumb";
import {
  BLOG_PRODUCT_IMAGES,
  LATEST_SHERWANI_DESIGNS_POST as post,
  NIKAH_DRESS_IDEAS_POST,
  SHERWANI_MISTAKES_POST,
  SHERWANI_VS_PRINCE_COAT_POST,
  type BlogProductImage,
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

function ProductFigure({
  image,
  caption,
}: {
  image: BlogProductImage;
  caption: string;
}) {
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

export default function LatestSherwaniDesignsArticle() {
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
              src={BLOG_PRODUCT_IMAGES.zarrEShaan.src}
              alt={BLOG_PRODUCT_IMAGES.zarrEShaan.alt}
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 896px"
              className="object-cover object-top"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-espresso/85 px-5 py-4 text-sm text-parchment backdrop-blur-sm">
              Zarr E Shaan shows the warm ivory-gold direction at its most ceremonial. {" "}
              <Link
                href={BLOG_PRODUCT_IMAGES.zarrEShaan.productHref}
                className="underline decoration-brass/60 underline-offset-4"
              >
                View the piece
              </Link>
            </figcaption>
          </figure>
        </header>

        <div className="u-container mt-12 sm:mt-16">
          <div className="mx-auto max-w-3xl space-y-10 text-[1.0625rem] leading-8">
            <div className="space-y-6">
              <p className="font-display text-2xl leading-9 text-espresso sm:text-3xl sm:leading-10">
                The clearest sherwani direction for Pakistani grooms in 2026 is
                controlled richness: a clean, confident silhouette with one deliberate
                surface treatment. Ivory-gold remains strong, but tonal black, silver-grey
                and deep emerald now give grooms serious alternatives. The useful question
                is not which colour is trending. It is which version belongs to your event,
                your complexion and the way you want to look in photographs.
              </p>
              <p className="text-muted">
                This edit combines four photographs from Kudmayi&rsquo;s current sherwani
                catalogue with recently published guidance from Pakistani menswear houses.
                Those designer reports show direction, not nationwide sales data, so use
                them as a starting point rather than a rulebook.
              </p>
            </div>

            <aside
              aria-labelledby="takeaways-heading"
              className="border-brass bg-sand border-l-2 p-6 sm:p-8"
            >
              <h2 id="takeaways-heading" className="u-caps text-brass-deep">
                The 2026 edit
              </h2>
              <ul className="mt-5 space-y-3 text-base leading-7">
                <li>Ivory and light gold feel current when the embroidery stays tonal.</li>
                <li>Black works best at night, where texture keeps it from looking flat.</li>
                <li>Silver-grey gives a cooler alternative to cream without losing ceremony.</li>
                <li>Emerald and bottle green suit grooms who want colour with traditional weight.</li>
                <li>Fit and visual balance matter more than copying a trend exactly.</li>
              </ul>
            </aside>

            <nav aria-labelledby="contents-heading" className="border-line border-y py-7">
              <h2 id="contents-heading" className="u-caps text-muted">
                In this edit
              </h2>
              <ol className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <li><a className={sourceClass} href="#what-is-current">1. What looks current now</a></li>
                <li><a className={sourceClass} href="#ivory-gold">2. Ivory and light gold</a></li>
                <li><a className={sourceClass} href="#tonal-black">3. Tonal black</a></li>
                <li><a className={sourceClass} href="#silver-grey">4. Silver-grey</a></li>
                <li><a className={sourceClass} href="#emerald">5. Deep emerald</a></li>
                <li><a className={sourceClass} href="#choose-yours">6. How to choose yours</a></li>
              </ol>
            </nav>

            <section id="what-is-current" className={sectionClass}>
              <p className="u-caps text-brass-deep">The wider picture</p>
              <h2 className="font-display mt-3 text-3xl leading-tight sm:text-4xl">
                What actually looks current in 2026?
              </h2>
              <div className="text-muted mt-6 space-y-5">
                <p>
                  Current groomwear is moving in two directions at once. One side is light,
                  tonal and precise: ivory, champagne and pale gold with embroidery that
                  sits close to the base colour. The other is dark and assured: black,
                  maroon and bottle green with controlled shine. Both rely on cleaner cuts
                  and a more intentional finish than an outfit covered in unrelated motifs.
                </p>
                <p>
                  The House of Arsalan Iqbal described cleaner cuts and balanced embroidery in
                  its {" "}
                  <a
                    className={sourceClass}
                    href="https://arsalaniqbal.com/blogs/news/the-best-sherwani-styles-for-the-modern-groom"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    August 20, 2026 sherwani guide
                  </a>
                  . Its July sherwani report also highlighted tone-on-tone embroidery,
                  raw silk and deep colours. Lajwanti&rsquo;s {" "}
                  <a
                    className={sourceClass}
                    href="https://lajwantiofficial.com/blogs/news/sherwani-colours-guide-black-white-golden-maroon"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    August 26, 2026 colour guide
                  </a>
                  {" "}presents maroon, bottle green, white, gold and black as event-led options.
                  Together, these sources support variety rather than one compulsory shade.
                </p>
                <p>
                  A current collection page gives that editorial language a useful visual
                  check. Deepak Perwani&rsquo;s {" "}
                  <a
                    className={sourceClass}
                    href="https://www.deepakperwani.com/men"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    live menswear edit
                  </a>
                  {" "}places minimalist ivory, tonal black, champagne, silver and a
                  front-open black sherwani in the same new-arrivals group. That is stronger
                  evidence for a broad 2026 palette than any claim that one colour has won.
                </p>
              </div>
            </section>

            <section id="ivory-gold" className={sectionClass}>
              <p className="u-caps text-brass-deep">Direction one</p>
              <h2 className="font-display mt-3 text-3xl leading-tight sm:text-4xl">
                Ivory and light gold, with less contrast
              </h2>
              <div className="text-muted mt-6 space-y-5">
                <p>
                  Ivory-gold is still the most flexible ceremonial palette because it sits
                  beside red, maroon, rust, blush and many pastel bridal looks without
                  becoming a copy of them. The modern adjustment is restraint. Keep the
                  thread, beads and metalwork close in temperature, then let the texture
                  reveal itself as the groom moves.
                </p>
                <p>
                  Zarr E Shaan uses warm ivory with gold handwork and a cream turban, so the
                  outfit reads as one long line. It is a strong Barat direction when the
                  bride is wearing a deeper colour. For a daytime Nikah, the same palette can
                  be simplified by reducing jewellery and keeping the turban lower.
                </p>
              </div>
            </section>

            <section id="tonal-black" className={sectionClass}>
              <p className="u-caps text-brass-deep">Direction two</p>
              <h2 className="font-display mt-3 text-3xl leading-tight sm:text-4xl">
                Tonal black that depends on texture
              </h2>
              <ProductFigure
                image={BLOG_PRODUCT_IMAGES.shabEAswad}
                caption="Black-on-black beadwork gives Shab E Aswad depth without adding another colour."
              />
              <div className="text-muted space-y-5">
                <p>
                  Black feels sharpest for an evening Barat or Walima where the lighting can
                  pick up beads, sequins and tonal thread. A flat black cloth can lose detail
                  in photographs, so the surface needs variation. The answer is not bright
                  contrast. It is texture placed where the face and shoulders receive light.
                </p>
                <p>
                  Shab E Aswad keeps the collar, body and turban in one dark family. The
                  close black embellishment catches light only at certain angles, which gives
                  the look presence without turning it into a gold-and-black costume. Pair it
                  with black trousers for a continuous line, or soften it with an antique
                  metal brooch rather than several competing accessories.
                </p>
              </div>
            </section>

            <aside className="bg-bark px-6 py-8 text-parchment sm:px-8">
              <p className="u-caps text-brass">A useful trend filter</p>
              <p className="font-display mt-4 text-2xl leading-9">
                If the look depends on a filter, a pose or a particular light, it is not yet
                a wardrobe decision. Test the cloth beside your face in daylight first.
              </p>
            </aside>

            <section id="silver-grey" className={sectionClass}>
              <p className="u-caps text-brass-deep">Direction three</p>
              <h2 className="font-display mt-3 text-3xl leading-tight sm:text-4xl">
                Silver-grey for a cooler, quieter ceremony
              </h2>
              <ProductFigure
                image={BLOG_PRODUCT_IMAGES.sangEMarmar}
                caption="Sang E Marmar uses a silver-grey base and repeated geometric handwork."
              />
              <div className="text-muted space-y-5">
                <p>
                  Silver-grey offers the formality of a pale sherwani without the warmth of
                  cream or gold. It works particularly well with cool ivory, lavender, blue,
                  silver and jewel-toned bridal palettes. The exact grey should be tested
                  beside the groom&rsquo;s face in daylight and warm venue light, since undertone,
                  cloth sheen and photography can change how the same shade reads.
                </p>
                <p>
                  Sang E Marmar shows how repeated geometry can replace a large central
                  motif. Because the embroidery covers the surface evenly, the rest of the
                  styling can stay quiet. A plain trouser and one ring are enough. This is the
                  kind of design that suits a modern indoor Barat or a formal Walima where
                  the groom wants ceremony without traditional gold.
                </p>
              </div>
            </section>

            <section id="emerald" className={sectionClass}>
              <p className="u-caps text-brass-deep">Direction four</p>
              <h2 className="font-display mt-3 text-3xl leading-tight sm:text-4xl">
                Deep emerald with a traditional finish
              </h2>
              <ProductFigure
                image={BLOG_PRODUCT_IMAGES.shehnai}
                caption="Shehnai pairs rich emerald velvet with antique-gold motifs and an ivory turban."
              />
              <div className="text-muted space-y-5">
                <p>
                  Emerald is the clearest option here for a groom who wants colour. It has
                  enough depth for evening light and enough warmth to sit beside ivory,
                  champagne, gold and many red bridal looks. Velvet increases its visual
                  weight, so it makes most sense for a cooler evening or a winter wedding.
                </p>
                <p>
                  The Shehnai photograph also shows why spacing matters. Its motifs are bold,
                  but the green cloth remains visible between them. The ivory turban lifts the
                  look near the face and keeps the outfit from becoming one dark block. For a
                  simpler version, keep the same colour relationship and remove the larger
                  jewellery pieces.
                </p>
              </div>
            </section>

            <section className={sectionClass}>
              <p className="u-caps text-brass-deep">Fabric and finish</p>
              <h2 className="font-display mt-3 text-3xl leading-tight sm:text-4xl">
                Match the trend to the event, not just the mood board
              </h2>
              <p className="text-muted mt-6">
                Amir Adnan&rsquo;s current {" "}
                <a
                  className={sourceClass}
                  href="https://amiradnan.com/blogs/custom-blog/groom-code-collection-premium-wedding-wear-for-men-by-amir-adnan"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Groom Code collection notes
                </a>
                {" "}silk, velvet, jacquard and brocade alongside zardozi, dabka, sequins and
                thread work. That range matters because no finish suits every room or season.
              </p>

              <div className="border-line mt-8 overflow-x-auto border">
                <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
                  <thead className="bg-sand text-espresso">
                    <tr>
                      <th className="border-line border-b px-5 py-4 font-medium">Wedding setting</th>
                      <th className="border-line border-b px-5 py-4 font-medium">Strong direction</th>
                      <th className="border-line border-b px-5 py-4 font-medium">Keep controlled</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted align-top">
                    <tr>
                      <td className="border-line border-b px-5 py-4">Daytime Nikah</td>
                      <td className="border-line border-b px-5 py-4">Ivory, pale gold or silver-grey in raw silk</td>
                      <td className="border-line border-b px-5 py-4">Heavy stones and dark velvet</td>
                    </tr>
                    <tr>
                      <td className="border-line border-b px-5 py-4">Evening Barat</td>
                      <td className="border-line border-b px-5 py-4">Ivory-gold, tonal black or emerald</td>
                      <td className="border-line border-b px-5 py-4">Too many contrast colours</td>
                    </tr>
                    <tr>
                      <td className="border-line border-b px-5 py-4">Winter wedding</td>
                      <td className="border-line border-b px-5 py-4">Velvet, jamawar or brocade in deep tones</td>
                      <td className="border-line border-b px-5 py-4">Overheating under dense lining</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-4">Walima</td>
                      <td className="px-5 py-4">Silver-grey, black or a cleaner ivory finish</td>
                      <td className="px-5 py-4">Repeating the full Barat look</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted mt-6">
                If the ceremony is the Nikah, use the{` `}
                <Link href={NIKAH_DRESS_IDEAS_POST.href} className={sourceClass}>
                  venue-led Nikah outfit guide
                </Link>{` `}
                to decide whether the occasion needs a sherwani, prince coat or a simpler
                kurta-waistcoat combination.
              </p>
            </section>

            <section id="choose-yours" className={sectionClass}>
              <p className="u-caps text-brass-deep">Make it personal</p>
              <h2 className="font-display mt-3 text-3xl leading-tight sm:text-4xl">
                How to choose a 2026 sherwani without looking dated next year
              </h2>
              <ol className="text-muted mt-6 space-y-4">
                <li><strong className="text-espresso">1. Choose the event.</strong> Decide how ceremonial, warm and active the setting will be.</li>
                <li><strong className="text-espresso">2. Choose the silhouette.</strong> Set the shoulder, collar, length and trouser line before discussing embroidery.</li>
                <li><strong className="text-espresso">3. Choose one colour family.</strong> Test it beside your face, the bridal palette and the venue references.</li>
                <li><strong className="text-espresso">4. Choose one surface idea.</strong> Tonal beads, repeated geometry or spaced motifs are enough on their own.</li>
                <li><strong className="text-espresso">5. Complete the look once.</strong> Try the turban, shawl, jewellery and shoes together, then remove anything competing with the groom.</li>
              </ol>
              <p className="text-muted mt-6">
                If you are still deciding between a long ceremonial coat and a shorter
                tailored option, use our {" "}
                <Link href={SHERWANI_VS_PRINCE_COAT_POST.href} className={sourceClass}>
                  sherwani versus prince coat comparison
                </Link>
                . Once you have chosen a sherwani, the {" "}
                <Link href={SHERWANI_MISTAKES_POST.href} className={sourceClass}>
                  five-mistake fitting guide
                </Link>
                {" "}will help you prepare for the first trial.
              </p>
            </section>

            <section className={sectionClass} aria-labelledby="questions-heading">
              <p className="u-caps text-brass-deep">Quick answers</p>
              <h2 id="questions-heading" className="font-display mt-3 text-3xl sm:text-4xl">
                Questions Pakistani grooms ask about 2026 designs
              </h2>
              <div className="mt-7 space-y-7">
                <div>
                  <h3 className="font-display text-xl">Is ivory still fashionable in 2026?</h3>
                  <p className="text-muted mt-2">Yes. The newer interpretation uses tonal embroidery, a cleaner line and fewer contrast accessories, which keeps ivory from feeling predictable.</p>
                </div>
                <div>
                  <h3 className="font-display text-xl">Can a groom wear black for the Barat?</h3>
                  <p className="text-muted mt-2">Yes, particularly for an evening Barat. Choose textured black-on-black work and test it under the venue lighting so the sherwani keeps its detail in photographs.</p>
                </div>
                <div>
                  <h3 className="font-display text-xl">Which colour is easiest to coordinate?</h3>
                  <p className="text-muted mt-2">Ivory-gold is highly adaptable, while silver-grey works better with cooler bridal palettes. Coordination should repeat one metal or accent, not the bride&rsquo;s whole outfit.</p>
                </div>
                <div>
                  <h3 className="font-display text-xl">Should every 2026 sherwani be minimal?</h3>
                  <p className="text-muted mt-2">No. Rich handwork still belongs at a formal Barat. What feels current is a clear hierarchy: one strong embroidery language, supported by quieter accessories.</p>
                </div>
              </div>
            </section>

            <section className="border-brass bg-sand border p-7 sm:p-10" aria-labelledby="consultation-heading">
              <p className="u-caps text-brass-deep">See the cloth in person</p>
              <h2 id="consultation-heading" className="font-display mt-4 text-3xl leading-tight">
                Bring your palette, venue and wedding date to Kudmayi.
              </h2>
              <p className="text-muted mt-5">
                Compare ivory-gold, silver-grey, tonal black and emerald in natural light at
                {" "}{STORE_ADDRESS}. We can help you choose the design direction before the
                smaller styling decisions begin.
              </p>
              <div className="mt-7 flex flex-wrap gap-4">
                <Link
                  href={whatsAppLink("Hi Kudmayi, I'd like to discuss a 2026 sherwani consultation.")}
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
                Kudmayi&rsquo;s product photographs show current catalogue pieces. Trend notes
                were cross-checked against designer guidance published in 2026. Availability,
                cloth and handwork can vary by piece, so confirm the final details in person.
              </p>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
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
