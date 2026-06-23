import z from "zod";

export const propertySchemaDetail = z.object({
  id: z.string(),
  formatted_address: z.string(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  city: z.string().nullable(),
  country: z.string().nullable(),
  street: z.string().nullable(),
  street_number: z.string().nullable(),
  postal_code: z.string().nullable(),
  region: z.string().nullable(),
  place_id: z.string(),
});
