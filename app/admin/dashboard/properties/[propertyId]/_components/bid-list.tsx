import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { User } from "@supabase/supabase-js";
import { EllipsisVertical } from "lucide-react";
import Link from "next/link";

// Helper styling untuk status Bidding
const getBidStatusBadge = (status: string) => {
  const styles: Record<string, string> = {
    Winning: "bg-green-100 text-green-700 hover:bg-green-100 border-green-200",
    Outbid: "bg-red-100 text-red-700 hover:bg-red-100 border-red-200",
    Accepted: "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200",
    Pending: "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200",
  };
  return <Badge variant="outline" className={`${styles[status]} font-medium`}>{status}</Badge>;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("sv-SE").format(amount);
};

interface Bid extends Tables<"bids"> {
  profiles: Tables<"profiles">;
}

interface UserBidsProps {
  bids: Bid[] | null;
  currentUser: User | null;
}

export function UserBids({ bids, currentUser }: UserBidsProps) {
  if (!bids || bids.length === 0) {
    return <p>No bids for this property yet.</p>;
  }
  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>Monitoring user bidding status and price ranges.</TableCaption>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[200px]">User</TableHead>
            <TableHead>Price Range (SEK)</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Bid Status</TableHead>
            <TableHead className="w-[80px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bids.map((bid) => (
            <TableRow key={bid.id} className={bid.user_id === currentUser?.id ? "bg-blue-50" : ""}>
              <TableCell className="font-medium">{bid.profiles.full_name}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm">
                    {formatCurrency(bid.price_min || 0)} - {formatCurrency(bid.price_max || 0)}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {new Date(bid.created_at || "").toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell>{getBidStatusBadge(bid.status || "Unknown")}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <EllipsisVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[180px]">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/users/${bid.user_id}`}>View Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Message User</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-blue-600">Accept Bid</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Reject Bid</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}