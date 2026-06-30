"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchWatchesByLocationId } from "@/lib/api/interests";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { PropertyInterest } from "@/app/admin/dashboard/property-interests/_components/schema";

export function InterestList({ propertyId }: { propertyId: string }) {
  const { data: interests, isLoading, isError } = useQuery({
    queryKey: ["propertyInterests", propertyId],
    queryFn: () => fetchWatchesByLocationId(propertyId),
    enabled: !!propertyId,
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return <div className="p-4 text-red-500">Error loading interests.</div>;
  }

  if (!interests || interests.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed text-muted-foreground">
        No active interests found.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <div className="divide-y">
        {interests.map((interest: PropertyInterest) => {
          const watcherName = interest.watcher.name || "Anonymous";
          const watcherAvatar = interest.watcher.avatarUrl;
          const min = interest.budget_min;
          const max = interest.budget_max;

          return (
            <div key={interest.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  {watcherAvatar && <AvatarImage src={watcherAvatar} alt={watcherName} />}
                  <AvatarFallback>{watcherName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <Link href={`/admin/dashboard/users/${interest.watcher_id}`} className="font-medium hover:underline">
                    {watcherName}
                  </Link>
                  <div className="text-sm text-muted-foreground">
                    {interest.watcher.email}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">
                  {min || max ? (
                    <>
                      {min?.toLocaleString("sv-SE")} - {max?.toLocaleString("sv-SE")} SEK
                    </>
                  ) : (
                    "No budget set"
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {interest.scope === "street" ? "Street Interest" : "Property Interest"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
