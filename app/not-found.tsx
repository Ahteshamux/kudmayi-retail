import Link from "next/link";
import { SectionLabel } from "@/components/SectionLabel";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-5 py-20">
      <div className="w-full max-w-sm text-center">
        <SectionLabel className="mx-auto max-w-[8rem]">Not found</SectionLabel>

        <h1 className="font-display mt-6 text-3xl leading-tight">
          This page isn&rsquo;t here.
        </h1>

        <p className="text-muted mt-4 text-sm">
          It may have been moved, or the link is wrong.
        </p>

        <Link href="/" className="u-btn u-caps mt-8">
          Back home
        </Link>
      </div>
    </main>
  );
}
