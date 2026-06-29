import { z } from "zod";

export const propertyInterestSchema = z.object({
  id: z.string(),
  address: z.string(),
  watcher: z.object({
    name: z.string().nullable(),
    email: z.string().nullable(),
    avatarUrl: z.string().nullable(),
  }),
  budget_min: z.number().nullable(),
  budget_max: z.number().nullable(),
  owner: z.object({
    name: z.string().nullable(),
    email: z.string().nullable(),
    avatarUrl: z.string().nullable(),
  }),
  date: z.string(),
  scope: z.string(),
  watcher_id: z.string(),
  location_id: z.string().nullable(),
});

export type PropertyInterest = z.infer<typeof propertyInterestSchema>;
