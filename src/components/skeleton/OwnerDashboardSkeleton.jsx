import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const OwnerDashboardSkeleton = () => {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-pulse">
      {/* --- Main KPI Cards Skeleton --- */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-3/5" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-2/5 mb-2" />
              <Skeleton className="h-3 w-4/5" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* --- Charts Section Skeleton --- */}
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        {/* Branch Performance Chart Skeleton */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-3/4 mt-2" />
          </CardHeader>
          <CardContent>
            {/* Placeholder for the bar chart */}
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>

        {/* Monthly Revenue Chart Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-full mt-2" />
          </CardHeader>
          <CardContent>
            {/* Placeholder for the line chart */}
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>

      {/* --- Top Selling Items Table Skeleton --- */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-2/3 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Table Header Skeleton */}
            <div className="flex justify-between">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-5 w-1/4" />
            </div>
            {/* Table Body Skeleton */}
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex justify-between items-center border-t pt-4"
              >
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-5 w-1/4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
};
