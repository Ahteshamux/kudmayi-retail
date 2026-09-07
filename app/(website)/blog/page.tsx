import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/website/Breadcrumb";
import { BLOG_POSTS } from "@/lib/website/blog";
import { SITE_URL } from "@/lib/website/constants";
import { JsonLd, breadcrumbJsonLd } from "@/lib/website/json-ld";

const description =
  "The Kudmayi Journal offers considered advice on Pakistani groomwear, sherwani fit, colour, fabric and wedding style.";

export const metadata: Metadata = {
  title: "Journal",
  description,
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: "The Kudmayi Journal",
    description,
    url: `${SITE_URL}/blog`,
    siteName: "Kudmayi",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Kudmayi Journal",
    description,
  },
};

export default function BlogPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
        ])}
      />

      <div className="u-container pt-32 pb-24 sm:pt-40 lg:pb-32">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />

        <header className="border-line mt-8 max-w-3xl border-b pb-10 sm:pb-14">
          <p className="u-caps text-brass-deep">The Kudmayi Journal</p>
          <h1 className="font-display mt-4 text-4xl leading-tight sm:text-6xl">
            Notes on dressing well.
          </h1>
          <p className="text-muted mt-6 max-w-2xl text-base leading-7 sm:text-lg">
            Practical guidance on proportion, cloth, colour and the small decisions
            that make Pakistani formalwear feel personal.
          </p>
        </header>

        <section aria-labelledby="latest-heading" className="mt-12 sm:mt-16">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="u-caps text-brass-deep">From the atelier</p>
              <h2 id="latest-heading" className="font-display mt-3 text-3xl sm:text-4xl">
                Latest stories
              </h2>
            </div>
            <span className="text-muted hidden text-sm sm:block">
              {BLOG_POSTS.length} articles
            </span>
          </div>

          <div className="mt-8 space-y-10">
            {BLOG_POSTS.map((post, index) => (
              <article
                key={post.slug}
                className="border-line grid overflow-hidden border bg-surface lg:grid-cols-[1.15fr_0.85fr]"
              >
                <Link
                  href={post.href}
                  className="bg-well relative block min-h-72 overflow-hidden sm:min-h-96 lg:min-h-[34rem]"
                  aria-label={`Read ${post.title}`}
                >
                  <Image
                    src={post.image.src}
                    alt={post.image.alt}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 1023px) 100vw, 58vw"
                    className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                  />
                </Link>

                <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
                  <div className="text-muted flex flex-wrap items-center gap-x-3 gap-y-2 text-xs uppercase tracking-[0.16em]">
                    <span>{post.category}</span>
                    <span aria-hidden="true">·</span>
                    <time dateTime={post.publishedAt}>{post.displayDate}</time>
                    <span aria-hidden="true">·</span>
                    <span>{post.readingTime}</span>
                  </div>

                  <h3 className="font-display mt-6 text-3xl leading-tight sm:text-4xl">
                    <Link href={post.href} className="hover:text-brass-deep transition-colors">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-muted mt-5 leading-7">{post.excerpt}</p>
                  <Link href={post.href} className="u-btn-ghost u-caps mt-8 self-start">
                    Read the article
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
