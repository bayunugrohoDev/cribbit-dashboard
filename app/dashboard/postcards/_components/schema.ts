import { z } from "zod";

export const postcardOrderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  userName: z.string(),
  userAvatar: z.string().optional().nullable(),
  locations: z.object({
    location_id: z.string().nullable(),
    route: z.string().nullable(),
    streetNumber: z.string().nullable(),
    postal_town: z.string().nullable(),
  }),
  price_min: z.number(),
  price_max: z.number(),
  amount: z.number(),
  currency: z.string(),
  status: z.enum(["pending", "paid", "sent", "failed", "cancelled"]),
  date: z.string(),
  paid_at: z.string().nullable(),
  sent_at: z.string().nullable(),
  adminNote: z.string().optional().nullable(),
  qrToken: z.string().optional().nullable(),
  stripePaymentIntentId: z.string().optional().nullable(),
  stripeChargeId: z.string().optional().nullable(),
  unreadCount: z.number().optional().default(0),
});

export type PostcardOrder = z.infer<typeof postcardOrderSchema>;
