import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const EditBranchDetailsSkeleton = () => {
  return (
    <div className="animate-pulse space-y-8 max-w-4xl mx-auto">
      {/* --- Basic Information Card Skeleton --- */}
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-1/4" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Text Input Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
          {/* Textarea Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-20 w-full" />
          </div>
          {/* Select Input Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          {/* Coordinates Section Skeleton */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-9 w-1/4" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- Skeleton for a single card (e.g., City or Categories) --- */}
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-1/5" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>

      {/* --- Skeleton for an Editable Table --- */}
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-1/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Simulate two rows of a table */}
          <div className="grid grid-cols-4 gap-4">
            <Skeleton className="h-10 w-full col-span-3" />
            <Skeleton className="h-10 w-10" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <Skeleton className="h-10 w-full col-span-3" />
            <Skeleton className="h-10 w-10" />
          </div>
          {/* Add button skeleton */}
          <Skeleton className="h-10 w-32 mt-4" />
        </CardContent>
      </Card>

      {/* --- Repeat for other tables --- */}
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-1/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <Skeleton className="h-10 w-full col-span-3" />
            <Skeleton className="h-10 w-10" />
          </div>
          <Skeleton className="h-10 w-32 mt-4" />
        </CardContent>
      </Card>

      {/* --- Action Buttons Skeleton --- */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
};

export default EditBranchDetailsSkeleton;
