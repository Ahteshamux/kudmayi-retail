import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/website/Breadcrumb";
import {
  BLOG_PRODUCT_IMAGES,
  LATEST_SHERWANI_DESIGNS_POST,
  NIKAH_DRESS_IDEAS_POST as post,
  SHERWANI_MISTAKES_POST,
  SHERWANI_VS_PRINCE_COAT_POST,
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

export default function NikahDressIdeasArticle() {
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
              src={BLOG_PRODUCT_IMAGES.chandni.src}
              alt={BLOG_PRODUCT_IMAGES.chandni.alt}
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 896px"
              className="object-cover object-top"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-espresso/85 px-5 py-4 text-sm text-parchment backdrop-blur-sm">
              A silver prince coat gives a Nikah formality without the length of a sherwani.{" "}
              <Link
                href={BLOG_PRODUCT_IMAGES.chandni.productHref}
                className="underline decoration-brass/60 underline-offset-4"
              >
                View Chandni
              </Link>
            </figcaption>
          </figure>
        </header>

        <div className="u-container mt-12 sm:mt-16">
          <div className="mx-auto max-w-3xl space-y-10 text-[1.0625rem] leading-8">
            <div className="space-y-6">
              <p className="font-display text-2xl leading-9 text-espresso sm:text-3xl sm:leading-10">
                The best Nikah dress is the one that matches the scale of the ceremony. A
                white kameez shalwar and waistcoat can look completely appropriate at home
                or in a mosque. An ivory sherwani or refined prince coat gives more presence
                in a formal hall. Nothing becomes correct simply because it is heavier or
                more expensive.
              </p>
              <p className="text-muted">
                That distinction matters because groom discussions often begin with the
                wrong question: is a sherwani too much for a Nikah? One{` `}
                <a
                  className={sourceClass}
                  href="https://www.reddit.com/r/pakistan/comments/1imcr95"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  r/pakistan discussion
                </a>{` `}
                asked exactly that, while another{` `}
                <a
                  className={sourceClass}
                  href="https://www.reddit.com/r/DesiWeddings/comments/1lpv13k/need_help_matching_groom_outfit/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  r/DesiWeddings thread
                </a>{` `}
                focused on matching the bride and managing summer heat. These are useful
                questions, not evidence of a universal rule. This guide answers them with
                venue, weather, fit and proportion in mind.
              </p>
            </div>

            <aside aria-labelledby="takeaways-heading" className="border-brass bg-sand border-l-2 p-6 sm:p-8">
              <h2 id="takeaways-heading" className="u-caps text-brass-deep">The short answer</h2>
              <ul className="mt-5 space-y-3 text-base leading-7">
                <li>Choose simplicity for an intimate Nikah and ceremony for a formal one.</li>
                <li>White and ivory are flexible, but they are choices rather than religious requirements.</li>
                <li>Coordinate one detail with the bride instead of copying her complete palette.</li>
                <li>Let season, movement and fitting time narrow the options before embroidery does.</li>
              </ul>
            </aside>

            <nav aria-labelledby="contents-heading" className="border-line border-y py-7">
              <h2 id="contents-heading" className="u-caps text-muted">Seven Nikah directions</h2>
              <ol className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <li><a className={sourceClass} href="#kurta-waistcoat">1. Kurta and waistcoat</a></li>
                <li><a className={sourceClass} href="#ivory-sherwani">2. Ivory sherwani</a></li>
                <li><a className={sourceClass} href="#silver-prince-coat">3. Silver prince coat</a></li>
                <li><a className={sourceClass} href="#camel-taupe">4. Camel or taupe</a></li>
                <li><a className={sourceClass} href="#evening-colour">5. Deep evening colour</a></li>
                <li><a className={sourceClass} href="#fusion-suit">6. Suit with a Pakistani accent</a></li>
                <li><a className={sourceClass} href="#seasonal-version">7. Season-led dressing</a></li>
              </ol>
            </nav>

            <section id="kurta-waistcoat" className={sectionClass}>
              <p className="u-caps text-brass-deep">Idea one</p>
              <h2 className="font-display mt-3 text-3xl leading-tight sm:text-4xl">
                White kameez shalwar with a considered waistcoat
              </h2>
              <div className="text-muted mt-6 space-y-5">
                <p>
                  This is the strongest choice for a home, mosque or small daytime Nikah.
                  Keep the kameez clean through the shoulder and chest, choose a trouser or
                  shalwar with enough ease to sit comfortably, and let the waistcoat mark the
                  wearer as the groom. Ivory, stone, sage, muted gold and soft blue all work
                  without making the outfit feel like a reduced Barat look.
                </p>
                <p>
                  A simple outfit still needs intention. Use covered buttons, a lightly woven
                  cloth, fine handwork around the pocket or one distinctive shawl. Current
                  examples in Amir Adnan&rsquo;s{` `}
                  <a
                    className={sourceClass}
                    href="https://amiradnan.com/blogs/custom-blog/groom-code-collection-premium-wedding-wear-for-men-by-amir-adnan"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Groom Code collection
                  </a>{` `}
                  show how solid kameez shalwar, waistcoats and ceremonial accessories can
                  occupy different points on the same groomwear spectrum. That is designer
                  direction, not a rule that every Nikah must follow.
                </p>
              </div>
            </section>

            <section id="ivory-sherwani" className={sectionClass}>
              <p className="u-caps text-brass-deep">Idea two</p>
              <h2 className="font-display mt-3 text-3xl leading-tight sm:text-4xl">
                Ivory sherwani with quiet, tonal handwork
              </h2>
              <ProductFigure
                image={BLOG_PRODUCT_IMAGES.zarrEShaan}
                caption="Zarr E Shaan demonstrates how one ivory-gold colour family can still feel ceremonial."
              />
              <div className="text-muted space-y-5">
                <p>
                  Choose this direction when the Nikah is the main public ceremony, the hall
                  is formal or the family wants the groom to have a traditional long
                  silhouette. The modern version keeps the base, thread and metalwork close
                  in colour. That restraint allows the cut and surface texture to carry the
                  look instead of bright contrast.
                </p>
                <p>
                  White and ivory are culturally popular, but no ethnic garment is required
                  for the marriage ceremony. Egypt&rsquo;s Dar Al-Ifta explains in its{` `}
                  <a
                    className={sourceClass}
                    href="https://www.dar-alifta.org/en/fatwa/details/7309/the-legal-attire-in-islam"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    guidance on attire
                  </a>{` `}
                  that clothing forms can follow time and place while observing modesty.
                  Treat the sherwani as a meaningful Pakistani cultural choice, not a
                  condition that makes the Nikah more valid. The Mohatta Palace Museum&rsquo;s{` `}
                  <a
                    className={sourceClass}
                    href="https://www.mohattapalacemuseum.org/exhibitions/a-flower-from-every-meadow-design-and-innovation-in-pakistans-dress-traditions"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    exhibition on Pakistan&rsquo;s dress traditions
                  </a>{` `}
                  places the sherwani within groomwear while also showing how varied the
                  country&rsquo;s regional dress traditions are.
                </p>
              </div>
            </section>

            <section id="silver-prince-coat" className={sectionClass}>
              <p className="u-caps text-brass-deep">Idea three</p>
              <h2 className="font-display mt-3 text-3xl leading-tight sm:text-4xl">
                Silver prince coat over an ivory kurta pyjama
              </h2>
              <div className="text-muted mt-6 space-y-5">
                <p>
                  A prince coat is the useful middle ground: sharper than a waistcoat and
                  shorter than most sherwanis. Silver, pearl or cool grey works especially
                  well in daylight, beside lilac, blue, cool ivory or jewel-toned bridal
                  clothes. Keep the kurta and trousers close in value so the shorter coat does
                  not divide the body into too many sections.
                </p>
                <p>
                  Because the hero photograph already carries dense tonal work, the rest of
                  the outfit should stay disciplined. One ring, polished khussa and a clean
                  pocket square are enough. If you are still deciding between the two coat
                  lengths, use the{` `}
                  <Link href={SHERWANI_VS_PRINCE_COAT_POST.href} className={sourceClass}>
                    sherwani and prince coat comparison
                  </Link>{` `}
                  before choosing embroidery.
                </p>
              </div>
            </section>

            <section id="camel-taupe" className={sectionClass}>
              <p className="u-caps text-brass-deep">Idea four</p>
              <h2 className="font-display mt-3 text-3xl leading-tight sm:text-4xl">
                Camel or taupe for a warm, understated ceremony
              </h2>
              <ProductFigure
                image={BLOG_PRODUCT_IMAGES.mirza}
                caption="Mirza uses warm camel, a shorter line and restrained gold details for a quieter formal look."
              />
              <div className="text-muted space-y-5">
                <p>
                  Camel, sand and taupe suit a garden, courtyard or heritage setting because
                  they feel formal without the brightness of ivory. They coordinate naturally
                  with rust, maroon, peach, antique gold and deep green. The important detail
                  is contrast near the face: a crisp ivory kurta or a slightly deeper collar
                  prevents a mid-tone coat from looking flat in photographs.
                </p>
                <p>
                  For a shorter groom, keep the lower garment close to the kurta and coat.
                  For a taller frame, a contrasting shawl can add width and ceremony. In both
                  cases, check the fabric beside the venue flooring and stage colours. Warm
                  neutrals can disappear into beige decor if the entire setting shares one tone.
                </p>
              </div>
            </section>

            <section id="evening-colour" className={sectionClass}>
              <p className="u-caps text-brass-deep">Idea five</p>
              <h2 className="font-display mt-3 text-3xl leading-tight sm:text-4xl">
                Deep green, navy or black for an evening Nikah
              </h2>
              <ProductFigure
                image={BLOG_PRODUCT_IMAGES.sangEMaah}
                caption="Sang E Maah shows how repeated motifs can give a neutral evening sherwani depth without bright contrast."
              />
              <div className="text-muted space-y-5">
                <p>
                  A deep colour is convincing when the ceremony begins after sunset and the
                  venue lighting can reveal its texture. Green and navy retain more visible
                  colour in photographs; black needs beadwork, thread or a woven surface so
                  it does not become one dark block. Pair the coat with a lighter turban,
                  kurta or shawl if the face needs more lift.
                </p>
                <p>
                  Do not choose a dark outfit from a studio image alone. Photograph the
                  swatch under warm indoor light and flash. If the detail disappears, simplify
                  the accessories and increase texture rather than adding an unrelated colour.
                  The{` `}
                  <Link href={LATEST_SHERWANI_DESIGNS_POST.href} className={sourceClass}>
                    latest sherwani colour edit
                  </Link>{` `}
                  shows how tonal black and emerald behave as complete looks.
                </p>
              </div>
            </section>

            <section id="fusion-suit" className={sectionClass}>
              <p className="u-caps text-brass-deep">Idea six</p>
              <h2 className="font-display mt-3 text-3xl leading-tight sm:text-4xl">
                A tailored suit with one Pakistani detail
              </h2>
              <div className="text-muted mt-6 space-y-5">
                <p>
                  A suit works when the couple wants a Western ceremony, the Nikah shares a
                  reception or the groom simply feels more like himself in tailoring. Navy,
                  charcoal, tobacco and warm grey are easier to soften than hard black in
                  daylight. Add one cultural note: an ajrak pocket square, embroidered
                  waistcoat, heirloom brooch or locally made footwear.
                </p>
                <p>
                  This hybrid question appears often among overseas grooms. A{` `}
                  <a
                    className={sourceClass}
                    href="https://www.reddit.com/r/DesiWeddings/comments/1ht1m8d/paki_groom_american_wedding/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Pakistani-American groom&rsquo;s discussion
                  </a>{` `}
                  considered a bandhgala and smaller Pakistani accents as alternatives to
                  choosing one identity over the other. The useful lesson is not the final
                  vote. It is that personal and family expectations should be settled before
                  the suit is ordered.
                </p>
              </div>
            </section>

            <section id="seasonal-version" className={sectionClass}>
              <p className="u-caps text-brass-deep">Idea seven</p>
              <h2 className="font-display mt-3 text-3xl leading-tight sm:text-4xl">
                Build a summer or winter version of the look
              </h2>
              <div className="text-muted mt-6 space-y-5">
                <p>
                  In warm weather, reduce layers before reducing formality. A lightly
                  structured prince coat, fine raw silk sherwani or breathable kurta with a
                  waistcoat can still look complete. Keep embroidery concentrated around the
                  collar, placket and cuffs, use a comfortable lining and avoid carrying a
                  heavy shawl merely because it appeared in the campaign photograph.
                </p>
                <p>
                  Vogue India&rsquo;s designer-led{` `}
                  <a
                    className={sourceClass}
                    href="https://www.vogue.in/weddings/content/groomswear-at-the-vogue-wedding-show-the-virtual-edit-2021"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    summer groomwear guidance
                  </a>{` `}
                  recommends lighter palettes, natural fabrics and controlled embroidery.
                  In winter, richer jamawar, brocade or velvet can work, but use them
                  selectively. A heated hall can make a heavily lined coat uncomfortable even
                  in December.
                </p>
              </div>
            </section>

            <section className={sectionClass} aria-labelledby="decision-heading">
              <p className="u-caps text-brass-deep">Choose by setting</p>
              <h2 id="decision-heading" className="font-display mt-3 text-3xl sm:text-4xl">
                Match the outfit to the Nikah you are actually having
              </h2>
              <div className="border-line mt-8 overflow-x-auto border">
                <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
                  <thead className="bg-sand text-espresso">
                    <tr>
                      <th className="border-line border-b px-5 py-4 font-medium">Setting</th>
                      <th className="border-line border-b px-5 py-4 font-medium">Strong starting point</th>
                      <th className="border-line border-b px-5 py-4 font-medium">Keep controlled</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted align-top">
                    <tr><td className="border-line border-b px-5 py-4">Home or mosque</td><td className="border-line border-b px-5 py-4">Kameez shalwar with waistcoat</td><td className="border-line border-b px-5 py-4">Heavy jewellery and long trailing shawls</td></tr>
                    <tr><td className="border-line border-b px-5 py-4">Daytime garden</td><td className="border-line border-b px-5 py-4">Light prince coat or restrained sherwani</td><td className="border-line border-b px-5 py-4">Dark heat-absorbing layers</td></tr>
                    <tr><td className="border-line border-b px-5 py-4">Formal hall</td><td className="border-line border-b px-5 py-4">Ivory sherwani or worked prince coat</td><td className="border-line border-b px-5 py-4">Competing embroidery and accessories</td></tr>
                    <tr><td className="px-5 py-4">Nikah plus reception</td><td className="px-5 py-4">Prince coat or tailored suit</td><td className="px-5 py-4">An outfit that only suits one half of the event</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className={sectionClass} aria-labelledby="coordinate-heading">
              <p className="u-caps text-brass-deep">Dress as a pair</p>
              <h2 id="coordinate-heading" className="font-display mt-3 text-3xl sm:text-4xl">
                Coordinate one detail, not the entire outfit
              </h2>
              <p className="text-muted mt-6">
                Choose the groom&rsquo;s base colour for his complexion and the venue, then repeat
                one element from the bride: metal temperature, stole edge, button colour or
                a small embroidery motif. Vogue India&rsquo;s{` `}
                <a
                  className={sourceClass}
                  href="https://www.vogue.in/content/how-to-match-your-wedding-outfits-with-the-groom-without-going-overboard"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  couple-coordination guide
                </a>{` `}
                uses the same principle. Related colours photograph with more depth than two
                identical outfits, particularly when both garments carry substantial handwork.
              </p>
            </section>

            <section className={sectionClass} aria-labelledby="questions-heading">
              <p className="u-caps text-brass-deep">Quick answers</p>
              <h2 id="questions-heading" className="font-display mt-3 text-3xl sm:text-4xl">
                Questions Pakistani grooms ask before a Nikah
              </h2>
              <div className="mt-7 space-y-7">
                <div><h3 className="font-display text-xl">Is a sherwani too much for a small Nikah?</h3><p className="text-muted mt-2">Not automatically. Use a cleaner fabric, restrained handwork and fewer accessories. If the setting is very intimate, a well-cut kurta and waistcoat may feel more natural.</p></div>
                <div><h3 className="font-display text-xl">Does a Nikah groom have to wear white?</h3><p className="text-muted mt-2">No. White and ivory are flexible cultural choices, not religious requirements. Camel, sage, silver, navy and deep green can work when they suit the setting and bridal palette.</p></div>
                <div><h3 className="font-display text-xl">What should an overseas groom order first?</h3><p className="text-muted mt-2">Confirm the finished measurements, alteration allowance, delivery date and return policy before approving embroidery. Arrange a local final fitting and keep a simpler backup outfit.</p></div>
                <div><h3 className="font-display text-xl">What matters most at the first fitting?</h3><p className="text-muted mt-2">Check shoulder position, collar comfort, chest closure, sleeve length and sitting movement. The full{` `}<Link href={SHERWANI_MISTAKES_POST.href} className={sourceClass}>sherwani fitting checklist</Link>{` `}covers the trial in detail.</p></div>
              </div>
            </section>

            <section className="border-brass bg-sand border p-7 sm:p-10" aria-labelledby="consultation-heading">
              <p className="u-caps text-brass-deep">See the options together</p>
              <h2 id="consultation-heading" className="font-display mt-4 text-3xl leading-tight">
                Bring the venue, bridal palette and ceremony time to Kudmayi.
              </h2>
              <p className="text-muted mt-5">
                Compare a sherwani and prince coat in natural light at {STORE_ADDRESS}. The
                right level of formality becomes much clearer when the complete silhouette is
                in front of you.
              </p>
              <div className="mt-7 flex flex-wrap gap-4">
                <Link href={whatsAppLink("Hi Kudmayi, I'd like help choosing my Nikah outfit.")} target="_blank" rel="noopener noreferrer" className="u-btn">Book a consultation</Link>
                <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="u-btn-ghost">View the Lahore store</a>
              </div>
            </section>

            <footer className="border-line border-t pt-8 text-sm leading-6 text-muted">
              <p>
                This research-only guide uses museum, religious-attire and designer sources
                for factual context. Reddit discussions informed the reader questions, not
                the cultural or religious claims. Product photographs show current Kudmayi pieces.
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
