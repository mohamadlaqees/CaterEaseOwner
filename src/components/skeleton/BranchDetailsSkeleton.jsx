import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const BranchDetailsSkeleton = () => {
  return (
    <main className="p-4 sm:p-6 md:p-10 bg-gray-50 min-h-screen">
      {/* Skeleton for Main Details Card */}
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Circular Image Skeleton */}
            <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 rounded-full" />
            <div className="flex-1 pt-2 space-y-3">
              {/* Title Skeleton */}
              <Skeleton className="h-8 w-3/4" />
              {/* Location Skeleton */}
              <Skeleton className="h-5 w-1/2" />
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phone Skeleton */}
                <Skeleton className="h-5 w-full" />
                {/* Manager Skeleton */}
                <Skeleton className="h-5 w-full" />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Skeleton for Categories Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <Skeleton className="h-7 w-1/3" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
          </CardContent>
        </Card>

        {/* Skeleton for Occasions Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <Skeleton className="h-7 w-1/3" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-20" />
            </div>
          </CardContent>
        </Card>

        {/* Skeleton for Working Hours Card */}
        <Card className="shadow-lg lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-7 w-1/4" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </CardContent>
        </Card>

        {/* Skeleton for Services Card */}
        <Card className="shadow-lg lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-7 w-1/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <div className="w-2/3 space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-6 w-1/6" />
            </div>
            <div className="flex justify-between">
              <div className="w-2/3 space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-6 w-1/6" />
            </div>
          </CardContent>
        </Card>

        {/* Skeleton for Delivery Regions Card */}
        <Card className="shadow-lg lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-7 w-1/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <div className="w-2/3 space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-6 w-1/6" />
            </div>
            <div className="flex justify-between">
              <div className="w-2/3 space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-6 w-1/6" />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default BranchDetailsSkeleton;
