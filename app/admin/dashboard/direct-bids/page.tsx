import { Metadata } from "next";
import { DirectBidsClient } from "./_components/DirectBidsClient";

export const metadata: Metadata = {
  title: "Direct Bids - Cribbit Admin",
  description: "View all direct bids made to property owners",
};

export default function DirectBidsPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="px-4 lg:px-6 pt-6">
        <h1 className="text-2xl font-bold tracking-tight">Direct Bids</h1>
        <p className="text-muted-foreground mt-2">
          Track users who have officially bid on claimed properties and contacted the owner directly.
        </p>
      </div>
      <div className="px-4 lg:px-6">
        <DirectBidsClient />
      </div>
    </div>
  );
}
