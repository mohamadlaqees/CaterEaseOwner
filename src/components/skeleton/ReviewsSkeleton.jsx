// src/components/skeletons/ReviewsSkeleton.jsx (or your preferred path)

import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";

const ReviewsSkeleton = () => {
  return (
    <main className="p-5 sm:p-10">
      {/* Date Picker Skeleton */}
      <div className="sm:text-end mt-10">
        <Skeleton className="h-10 w-full sm:w-[225px] ml-auto" />
      </div>

      {/* Stats Section Skeleton */}
      <section className="flex text-sm sm:text-lg my-10 flex-col md:flex-row items-center gap-10 md:justify-evenly md:gap-5">
        {/* Total Reviews Skeleton */}
        <div className="space-y-5 text-center w-full md:w-fit md:border-r-2 border-transparent md:pr-20">
          <Skeleton className="h-6 w-32 mx-auto" />
          <Skeleton className="h-8 w-16 mx-auto" />
        </div>
        {/* Average Rating Skeleton */}
        <div className="space-y-5 text-center w-full md:w-fit md:border-r-2 border-transparent md:pr-20">
          <Skeleton className="h-6 w-32 mx-auto" />
          <div className="flex items-center justify-center gap-2">
            <div className="flex">
              {/* Use a skeleton component for the stars' color */}
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-[30px] w-[30px] rounded-full" />
              ))}
            </div>
          </div>
        </div>
        {/* Ratings Distribution Skeleton */}
        <div className="w-full md:w-fit">
          <ul className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <li
                key={i}
                className="flex gap-2 items-center justify-center md:justify-start"
              >
                <Skeleton className="h-[15px] w-[15px] rounded-full" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-2 w-40" />
                <Skeleton className="h-4 w-8" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Individual Review Cards Skeleton */}
      <section className="text-sm sm:text-base border-t-2 border-gray-200">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="mt-10 py-10 lg:px-40 w-full flex flex-col lg:flex-row gap-5 lg:gap-40 border-b-2 border-gray-200"
          >
            {/* User Info Skeleton */}
            <div className="flex items-center lg:items-start gap-5">
              <Skeleton className="rounded-full w-20 h-20 sm:w-30 sm:h-30" />
              <div className="space-y-4 min-w-[200px]">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
            {/* Review Content Skeleton */}
            <div className="w-full">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton
                      key={i}
                      className="h-[24px] w-[24px] rounded-full"
                    />
                  ))}
                </div>
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="space-y-2 mt-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="text-end mt-10">
                <Skeleton className="h-10 w-[300px] sm:w-44 ml-auto" />
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};

export default ReviewsSkeleton;
