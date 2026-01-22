import React from "react";
import { Skeleton } from "./skeleton";

export const LoadingSkeleton = () => {
  return (
    <div className="p-6">
      <div className="rounded-lg  overflow-hidden">
        <div className="space-y-4">
          <div className="rounded-lg border overflow-hidden">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
};
