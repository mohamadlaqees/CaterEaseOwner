import { Skeleton } from "@/components/ui/skeleton";
import { Store } from "lucide-react";

const MenuSkeleton = () => {
  // This function creates a skeleton for a single branch card.
  const BranchCardSkeleton = () => (
    <div className="border border-gray-200 rounded-lg shadow-sm">
      {/* Skeleton for the branch header */}
      <header className="p-4 border-b bg-gray-50 rounded-t-lg">
        <div className="flex items-center">
          <Store className="mr-3 text-gray-300" />
          <Skeleton className="h-7 w-48 rounded-md" />
        </div>
        <Skeleton className="h-5 w-64 rounded-md mt-2" />
      </header>

      {/* Skeleton for the grid of categories within the branch */}
      <div className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* Render 5 skeleton category items per branch */}
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="block text-center space-y-2 border-2 border-gray-200 rounded-md p-3"
            >
              <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-md mx-auto" />
              <Skeleton className="h-6 w-24 rounded-md mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <main className="p-4 sm:p-6 md:p-10 animate-pulse">
      {/* Skeleton for the branch cards */}
      <div className="space-y-8">
        <BranchCardSkeleton />
        <BranchCardSkeleton />
      </div>
    </main>
  );
};

export default MenuSkeleton;
