import { Metadata } from "next";
import { InterestsClient } from "./_components/InterestsClient";

export const metadata: Metadata = {
  title: "Property Interests - Cribbit Admin",
  description: "View all users interested in properties",
};

export default function PropertyInterestsPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="px-4 lg:px-6 pt-6">
        <h1 className="text-2xl font-bold tracking-tight">Property Interests</h1>
        <p className="text-muted-foreground mt-2">
          Track users who have watched or expressed interest in specific addresses.
        </p>
      </div>
      <div className="px-4 lg:px-6">
        <InterestsClient />
      </div>
    </div>
  );
}
