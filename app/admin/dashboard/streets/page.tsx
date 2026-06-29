import React from "react";
import Streets from "./_components/Streets";

export const metadata = {
  title: "Street Interests | Cribbit Dashboard",
  description: "View the streets users have shown interest in.",
};

export default function StreetsPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="px-4 lg:px-6 pt-6">
        <h1 className="text-2xl font-bold tracking-tight">Street Interests</h1>
        <p className="text-muted-foreground mt-2">
          Track which streets users are most interested in, combined from both direct street watches and specific property watches.
        </p>
      </div>
      <Streets />
    </div>
  );
}
