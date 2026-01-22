import { z } from "zod";
import { bidSchema } from "@/app/dashboard/bids/_components/schema";

export const fetchBids = async () => {
  const response = await fetch("/api/bids");

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  
  return z.array(bidSchema).parse(data);
};
