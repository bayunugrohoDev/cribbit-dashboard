import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a more complex schema with relations between users, properties, etc.
export const bidSchema = z.object({
  id: z.string(),
  userId: z.string(),
  userName: z.string(),
  userAvatar: z.string().optional(),
  locations: z.object({
    location_id: z.string().nullable(),
    route: z.string().nullable(),
    streetNumber: z.string().nullable(),
    postal_town: z.string().nullable(),
  }),
  // route: z.string(),
  // streetNumber: z.string(),
  // postal_town: z.string(),
  price_min: z.number(),
  price_max: z.number(),
  date: z.string(),
  status: z.enum(["Winning", "Outbid", "Accepted", "Pending"]),
  contact_method: z.string().optional(),
  has_loan_promise: z.string().nullable().optional(),
  must_sell_first: z.boolean().nullable().optional(),
  move_in_timeline: z.string().nullable().optional(),
  message: z.string().nullable().optional(),
});

export type Bid = z.infer<typeof bidSchema>;
