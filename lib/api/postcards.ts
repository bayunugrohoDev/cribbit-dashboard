import { z } from "zod";
import { postcardOrderSchema } from "@/app/dashboard/postcards/_components/schema";

export const fetchPostcards = async () => {
  const response = await fetch("/api/postcards");

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return z.array(postcardOrderSchema).parse(data);
};
