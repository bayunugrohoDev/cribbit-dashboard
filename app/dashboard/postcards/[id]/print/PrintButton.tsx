"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useEffect } from "react";

export default function PrintButton() {
  useEffect(() => {
    // Optionally auto-print after a short delay
    const timer = setTimeout(() => {
      window.print();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Button onClick={() => window.print()} className="gap-2">
      <Printer className="h-4 w-4" />
      Print Postcard
    </Button>
  );
}
