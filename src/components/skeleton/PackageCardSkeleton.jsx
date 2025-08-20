// src/components/skeletons/PackageGridSkeleton.jsx
import { Skeleton } from "@/components/ui/skeleton";

// This component is a skeleton for a single card in the grid.
// It should match the general structure of your real `CategoryCard`.
const PackageCardSkeleton = () => {
  return (
    <div className="border-2 border-slate-200 rounded-lg p-4 space-y-4">
      {/* Image placeholder */}
      <Skeleton className="h-40 w-full rounded-md" />

      {/* Title placeholder */}
      <Skeleton className="h-6 w-3/4" />

      {/* Price and Rating placeholder */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-7 w-1/4" />
        <Skeleton className="h-5 w-1/2" />
      </div>

      {/* Buttons placeholder */}
      <div className="flex gap-3 pt-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
};

// This component renders the full grid of skeleton cards.
export const PackageGridSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, index) => (
        <PackageCardSkeleton key={index} />
      ))}
    </div>
  );
};
