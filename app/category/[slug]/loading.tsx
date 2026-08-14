import { AppHeader } from "@/components/AppHeader";
import { Skeleton } from "@/components/Skeleton";

export default function CategoryLoading() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8 sm:py-14">
        <Skeleton className="mb-8 h-3 w-28" />

        <div className="mb-10">
          <Skeleton className="h-3 w-20" />
          <div className="bg-brass/60 mt-2.5 h-px w-full max-w-[10rem]" />
          <Skeleton className="mt-4 h-11 w-52" />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border-line border">
              <Skeleton className="aspect-[3/4] w-full rounded-none" />
              <div className="space-y-2.5 p-3">
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
