import { z } from "zod";

export const streetInterestSchema = z.object({
  id: z.string(),
  street: z.string(),
  city: z.string(),
  totalInterests: z.number().int().nonnegative(),
  houseInterests: z.number().int().nonnegative(),
  streetInterests: z.number().int().nonnegative(),
  properties: z.array(z.object({
    id: z.string(),
    streetNumber: z.string().nullable(),
  })),
});

export type StreetInterest = z.infer<typeof streetInterestSchema>;
export type StreetInterests = StreetInterest[];
