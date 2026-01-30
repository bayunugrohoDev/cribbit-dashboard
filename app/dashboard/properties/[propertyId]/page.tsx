"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserBids } from "./_components/bid-list";
import { useQuery } from "@tanstack/react-query";
import { fetchPropertiesDetail } from "@/lib/api/properties";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { useParams } from "next/navigation";
import { getCurrentUser } from "@/lib/api/users";
import { fetchBidsByLocationId } from "@/lib/api/bids";

export default function PropertyDetailPage() {
  const params = useParams<{ propertyId: string }>();

  const {
    data: property,
    isLoading: isPropertyLoading,
    isError: isPropertyError,
  } = useQuery({
    queryKey: ["property", params.propertyId],
    queryFn: () => fetchPropertiesDetail(params.propertyId),
    enabled: !!params.propertyId,
  });

  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => getCurrentUser(),
  });

  const {
    data: bids,
    isLoading: isBidsLoading,
    isError: isBidsError,
  } = useQuery({
    queryKey: ["bids", params.propertyId],
    queryFn: () => fetchBidsByLocationId(params.propertyId),
    enabled: !!params.propertyId,
  });

  if (isPropertyLoading || isUserLoading || isBidsLoading) {
    return <LoadingSkeleton />;
  }

  if (isPropertyError || isUserError || isBidsError || !property) {
    return (
      <div className="flex flex-col gap-4 p-4 md:p-8">
        <h1 className="text-3xl font-bold text-red-500">
          Error fetching data.
        </h1>
        <p>Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <h1 className="text-3xl font-bold">{property.formatted_address}</h1>

      {/* Property Information */}
      <div className="grid grid-cols-12 space-x-4">
        {/* Map */}
        <Card className="grid col-span-8">
          <CardHeader>
            <CardTitle>Location</CardTitle>
            <CardDescription>Property location on the map.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-hidden rounded-md border">
              <iframe
                width="100%"
                height="400"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/view?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&center=${property.latitude},${property.longitude}&zoom=19&maptype=satellite`}
              ></iframe>
            </div>
            <p className="text-sm text-muted-foreground mt-2 font-mono">
              Coords: {property.latitude?.toFixed(6)},{" "}
              {property.longitude?.toFixed(6)}
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Property Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 h-full">
            <div>
              <h3 className="text-lg font-semibold">Address</h3>
              <p>{property.formatted_address}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Description</h3>
              <p>No description available for this location.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Owner</h3>
              <p>N/A (Locations table does not contain owner info)</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Agent</h3>
              <p>N/A (Locations table does not contain agent info)</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Status</h3>
              <Badge
                className={`bg-gray-100 text-gray-700 border-none shadow-none`}
              >
                Unknown (Locations table does not contain status info)
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bidders List */}
      <Card>
        <CardHeader>
          <CardTitle>Bidders</CardTitle>
          <CardDescription>
            Users who have bid on this property.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserBids bids={bids} currentUser={user} />
        </CardContent>
      </Card>
    </div>
  );
}
