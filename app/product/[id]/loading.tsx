import { AppHeader } from "@/components/AppHeader";
import { Skeleton } from "@/components/Skeleton";

export default function ProductLoading() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8 sm:py-14">
        <Skeleton className="mb-8 h-3 w-28" />

        <div className="grid gap-10 md:grid-cols-2 md:gap-14">
          <Skeleton className="aspect-[3/4] w-full rounded-none" />

          <div>
            <Skeleton className="h-3 w-24" />
            <div className="bg-brass/60 mt-2.5 h-px w-full" />
            <Skeleton className="mt-5 h-12 w-4/5" />
            <Skeleton className="mt-7 h-7 w-32" />

            <div className="border-line mt-10 space-y-5 border-t pt-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
