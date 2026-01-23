// app/dashboard/properties/[propertyId]/page.tsx

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Bids from "../../bids/_components/Bids";
import { Badge } from "@/components/ui/badge";
import { UserBids } from "./_components/bid-list";

interface Bidder {
  id: string;
  name: string;
  avatar: string;
  bidAmount: string;
}

interface PropertyDetails {
  id: string;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
  bidders: Bidder[];
}

// Mock data
const mockProperty: PropertyDetails = {
  id: "123",
  address: "Elmegatan 12, Stockholm",
  description:
    "A beautiful 3-bedroom, 2-bathroom house with a spacious backyard and modern amenities. Located in a quiet neighborhood close to schools and parks.",
  latitude: 59.327422, // Example latitude (Los Angeles)
  longitude: 18.054326, // Example longitude (Los Angeles)
  bidders: [
    {
      id: "b1",
      name: "Alice Smith",
      avatar: "https://github.com/shadcn.png",
      bidAmount: "$500,000",
    },
    {
      id: "b2",
      name: "Bob Johnson",
      avatar: "https://github.com/shadcn.png",
      bidAmount: "$510,000",
    },
    {
      id: "b3",
      name: "Charlie Brown",
      avatar: "https://github.com/shadcn.png",
      bidAmount: "$495,000",
    },
  ],
};

export default function PropertyDetailPage({
  params,
}: {
  params: { propertyId: string };
}) {
  const property = mockProperty; // In a real app, fetch property data based on params.propertyId

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <h1 className="text-3xl font-bold">
         {property.address}
      </h1>
      {/* <p className="text-muted-foreground">ID: {params.propertyId}</p> */}

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
                // Gunakan mode 'view' dengan maptype=satellite
                src={`https://www.google.com/maps/embed/v1/view?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&center=${property.latitude},${property.longitude}&zoom=19&maptype=satellite`}
              ></iframe>
            </div>
            <p className="text-sm text-muted-foreground mt-2 font-mono">
              Coords: {property.latitude.toFixed(6)},{" "}
              {property.longitude.toFixed(6)}
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Property Information</CardTitle>
            {/* <CardDescription>Details about the property.</CardDescription> */}
          </CardHeader>
          <CardContent className="space-y-4 h-full">
            <div>
              <h3 className="text-lg font-semibold">Address</h3>
              <p>{property.address}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Description</h3>
              <p>{property.description}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Owner</h3>
              <p>Johan Doe</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Agent</h3>
              <p>Sam </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Status</h3>
              <Badge
                className={`bg-green-100 text-green-700 border-none shadow-none`}
              >
                Active
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
          <UserBids />
        </CardContent>
      </Card>
    </div>
  );
}
