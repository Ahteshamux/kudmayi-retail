import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/website/Breadcrumb";
import {
  LATEST_SHERWANI_DESIGNS_POST,
  NIKAH_DRESS_IDEAS_POST,
  SHERWANI_MISTAKES_POST as post,
  SHERWANI_VS_PRINCE_COAT_POST,
  WALIMA_GROOM_OUTFITS_POST,
} from "@/lib/website/blog";
import {
  GOOGLE_MAPS_URL,
  SITE_URL,
  STORE_ADDRESS,
} from "@/lib/website/constants";
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

const sectionClass =
  "scroll-mt-28 border-line border-t pt-10 sm:pt-12";

export default function SherwaniMistakesArticle() {
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

          <figure className="bg-well relative mt-12 aspect-[16/9] overflow-hidden sm:mt-16">
            <Image
              src={post.image.src}
              alt={post.image.alt}
              fill
              priority
              sizes="(max-width: 1535px) 100vw, 1440px"
              className="object-cover object-center"
            />
          </figure>
        </header>

        <div className="u-container mt-12 sm:mt-16">
          <div className="mx-auto max-w-3xl space-y-10 text-[1.0625rem] leading-8">
            <div className="space-y-6">
              <p className="font-display text-2xl leading-9 text-espresso sm:text-3xl sm:leading-10">
                Choose your sherwani in this order: fit, fabric, colour, then
                embroidery. Clean shoulders, weather-appropriate cloth and a shade
                that sits well beside the bride matter more than another layer of
                dabka. Get that order wrong, and beautiful handwork only makes a poor
                silhouette more obvious. The five checks below are the ones to make
                before your first fitting.
              </p>
              <p className="text-muted">
                A sherwani frames the face, sets the groom&rsquo;s posture and appears
                in almost every formal photograph. You do not need the most decoration
                in the room. You need an outfit that feels right for the man, the event
                and the setting.
              </p>
            </div>

            <aside
              aria-labelledby="takeaways-heading"
              className="border-brass bg-sand border-l-2 p-6 sm:p-8"
            >
              <h2 id="takeaways-heading" className="u-caps text-brass-deep">
                Before you order
              </h2>
              <ul className="mt-5 space-y-3 text-base leading-7">
                <li>Start early enough to correct the fit without rushing the handwork.</li>
                <li>Let your proportions decide the cut, not a celebrity photograph.</li>
                <li>Judge colour against your face, the bride&rsquo;s outfit and the venue light.</li>
                <li>Give one element the leading role and ask every accessory to support it.</li>
              </ul>
            </aside>

            <nav aria-labelledby="contents-heading" className="border-line border-y py-7">
              <h2 id="contents-heading" className="u-caps text-muted">
                In this guide
              </h2>
              <ol className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <li>
                  <a className={sourceClass} href="#starting-late">
                    1. Starting too late
                  </a>
                </li>
                <li>
                  <a className={sourceClass} href="#fit-before-embroidery">
                    2. Choosing embroidery before fit
                  </a>
                </li>
                <li>
                  <a className={sourceClass} href="#fabric-and-colour">
                    3. Separating fabric from colour
                  </a>
                </li>
                <li>
                  <a className={sourceClass} href="#coordinate-with-bride">
                    4. Matching the bride too closely
                  </a>
                </li>
                <li>
                  <a className={sourceClass} href="#complete-look">
                    5. Styling pieces in isolation
                  </a>
                </li>
              </ol>
            </nav>

            <section id="starting-late" className={sectionClass}>
              <p className="u-caps text-brass-deep">Mistake one</p>
              <h2 className="font-display mt-3 text-3xl leading-tight sm:text-4xl">
                Starting after the best choices have disappeared
              </h2>
              <div className="text-muted mt-6 space-y-5">
                <p>
                  A late start does more than create delivery stress. It reduces the
                  fabrics you can source, the handwork you can commission and the
                  number of fit corrections your tailor can make. The usual result is
                  a groom accepting what is available instead of choosing what suits him.
                </p>
                <p>
                  Timelines vary by maker and by the density of the work. Riwayat lists
                  three to four weeks from first measurement to final fitting and advises
                  booking at least six weeks ahead. Book Tailor also lists a three to four
                  week production window, with extra time possible during wedding season.
                  Both describe structured sherwanis as garments that normally need more
                  than one fitting. See the published guidance from
                  {" "}
                  <a
                    className={sourceClass}
                    href="https://www.riwayatdesigners.com/services"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Riwayat
                  </a>
                  {" "}and{" "}
                  <a
                    className={sourceClass}
                    href="https://booktailor.pk/faqs/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Book Tailor
                  </a>
                  .
                </p>
                <p>
                  For a custom piece, eight to twelve weeks is a calmer working window.
                  Begin earlier for dense hand embroidery, a specially woven cloth or a
                  wedding during a busy season. Fix four dates at the start: consultation,
                  first fitting, finishing fitting and a final trial in the complete look.
                </p>
              </div>

              <div className="border-line mt-8 overflow-x-auto border">
                <table className="w-full min-w-[38rem] border-collapse text-left text-sm">
                  <thead className="bg-sand text-espresso">
                    <tr>
                      <th className="border-line border-b px-5 py-4 font-medium">Stage</th>
                      <th className="border-line border-b px-5 py-4 font-medium">A useful window</th>
                      <th className="border-line border-b px-5 py-4 font-medium">What to settle</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted">
                    <tr>
                      <td className="border-line border-b px-5 py-4">Consultation</td>
                      <td className="border-line border-b px-5 py-4">8 to 12 weeks before</td>
                      <td className="border-line border-b px-5 py-4">Cut, cloth, budget and palette</td>
                    </tr>
                    <tr>
                      <td className="border-line border-b px-5 py-4">First fitting</td>
                      <td className="border-line border-b px-5 py-4">5 to 7 weeks before</td>
                      <td className="border-line border-b px-5 py-4">Shoulder, chest, waist and length</td>
                    </tr>
                    <tr>
                      <td className="border-line border-b px-5 py-4">Finishing fitting</td>
                      <td className="border-line border-b px-5 py-4">2 to 3 weeks before</td>
                      <td className="border-line border-b px-5 py-4">Sleeves, collar, lining and buttons</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-4">Full-look trial</td>
                      <td className="px-5 py-4">7 to 10 days before</td>
                      <td className="px-5 py-4">Shoes, trousers, turban and shawl</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="fit-before-embroidery" className={sectionClass}>
              <p className="u-caps text-brass-deep">Mistake two</p>
              <h2 className="font-display mt-3 text-3xl leading-tight sm:text-4xl">
                Choosing embroidery before the silhouette is right
              </h2>
              <div className="text-muted mt-6 space-y-5">
                <p>
                  Fit controls how every other detail is read. If the collar gaps, the
                  shoulders collapse or the front pulls across the waist, more embroidery
                  simply puts a frame around the problem. A plainer sherwani with a clean
                  line will look sharper than a heavily worked one that fights the body.
                </p>
                <p>
                  Start at the shoulder. The seam should meet the natural end of the
                  shoulder without slipping down the arm. The band collar should sit close
                  without pressing into the neck. Button the sherwani fully and look for
                  horizontal pulling across the chest or stomach. Then sit, reach forward
                  and raise your arms. Wedding clothes have to survive greetings, dinner
                  and several hours on stage, not just thirty seconds in front of a mirror.
                </p>
              </div>

              <h3 className="font-display mt-8 text-2xl">Use proportion, not labels</h3>
              <div className="text-muted mt-4 space-y-4">
                <p>
                  A shorter groom will usually gain height from vertical detailing, a
                  controlled flare and trousers close to the sherwani&rsquo;s colour. Thick hem
                  borders and oversized motifs cut the body into sections. A tall, lean
                  groom can carry a longer cut, broader motifs and a shawl with more presence.
                </p>
                <p>
                  Broader builds benefit from an assured shoulder, an easy waist and less
                  concentrated work across the chest. Slimmer frames can use a cloth with
                  more body and a little texture. None of this is about hiding the groom.
                  It is about creating a line that looks deliberate from every angle.
                </p>
                <p>
                  Karigur&rsquo;s groomwear guide makes the same practical distinction: length,
                  shoulder, collar and the lower garment establish the sherwani before the
                  decoration does. Its
                  {" "}
                  <a
                    className={sourceClass}
                    href="https://karigur.com/blogs/guides/groom-sherwani-guide"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    sherwani fitting notes
                  </a>
                  {" "}are a useful second opinion before a trial.
                </p>
              </div>
            </section>

            <section id="fabric-and-colour" className={sectionClass}>
              <p className="u-caps text-brass-deep">Mistake three</p>
              <h2 className="font-display mt-3 text-3xl leading-tight sm:text-4xl">
                Treating fabric, colour and handwork as separate decisions
              </h2>
              <div className="text-muted mt-6 space-y-5">
                <p>
                  Fabric determines how the sherwani holds its shape, how warm it feels and
                  how much work it can carry. Colour changes under daylight, ballroom light
                  and photography flash. Embroidery adds weight and reflection. Choose all
                  three together, with the event in mind. A June afternoon in Lahore and a
                  December evening call for very different cloth.
                </p>
                <p>
                  Lighter raw silk, linen blends and cotton-silk make sense for warm or
                  daytime functions. Jamawar, brocade and velvet have greater visual and
                  physical weight, which suits cooler evenings. The seasonal comparison in
                  {" "}
                  <a
                    className={sourceClass}
                    href="https://www.weddingwala.pk/groom-sherwani-guide-pakistan"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Wedding Wala&rsquo;s Pakistani groom guide
                  </a>
                  {" "}offers a useful starting point, but the lining and embroidery density
                  still need to be judged in person.
                </p>
              </div>

              <div className="border-line mt-8 overflow-x-auto border">
                <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
                  <thead className="bg-sand text-espresso">
                    <tr>
                      <th className="border-line border-b px-5 py-4 font-medium">Setting</th>
                      <th className="border-line border-b px-5 py-4 font-medium">Cloth</th>
                      <th className="border-line border-b px-5 py-4 font-medium">Colour direction</th>
                      <th className="border-line border-b px-5 py-4 font-medium">Finish</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted align-top">
                    <tr>
                      <td className="border-line border-b px-5 py-4">Daytime Nikah</td>
                      <td className="border-line border-b px-5 py-4">Light raw silk or cotton-silk</td>
                      <td className="border-line border-b px-5 py-4">Pearl, ivory, sage or powder blue</td>
                      <td className="border-line border-b px-5 py-4">Self-thread work or fine buttons</td>
                    </tr>
                    <tr>
                      <td className="border-line border-b px-5 py-4">Summer Barat</td>
                      <td className="border-line border-b px-5 py-4">Breathable raw silk</td>
                      <td className="border-line border-b px-5 py-4">Champagne, stone or muted olive</td>
                      <td className="border-line border-b px-5 py-4">Focused collar and cuff work</td>
                    </tr>
                    <tr>
                      <td className="border-line border-b px-5 py-4">Winter evening</td>
                      <td className="border-line border-b px-5 py-4">Jamawar, brocade or velvet panels</td>
                      <td className="border-line border-b px-5 py-4">Maroon, bottle green or midnight</td>
                      <td className="border-line border-b px-5 py-4">Antique dabka or zardozi</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-4">Walima</td>
                      <td className="px-5 py-4">Fine jacquard or structured silk</td>
                      <td className="px-5 py-4">Charcoal, steel, champagne or navy</td>
                      <td className="px-5 py-4">Tonal embroidery and clean hardware</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="font-display mt-8 text-2xl">Find your colour near your face</h3>
              <div className="text-muted mt-4 space-y-4">
                <p>
                  Hold the fabric beside your jaw in natural light. Warm undertones often
                  sit comfortably with champagne, antique gold, camel, olive and warm
                  maroon. Cool undertones often suit pearl ivory, silver-grey, navy,
                  burgundy and lavender. Neutral undertones have more freedom, so depth and
                  contrast become the useful tests.
                </p>
                <p>
                  Complexion depth is not the same as undertone. Deep complexions can be
                  warm, cool or neutral, and often take ivory or jewel tones beautifully.
                  Lighter complexions may prefer softened shades over a very stark white or
                  an extremely dark collar. A phone photograph in daylight and warm indoor
                  light will tell you more than the shade name on a swatch card.
                </p>
              </div>

              <h3 className="font-display mt-8 text-2xl">Give the eye one place to land</h3>
              <p className="text-muted mt-4">
                A woven jamawar already has movement, so it rarely needs dense work across
                the whole body. Plain raw silk can carry more embroidery. Place the detail
                where people look first: collar, placket, cuffs and perhaps a controlled hem.
                Tone-on-tone thread feels quieter and modern. Antique metalwork feels more
                ceremonial. One clear idea will always look more assured than five competing ones.
              </p>
            </section>

            <aside className="bg-bark px-6 py-8 text-parchment sm:px-8">
              <p className="u-caps text-brass">A useful fitting rule</p>
              <p className="font-display mt-4 text-2xl leading-9">
                If you notice the embroidery before you notice the groom, remove one element.
              </p>
              <Link href="/shop/sherwanis" className="u-btn mt-7">
                Explore sherwanis
              </Link>
            </aside>

            <section id="coordinate-with-bride" className={sectionClass}>
              <p className="u-caps text-brass-deep">Mistake four</p>
              <h2 className="font-display mt-3 text-3xl leading-tight sm:text-4xl">
                Matching the bride instead of dressing beside her
              </h2>
              <div className="text-muted mt-6 space-y-5">
                <p>
                  Coordination means the two outfits belong in the same photograph. It does
                  not mean turning the groom into a second version of the bridal dress. When
                  both people wear the same strong colour at the same intensity, the picture
                  can become flat and crowded.
                </p>
                <p>
                  Choose the bride&rsquo;s principal look first. Give the groom a contrasting or
                  quieter base, then repeat one detail: the temperature of the metalwork, a
                  turban accent, the edge of a shawl or a stone in the mala. Karigur recommends
                  coordinating rather than matching, while the House of Arsalan Iqbal suggests
                  using smaller details to connect the two looks. See its
                  {" "}
                  <a
                    className={sourceClass}
                    href="https://arsalaniqbal.com/blogs/news/mens-wedding-sherwani-in-pakistan"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Pakistani groom style guide
                  </a>
                  .
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  ["Bride in red or maroon", "Ivory, champagne or beige sherwani with antique gold work and a restrained red accent."],
                  ["Bride in ivory or gold", "Bottle green, midnight, burgundy or warm taupe with gold details that echo her finish."],
                  ["Bride in blush or peach", "Pearl, stone, soft sage or champagne with a blush turban detail or rose-gold hardware."],
                  ["Bride in lavender or silver", "Dove grey, cool ivory, charcoal or navy with silver work and a small lavender note."],
                ].map(([title, copy]) => (
                  <div key={title} className="border-line border bg-surface p-6">
                    <h3 className="font-display text-xl text-espresso">{title}</h3>
                    <p className="text-muted mt-3 text-sm leading-6">{copy}</p>
                  </div>
                ))}
              </div>

              <p className="text-muted mt-6">
                Check the stage as well. Bottle green may look excellent beside an ivory
                bride and then disappear against a wall of green foliage. Take the swatches
                to the venue or place them beside the decor references before approving the palette.
              </p>
            </section>

            <section id="complete-look" className={sectionClass}>
              <p className="u-caps text-brass-deep">Mistake five</p>
              <h2 className="font-display mt-3 text-3xl leading-tight sm:text-4xl">
                Styling each piece in isolation
              </h2>
              <div className="text-muted mt-6 space-y-5">
                <p>
                  The final fitting should include the trousers, khussa, turban, shawl,
                  brooch and mala. Each one changes the balance of the outfit. Trousers affect
                  the line of the hem, shoes affect posture, and a tall turban changes how the
                  collar and face are framed.
                </p>
                <p>
                  A heavily worked sherwani needs restraint elsewhere. Choose one statement
                  accessory, perhaps a turban or a shawl, then keep the rest quiet. A minimal
                  sherwani gives you more room for a textured shawl, a stronger brooch or a
                  layered mala. If everything asks for attention, nothing receives it.
                </p>
              </div>

              <h3 className="font-display mt-8 text-2xl">Do the wedding-day movement test</h3>
              <ol className="text-muted mt-4 grid gap-3 sm:grid-cols-2">
                <li className="border-line border-b pb-3">1. Button the sherwani completely.</li>
                <li className="border-line border-b pb-3">2. Sit for several minutes.</li>
                <li className="border-line border-b pb-3">3. Walk in the wedding shoes.</li>
                <li className="border-line border-b pb-3">4. Raise both arms and reach forward.</li>
                <li className="border-line border-b pb-3">5. Add the shawl, turban and jewellery.</li>
                <li className="border-line border-b pb-3">6. Take front, side and back photographs.</li>
              </ol>
              <p className="text-muted mt-6">
                Break in the khussa before the event and keep the trouser colour close to the
                sherwani if you want a longer visual line. Finally, look at the collar with
                every accessory in place. A high collar, large brooch, heavy mala and tall
                turban can crowd the face. Removing one piece often finishes the outfit.
              </p>
            </section>

            <section className={sectionClass} aria-labelledby="checklist-heading">
              <p className="u-caps text-brass-deep">The final inspection</p>
              <h2 id="checklist-heading" className="font-display mt-3 text-3xl sm:text-4xl">
                A twelve-point sherwani checklist
              </h2>
              <ul className="text-muted mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {[
                  "Shoulder seams meet the natural shoulder.",
                  "The collar closes without pressing the neck.",
                  "The chest stays smooth when fully buttoned.",
                  "Sleeves finish around the wrist bone.",
                  "The hem length works with your height.",
                  "You can sit and raise your arms comfortably.",
                  "The lining feels comfortable against the skin.",
                  "The cloth suits the season and venue.",
                  "The colour works in daylight and warm light.",
                  "The metalwork agrees with the bridal outfit.",
                  "Shoes and trousers have been tested together.",
                  "Accessories support one clear visual idea.",
                ].map((item) => (
                  <li key={item} className="border-line flex gap-3 border-b pb-3">
                    <span className="text-brass-deep" aria-hidden="true">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className={sectionClass} aria-labelledby="questions-heading">
              <p className="u-caps text-brass-deep">Practical questions</p>
              <h2 id="questions-heading" className="font-display mt-3 text-3xl sm:text-4xl">
                What grooms usually ask before ordering
              </h2>
              <div className="mt-7 space-y-7">
                <div>
                  <h3 className="font-display text-xl">What is the safest sherwani colour?</h3>
                  <p className="text-muted mt-2">
                    Ivory, champagne and warm beige work with many bridal palettes. The safe
                    choice is not a universal colour, though. It is the shade that suits your
                    undertone, agrees with the bride&rsquo;s metalwork and holds up in the venue light.
                  </p>
                </div>
                <div>
                  <h3 className="font-display text-xl">Can a groom wear black?</h3>
                  <p className="text-muted mt-2">
                    Yes, especially for an evening event. Black can feel severe in strong
                    daylight, so texture, antique gold work or a warm shawl can stop it from
                    looking flat.
                  </p>
                </div>
                <div>
                  <h3 className="font-display text-xl">How much embroidery is enough?</h3>
                  <p className="text-muted mt-2">
                    Let the cloth answer first. Plain raw silk can carry more detail. Patterned
                    jamawar may need only a collar, placket and cuff treatment. Stop when the
                    line of the garment remains clearer than the decoration.
                  </p>
                </div>
                <div>
                  <h3 className="font-display text-xl">What should I bring to a fitting?</h3>
                  <p className="text-muted mt-2">
                    Bring the wedding shoes, lower garment, planned accessories and an accurate
                    reference for the bride&rsquo;s outfit. If you have not chosen the accessories,
                    bring photographs showing their likely scale and colour.
                  </p>
                </div>
              </div>
            </section>

            <section className={sectionClass} aria-labelledby="next-reading-heading">
              <p className="u-caps text-brass-deep">Continue planning</p>
              <h2 id="next-reading-heading" className="font-display mt-3 text-3xl sm:text-4xl">
                Choose the direction before the first fitting
              </h2>
              <p className="text-muted mt-6">
                Browse the {" "}
                <Link href={LATEST_SHERWANI_DESIGNS_POST.href} className={sourceClass}>
                  latest sherwani designs for 2026
                </Link>
                {" "}if you are still deciding on colour and visual mood. If the larger
                question is which silhouette belongs at your event, compare a {" "}
                <Link href={SHERWANI_VS_PRINCE_COAT_POST.href} className={sourceClass}>
                  sherwani and prince coat
                </Link>
                {" "}before you commission either one. For event-specific planning, compare
                the{` `}
                <Link href={NIKAH_DRESS_IDEAS_POST.href} className={sourceClass}>
                  seven Nikah outfit directions
                </Link>{` `}
                or use the{` `}
                <Link href={WALIMA_GROOM_OUTFITS_POST.href} className={sourceClass}>
                  three-way Walima outfit guide
                </Link>
                .
              </p>
            </section>

            <section className="border-brass bg-sand border p-7 sm:p-10" aria-labelledby="consultation-heading">
              <p className="u-caps text-brass-deep">Make the choices in person</p>
              <h2 id="consultation-heading" className="font-display mt-4 text-3xl leading-tight">
                A sherwani should look like you, only more considered.
              </h2>
              <p className="text-muted mt-5">
                Bring the wedding palette, venue details and the shoes you plan to wear.
                Kudmayi can help you compare cloth, colour and proportion together at
                {" "}{STORE_ADDRESS}.
              </p>
              <div className="mt-7 flex flex-wrap gap-4">
                <Link
                  href={whatsAppLink("Hi Kudmayi, I'd like to discuss a sherwani consultation.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="u-btn"
                >
                  Book a consultation
                </Link>
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="u-btn-ghost"
                >
                  View the Lahore store
                </a>
              </div>
            </section>

            <footer className="border-line border-t pt-8 text-sm leading-6 text-muted">
              <p>
                This guide was prepared by Kudmayi using published fitting and styling
                guidance from Pakistani and South Asian groomwear specialists. Fabric,
                dye and fit vary by piece, so final decisions should always be checked in person.
              </p>
              <Link href="/blog" className={`${sourceClass} mt-5 inline-block`}>
                Return to the Kudmayi Journal
              </Link>
            </footer>
          </div>
        </div>
      </article>
    </>
  );
}
