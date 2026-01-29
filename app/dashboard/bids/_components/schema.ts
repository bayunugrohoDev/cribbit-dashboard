import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a more complex schema with relations between users, properties, etc.
export const bidSchema = z.object({
  id: z.string(),
  userName: z.string(),
  userAvatar: z.string().optional(),
  locations: z.object({
    location_id: z.string(),
    route: z.string(),
    streetNumber: z.string(),
    postal_town: z.string(),
  }),
  // route: z.string(),
  // streetNumber: z.string(),
  // postal_town: z.string(),
  price_min: z.number(),
  price_max: z.number(),
  date: z.string(),
  status: z.enum(["Winning", "Outbid", "Accepted", "Pending"]),
});

export type Bid = z.infer<typeof bidSchema>;
