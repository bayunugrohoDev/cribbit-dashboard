import z from "zod";

export const ownerSchema = z.object({
  id: z.string().uuid(),
  claim_type: z.string().nullable(),
  created_at: z.string().nullable(),
  status: z.string().nullable(),
  verification_method: z.string().nullable(),
  profile: z
    .object({
      full_name: z.string().nullable(),
      email: z.string().nullable(),
      avatar_url: z.string().nullable(),
    })
    .nullable(),
  location: z
    .object({
      formatted_address: z.string().nullable(),
      city: z.string().nullable(),
    })
    .nullable(),
});

export type OwnerSchema = z.infer<typeof ownerSchema>;
