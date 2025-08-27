// src/components/skeleton/FeedbackSkeleton.js

import { Skeleton } from "@/components/ui/skeleton";

const ListItemsSkeleton = () => {
  return (
    <div className="p-6 mb-4 border rounded-lg shadow-sm bg-white">
      {/* Top Row: Title and Status Badge */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-7 w-3/5" /> {/* Mimics item.title */}
        <Skeleton className="h-6 w-24 rounded-full" />{" "}
        {/* Mimics status badge */}
      </div>

      {/* Bottom Row: Date and optional Stars */}
      <div className="flex items-center justify-between mt-3">
        <Skeleton className="h-5 w-1/4" /> {/* Mimics item.date */}
      </div>
    </div>
  );
};

const ReportsSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Render 3 placeholder items of the specified type */}
      {[...Array(3)].map((_, i) => (
        <ListItemsSkeleton key={i} />
      ))}
    </div>
  );
};

export default ReportsSkeleton;
