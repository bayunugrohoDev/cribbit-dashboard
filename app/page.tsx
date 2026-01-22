import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background text-foreground">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold tracking-tight lg:text-6xl">
          Welcome to Cribbit Dashboard
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your portal to manage real estate bids and properties efficiently.
          Please log in to access your dashboard.
        </p>
        <div className="flex justify-center">
          <Button asChild size="lg">
            <Link href="/login">
              Login to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
