"use client";

import Link from "next/link";
import { SectionLabel } from "@/components/SectionLabel";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex flex-1 items-center justify-center px-5 py-20">
      <div className="w-full max-w-sm text-center">
        <SectionLabel className="mx-auto max-w-[8rem]">
          Something broke
        </SectionLabel>

        <h1 className="font-display mt-6 text-3xl leading-tight">
          That didn&rsquo;t work.
        </h1>

        <p className="text-muted mt-4 text-sm">
          Try again — if it keeps happening, check your internet connection.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <button onClick={reset} className="u-btn u-caps w-full">
            Try again
          </button>
          <Link href="/" className="u-btn-ghost u-caps w-full">
            Back to collections
          </Link>
        </div>

        {/* Useful when she reports a problem; meaningless noise otherwise. */}
        {error.digest && (
          <p className="text-muted/70 mt-8 font-mono text-[0.625rem]">
            {error.digest}
          </p>
        )}
      </div>
    </main>
  );
}
