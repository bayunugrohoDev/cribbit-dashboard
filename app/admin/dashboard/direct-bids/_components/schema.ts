import { z } from "zod";

export const directBidSchema = z.object({
  id: z.string(),
  date: z.string(),
  address: z.string(),
  watcher: z.object({
    name: z.string(),
    email: z.string(),
    avatarUrl: z.string().nullable(),
  }),
  owner: z.object({
    id: z.string().nullable(),
    name: z.string(),
    email: z.string(),
    avatarUrl: z.string().nullable(),
  }),
  budget_min: z.number().nullable(),
  budget_max: z.number().nullable(),
  message: z.string().nullable(),
  watcher_id: z.string(),
  location_id: z.string().nullable(),
});

export type DirectBid = z.infer<typeof directBidSchema>;
