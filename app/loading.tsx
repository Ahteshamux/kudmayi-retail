import { AppHeader } from "@/components/AppHeader";
import { Skeleton } from "@/components/Skeleton";

export default function HomeLoading() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-14">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="mt-5 h-11 w-full max-w-md" />
        </div>

        <div className="grid gap-px sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border-brass/15 border p-7 sm:p-9">
              <Skeleton className="h-3 w-20" />
              <div className="bg-brass/30 mt-2.5 h-px w-full" />
              <Skeleton className="mt-5 h-9 w-40" />
              <Skeleton className="mt-6 h-3 w-16" />
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
