import { z } from "zod";

export const propertySchema = z.object({
  id: z.string().min(1, "ID wajib diisi"),
  route: z.string().min(1, "Nama jalan wajib diisi"),
  streetNumber: z.string().min(1, "Nomor rumah wajib diisi"),
  postal_town: z.string().min(1, "Kota wajib diisi"),
  owner: z.string().min(1, "Nama pemilik wajib diisi"),
  agent: z.string().optional(),
  source: z.enum(["Agent Post", "User Post"]),
  // Tambahan yang tertinggal:
  status: z.enum(["Active", "Pending", "Sold", "Requested"]),
  listingPrice: z.number().optional(),
  currentHighestBid: z.number().optional(),
  
  total_bids: z.number().int().nonnegative(),
  date: z.string().datetime(),
});

export type Properties = z.infer<typeof propertySchema>;