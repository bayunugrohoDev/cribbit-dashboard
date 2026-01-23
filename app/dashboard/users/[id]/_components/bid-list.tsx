import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Data dummy yang sudah disesuaikan (tanpa userAvatar, status, price_min/max)
const properties = [

  {
    id: "BID-1312",
    route: "Elmegatan",
    streetNumber: "12A",
    postal_town: "Stockholm",
    owner: "-",
    total_bids: 2222311,
    date: "2024-07-20T10:30:00Z",
  },
  {
    id: "BID-7878",
    route: "Björkvägen",
    streetNumber: "5",
    postal_town: "Göteborg",
    owner: "Jackson Lee",
    total_bids: 3000000,
    date: "2024-07-20T11:00:00Z",
  },
];

export function UserBids() {
  return (
    <Table>
      <TableCaption>A list of recent property bids.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[250px]">Address</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {properties.map((property) => (
          <TableRow key={property.id}>
            <TableCell className="font-medium">
              {property.route} {property.streetNumber}, {property.postal_town}
            </TableCell>
            <TableCell>{property.owner}</TableCell>
            <TableCell>{property.total_bids} SEK</TableCell>
            <TableCell>
              {new Date(property.date).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </TableCell>
            <TableCell className="text-right">
              <Badge className="bg-amber-100 text-amber-700">Requested</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
