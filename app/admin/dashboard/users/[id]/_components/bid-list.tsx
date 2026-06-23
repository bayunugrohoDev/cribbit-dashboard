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
import { Tables } from "@/lib/supabase/database.types";

interface Bid extends Tables<"bids"> {
  locations: Tables<"locations">;
}

interface UserBidsProps {
  bids: Bid[] | null;
}

export function UserBids({ bids }: UserBidsProps) {
  if (!bids || bids.length === 0) {
    return <p>This user has not made any bids yet.</p>;
  }
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
        {bids.map((bid) => (
          <TableRow key={bid.id}>
            <TableCell className="font-medium">
              {bid.locations.formatted_address}
            </TableCell>
            <TableCell>-</TableCell>
            <TableCell>{bid.price_min + "-" + bid.price_max} SEK</TableCell>
            <TableCell>
              {new Date(bid.created_at || "").toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </TableCell>
            <TableCell className="text-right">
              <Badge className="bg-amber-100 text-amber-700">
                {bid.status || "Unknown"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
