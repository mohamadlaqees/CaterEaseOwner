import { Skeleton } from "@/components/ui/skeleton";

export const FoodDetailsSkeleton = () => {
  return (
    <main className="text-(--primaryFont) p-5 sm:p-10 animate-pulse">
      {/* Header Skeleton */}
      <header className="flex justify-between items-center font-bold mb-5">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-6 w-1/4 hidden sm:block" />
      </header>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* --- LEFT COLUMN SKELETON: Image & Items/Extras --- */}
        <section className="lg:basis-1/2 space-y-8">
          {/* Image Skeleton */}
          <div className="p-4 flex justify-center items-center border-2 border-slate-200 rounded-md">
            <Skeleton className="w-full h-64 sm:h-80 md:h-96 rounded-md" />
          </div>

          {/* Package Items Skeleton */}
          <div className="p-6 border-2 border-slate-200 rounded-md space-y-4">
            <Skeleton className="h-6 w-40" /> {/* Title: "Package Items" */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>

          {/* Optional Extras Skeleton */}
          <div className="p-6 border-2 border-slate-200 rounded-md space-y-4">
            <Skeleton className="h-6 w-44" /> {/* Title: "Optional Extras" */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </section>

        {/* --- RIGHT COLUMN SKELETON: Details & Info --- */}
        <section className="p-5 sm:p-8 lg:basis-1/2 border-2 border-slate-200 rounded-md space-y-6">
          {/* Title and Price */}
          <div className="space-y-3">
            <div className="flex lg:flex-col xl:flex-row justify-between items-start gap-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-8 w-1/4" />
            </div>
            <Skeleton className="h-6 w-1/2" />
          </div>

          {/* Description */}
          <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          {/* Categories/Tags Section */}
          <div className="space-y-3 pt-2">
            <Skeleton className="h-6 w-32" />
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
          </div>

          {/* Occasions/Tags Section */}
          <div className="space-y-3 pt-2">
            <Skeleton className="h-6 w-32" />
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-8 w-28 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          </div>

          {/* Additional Information Card */}
          <div className="p-6 space-y-4 border border-gray-200 rounded-xl mt-4">
            <Skeleton className="h-6 w-48" />
            <div className="space-y-2 pl-7">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
